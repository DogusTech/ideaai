#!/usr/bin/env node
/*
 * Headless Night Shift worker. It intentionally uses a JSON state file so the
 * Electron app can ship without native database bindings.
 */
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const os = require('os');
const { execFile, spawn } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

const LOCAL_OLLAMA_NUM_CTX = 8192;
const LOCAL_OLLAMA_OUTPUT_RESERVE_TOKENS = 1280;
const LOCAL_CONTEXT_TRUNCATION_MARKER = '… [earlier conversation truncated to fit the local model context window]';

function estimateOllamaTokens(value) {
  const text = String(value || '');
  return text ? Math.ceil(text.length / 2.5) : 0;
}

function truncateOllamaText(value, maxTokens, marker = '\n… [context truncated to fit the local model]') {
  const text = String(value || '');
  if (maxTokens <= 0) return '';
  if (estimateOllamaTokens(text) <= maxTokens) return text;
  return `${text.slice(0, Math.max(0, Math.floor(maxTokens * 2.5) - marker.length - 1))}${marker}`;
}

function packOllamaMessages(messages, contextWindow, reserveTokens = LOCAL_OLLAMA_OUTPUT_RESERVE_TOKENS) {
  const contentBudget = Math.max(768, Math.max(1024, contextWindow) - Math.max(0, reserveTokens) - estimateOllamaTokens(LOCAL_CONTEXT_TRUNCATION_MARKER) - 8);
  const normalized = (Array.isArray(messages) ? messages : [])
    .filter((message) => message && typeof message.content === 'string')
    .map((message) => ({ role: String(message.role || 'user'), content: message.content }));
  if (!normalized.length) return [];
  const systemContent = truncateOllamaText(
    normalized.filter((message) => message.role === 'system').map((message) => message.content).join('\n\n'),
    Math.max(256, Math.floor(contentBudget * 0.6))
  );
  const conversational = normalized.filter((message) => message.role !== 'system');
  let remaining = Math.max(256, contentBudget - estimateOllamaTokens(systemContent));
  const selected = [];
  for (const message of [...conversational].reverse()) {
    if (selected.length >= 23 || remaining <= 24) break;
    const tokens = estimateOllamaTokens(message.content);
    if (tokens <= remaining) { selected.push(message); remaining -= tokens; continue; }
    const truncated = truncateOllamaText(message.content, Math.max(64, remaining - 8));
    if (truncated) selected.push({ ...message, content: truncated });
    break;
  }
  selected.reverse();
  const droppedHistory = selected.length < conversational.length;
  const packed = [];
  if (systemContent) packed.push({ role: 'system', content: droppedHistory ? `${systemContent}\n\n${LOCAL_CONTEXT_TRUNCATION_MARKER}` : systemContent });
  else if (droppedHistory) packed.push({ role: 'system', content: LOCAL_CONTEXT_TRUNCATION_MARKER });
  return [...packed, ...selected];
}

const args = process.argv.slice(2);
const arg = (name, fallback = '') => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] || fallback : fallback;
};
const statePath = path.resolve(arg('--state', path.join(os.homedir(), '.togetlinkk-data', 'nightshift-state.json')));
const scheduled = args.includes('--scheduled');
const testMode = args.includes('--test');
const once = scheduled || testMode || args.includes('--once');
const defaultState = {
  version: 1,
  queue: [],
  schedule: { enabled: false, time: '09:00', frequency: 'Every day', wake: true },
  logs: [],
  audit: [],
  runs: {},
  remoteWorker: { enabled: false, endpoint: '', token: '' },
};

async function readState() {
  try { return { ...defaultState, ...JSON.parse(await fsp.readFile(statePath, 'utf8')) }; }
  catch { return { ...defaultState, queue: [], logs: [], audit: [], runs: {} }; }
}

async function writeState(state) {
  await fsp.mkdir(path.dirname(statePath), { recursive: true });
  const temp = `${statePath}.tmp`;
  await fsp.writeFile(temp, JSON.stringify(state, null, 2), 'utf8');
  await fsp.rename(temp, statePath);
}

function stamp() { return new Date().toISOString(); }

async function appendLog(state, runId, level, message) {
  const item = { timestamp: stamp(), level, message: String(message) };
  state.logs = [...(state.logs || []), { ...item, runId }].slice(-500);
  if (runId && state.runs[runId]) state.runs[runId].logs = [...(state.runs[runId].logs || []), item].slice(-300);
  await writeState(state);
  process.stdout.write(`${item.timestamp} ${level.toUpperCase()} ${item.message}\n`);
}

async function audit(state, runId, action, detail) {
  state.audit = [...(state.audit || []), { timestamp: stamp(), runId, action, detail, egress: 'zero-egress-local' }].slice(-300);
  await writeState(state);
}

function run(command, commandArgs, options = {}) {
  return execFileAsync(command, commandArgs, { windowsHide: true, timeout: options.timeout || 120000, cwd: options.cwd, maxBuffer: 8 * 1024 * 1024 });
}

async function runShell(command, cwd, onLine) {
  return new Promise((resolve) => {
    const child = spawn(process.platform === 'win32' ? 'powershell.exe' : 'sh', process.platform === 'win32' ? ['-NoProfile', '-NonInteractive', '-Command', command] : ['-lc', command], { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const consume = (level, chunk) => {
      const text = String(chunk || '');
      if (level === 'stdout') stdout += text; else stderr += text;
      text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).forEach((line) => onLine(level, line));
    };
    child.stdout.on('data', (chunk) => consume('stdout', chunk));
    child.stderr.on('data', (chunk) => consume('stderr', chunk));
    child.on('error', (error) => resolve({ success: false, stdout, stderr: error.message }));
    child.on('close', (code) => resolve({ success: code === 0, code, stdout, stderr }));
  });
}

function safeRelative(filePath) {
  const normalized = path.normalize(String(filePath || ''));
  return normalized !== '..' && !normalized.startsWith(`..${path.sep}`) && !path.isAbsolute(normalized) ? normalized : null;
}

async function askOllama(model, prompt, onToken) {
  if (process.env.NIGHTSHIFT_TEST_STREAM) {
    let text = '';
    for (const line of String(process.env.NIGHTSHIFT_TEST_STREAM).split(/\r?\n/)) {
      if (!line.trim()) continue;
      const item = JSON.parse(line);
      const token = String(item.message?.content || '');
      text += token; if (token) onToken(token);
    }
    return text;
  }
  const base = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
  const probe = async () => { const result = await fetch(`${base}/api/tags`, { signal: AbortSignal.timeout(900) }); return result.ok; };
  try { if (!(await probe())) throw new Error('Ollama is not ready.'); } catch {
    try { const child = spawn('ollama', ['serve'], { detached: true, windowsHide: true, stdio: 'ignore' }); child.unref(); } catch { throw new Error('Ollama is not installed.'); }
    const deadline = Date.now() + 8000;
    let ready = false;
    while (Date.now() < deadline) { try { if (await probe()) { ready = true; break; } } catch {} await new Promise((resolve) => setTimeout(resolve, 350)); }
    if (!ready) throw new Error('Ollama did not become ready within 8 seconds.');
  }
  const activeModel = model || process.env.OLLAMA_MODEL || 'qwen2.5-coder:3b';
  const messages = [{ role: 'system', content: 'Always respond in clear, concise American English unless the user explicitly requests another language. You are Night Shift, a local coding worker. Make focused edits only. Prefer exact SEARCH / REPLACE patches inside <patch_file path="relative/path"> markers; use complete <write_file> blocks only when necessary. Do not use absolute paths.' }, { role: 'user', content: prompt }];
  const options = { num_ctx: LOCAL_OLLAMA_NUM_CTX, keep_alive: '15m', temperature: 0.1, top_p: 0.9, repeat_penalty: 1.05 };
  const packedMessages = packOllamaMessages(messages, LOCAL_OLLAMA_NUM_CTX);
  const payload = { model: activeModel, stream: true, options, messages: packedMessages };
  if (/(^|[-:])(deepseek-r1|qwen3|qwq)(?=[:\-]|$)/i.test(activeModel)) payload.think = false;
  let response = await fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (response.status === 400) {
    let firstBody = {}; try { firstBody = await response.json(); } catch {}
    const firstError = String(firstBody.error || 'Ollama rejected the chat request.');
    const retryMessages = /context|token|length|too long|prompt/i.test(firstError)
      ? packOllamaMessages(messages, Math.max(2048, Math.floor(LOCAL_OLLAMA_NUM_CTX / 2)), 512)
      : packedMessages;
    response = await fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: activeModel, messages: retryMessages, stream: true, options }) });
    if (!response.ok) { let retryBody = {}; try { retryBody = await response.json(); } catch {} throw new Error(String(retryBody.error || firstError)); }
  }
  if (!response.ok || !response.body) throw new Error(`Ollama returned ${response.status}.`);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    const lines = buffer.split(/\r?\n/); buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.trim()) continue;
      const item = JSON.parse(line);
      const token = String(item.message?.content || '');
      text += token; if (token) onToken(token);
    }
    if (done) break;
  }
  return text;
}

async function applyWrites(workspaceRoot, response, onWrite) {
  const writes = [...response.matchAll(/<write_file\s+path=["']([^"']+)["']>([\s\S]*?)<\/write_file>/gi)];
  for (const match of writes) {
    const relative = safeRelative(match[1]);
    if (!relative) continue;
    const target = path.join(workspaceRoot, relative);
    await fsp.mkdir(path.dirname(target), { recursive: true });
    await fsp.writeFile(target, match[2], 'utf8');
    onWrite(relative);
  }
  const patches = [...response.matchAll(/<patch_file\s+path=["']([^"']+)["']>([\s\S]*?)<\/patch_file>/gi)];
  for (const match of patches) {
    const relative = safeRelative(match[1]);
    const patch = match[2].match(/<<<<<<< SEARCH\s*\n([\s\S]*?)\n=======\s*\n([\s\S]*?)\n>>>>>>> REPLACE/);
    if (!relative || !patch) continue;
    const target = path.join(workspaceRoot, relative);
    const before = await fsp.readFile(target, 'utf8').catch(() => '');
    if (!before.includes(patch[1])) continue;
    await fsp.writeFile(target, before.replace(patch[1], patch[2]), 'utf8');
    onWrite(relative);
  }
  return writes.length + patches.length;
}

function verificationCommandForFile(relative) {
  const extension = path.extname(relative).toLowerCase();
  if (['.js', '.mjs', '.cjs'].includes(extension)) return ['node', ['--check', relative]];
  if (['.ts', '.tsx'].includes(extension)) return ['npx', ['tsc', '--noEmit', '--pretty', 'false', '--jsx', 'react-jsx', '--moduleResolution', 'bundler', '--module', 'esnext', '--target', 'es2022', relative]];
  if (extension === '.json') return [process.execPath, ['-e', `JSON.parse(require('fs').readFileSync(${JSON.stringify(relative)}, 'utf8'))`]];
  return null;
}

function parseGithubRemote(remote) {
  const match = String(remote || '').trim().replace(/\.git$/, '').match(/github\.com[/:]([^/]+)\/([^/]+)$/i);
  return match ? { owner: match[1], name: match[2] } : null;
}

async function pushAndOpenPr(workspaceRoot, branch, title, state, runId, log) {
  let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  if (!token) { try { token = (await run('gh', ['auth', 'token'], { cwd: workspaceRoot, timeout: 8000 })).stdout.trim(); } catch {} }
  if (!token) { await log('info', 'GitHub auth not configured; leaving the isolated branch local.'); return null; }
  await run('git', ['push', '-u', 'origin', branch], { cwd: workspaceRoot, timeout: 60000 });
  const remote = (await run('git', ['remote', 'get-url', 'origin'], { cwd: workspaceRoot })).stdout;
  const repository = parseGithubRemote(remote);
  if (!repository) { await log('info', 'Origin is not GitHub; skipped Pull Request creation.'); return null; }
  const response = await fetch(`https://api.github.com/repos/${repository.owner}/${repository.name}/pulls`, { method: 'POST', headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' }, body: JSON.stringify({ title, head: branch, base: 'main', body: `Created by Turaen Night Shift.\n\nRun: ${runId}` }) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `GitHub returned ${response.status}.`);
  await audit(state, runId, 'github_pull_request', payload.html_url);
  await log('info', `Opened Pull Request: ${payload.html_url}`);
  return payload.html_url;
}

async function executeTask(state, task, options = {}) {
  const workspaceRoot = path.resolve(task.workspaceRoot || options.workspaceRoot || process.cwd());
  const runId = task.runId || `nightshift-${Date.now()}`;
  const branch = `nightshift/${Date.now()}`;
  state.runs[runId] = { id: runId, status: 'running', branch, startedAt: stamp(), logs: [] };
  await writeState(state);
  const log = (level, message) => appendLog(state, runId, level, message);
  try {
    await log('info', `Starting isolated Night Shift branch ${branch}.`);
    await run('git', ['switch', '-c', branch], { cwd: workspaceRoot });
    await audit(state, runId, 'branch_created', branch);
    const prompt = `${task.title || task.taskPrompt}\nVerification command: ${task.verificationCommand || 'npm test'}\nWorkspace: ${workspaceRoot}`;
    await log('info', 'Checking Ollama readiness and starting local task.');
    const response = await askOllama(task.ollamaModel, prompt, (token) => { state.runs[runId].lastToken = token.slice(-240); });
    const writtenFiles = [];
    const writeCount = await applyWrites(workspaceRoot, response, (relative) => { writtenFiles.push(relative); void log('info', `Wrote ${relative}`); });
    let verificationFailures = [];
    for (const relative of writtenFiles) {
      const command = verificationCommandForFile(relative);
      if (!command) continue;
      try { await run(command[0], command[1], { cwd: workspaceRoot, timeout: 60_000 }); }
      catch (error) { verificationFailures.push({ relative, error: String(error.stderr || error.message || error) }); }
    }
    for (let repairPass = 0; verificationFailures.length && repairPass < 2; repairPass += 1) {
      await log('info', `Self-healing pass ${repairPass + 1}/2 for ${verificationFailures.length} verification error(s).`);
      const repairPrompt = `Repair these modified files using focused <patch_file> blocks. Always respond in clear, concise American English unless the user explicitly requests another language.\n${verificationFailures.map((item) => `${item.relative}: ${item.error}`).join('\n')}`;
      const repairResponse = await askOllama(task.ollamaModel, repairPrompt, () => {});
      writtenFiles.length = 0;
      await applyWrites(workspaceRoot, repairResponse, (relative) => writtenFiles.push(relative));
      verificationFailures = [];
      for (const relative of writtenFiles) {
        const command = verificationCommandForFile(relative);
        if (!command) continue;
        try { await run(command[0], command[1], { cwd: workspaceRoot, timeout: 60_000 }); }
        catch (error) { verificationFailures.push({ relative, error: String(error.stderr || error.message || error) }); }
      }
    }
    if (verificationFailures.length) throw new Error(`Post-edit verification failed for ${verificationFailures.map((item) => item.relative).join(', ')}.`);
    await log('info', `Model task complete (${writeCount} file write${writeCount === 1 ? '' : 's'}).`);
    await audit(state, runId, 'ollama_execution', 'zero-egress-local');
    const verification = await runShell(task.verificationCommand || 'npm test', workspaceRoot, (level, line) => { void log(level === 'stderr' ? 'error' : 'info', line); });
    if (!verification.success) throw new Error(`Verification failed with exit code ${verification.code}.`);
    await audit(state, runId, 'verification', `passed: ${task.verificationCommand || 'npm test'}`);
    if (writeCount > 0) {
      await run('git', ['add', '-A'], { cwd: workspaceRoot });
      const commitTitle = `feat: night shift ${task.title || 'workspace update'}`.slice(0, 120);
      await run('git', ['commit', '-m', commitTitle], { cwd: workspaceRoot });
      await log('info', `Committed changes on ${branch}.`);
      const prUrl = await pushAndOpenPr(workspaceRoot, branch, commitTitle, state, runId, log);
      if (prUrl) state.runs[runId].pullRequestUrl = prUrl;
    }
    state.runs[runId].status = 'completed';
    state.runs[runId].completedAt = stamp();
    await log('info', 'Night Shift completed successfully.');
  } catch (error) {
    state.runs[runId].status = 'failed';
    state.runs[runId].error = error.message;
    await audit(state, runId, 'failure', error.message);
    await log('error', error.message);
  } finally {
    await writeState(state);
  }
  return state.runs[runId];
}

async function runTest(state) {
  const workspaceRoot = path.resolve(arg('--workspace', process.cwd()));
  const runId = `health-check-${Date.now()}`;
  const temp = { runId, workspaceRoot, title: 'Run a lightweight Night Shift health check', verificationCommand: process.platform === 'win32' ? 'node --check nightshift-daemon.js' : 'node --check nightshift-daemon.js', ollamaModel: arg('--model', process.env.OLLAMA_MODEL || 'qwen2.5-coder:3b') };
  await appendLog(state, runId, 'info', 'Test Night Shift started.');
  const originalBranch = (await run('git', ['branch', '--show-current'], { cwd: workspaceRoot })).stdout.trim();
  await executeTask(state, temp, { workspaceRoot });
  const result = state.runs[runId];
  try { await run('git', ['switch', originalBranch || '-'], { cwd: workspaceRoot }); } catch {}
  try { if (result.branch) await run('git', ['branch', '-D', result.branch], { cwd: workspaceRoot }); } catch {}
  await appendLog(state, runId, result.status === 'completed' ? 'info' : 'error', `Test Night Shift ${result.status}.`);
  return result;
}

async function main() {
  const state = await readState();
  if (testMode) { await runTest(state); return; }
  const pending = state.queue.filter((task) => task.status !== 'completed' && task.status !== 'running');
  if (!pending.length) { await appendLog(state, 'daemon', 'info', scheduled ? 'Scheduled run found no queued tasks.' : 'Night Shift daemon is idle.'); return; }
  for (const task of pending) {
    task.status = 'running'; task.runId = task.runId || `nightshift-${Date.now()}`;
    await writeState(state);
    const result = await executeTask(state, task);
    task.status = result.status;
    task.completedAt = result.completedAt || stamp();
    await writeState(state);
  }
}

main().catch((error) => { process.stderr.write(`${error.stack || error.message}\n`); process.exitCode = 1; });

