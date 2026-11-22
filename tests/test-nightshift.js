#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = ''; let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve({ stdout, stderr }) : reject(new Error(`${command} exited ${code}: ${stderr || stdout}`)));
  });
}

async function main() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ideaai-nightshift-'));
  const statePath = path.join(root, 'state.json');
  const workspace = path.join(root, 'workspace');
  await fs.mkdir(workspace);
  await run('git', ['init'], { cwd: workspace });
  await run('git', ['config', 'user.email', 'nightshift@test.local'], { cwd: workspace });
  await run('git', ['config', 'user.name', 'Night Shift Test'], { cwd: workspace });
  await fs.writeFile(path.join(workspace, 'README.md'), '# health check\n');
  await run('git', ['add', 'README.md'], { cwd: workspace });
  await run('git', ['commit', '-m', 'chore: initialize test workspace'], { cwd: workspace });

  const ollama = http.createServer((request, response) => {
    if (request.url !== '/api/chat') { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
    response.write(JSON.stringify({ message: { content: 'health ' } }) + '\n');
    setTimeout(() => { response.write(JSON.stringify({ message: { content: 'check' } }) + '\n'); response.end(JSON.stringify({ done: true }) + '\n'); }, 10);
  });
  await new Promise((resolve) => ollama.listen(0, '127.0.0.1', resolve));
  const port = ollama.address().port;
  await fs.writeFile(statePath, JSON.stringify({ version: 1, queue: [{ id: 'task-1', title: 'health check', verificationCommand: 'node -e "process.stdout.write(\'verified\\n\')"', workspaceRoot: workspace, ollamaModel: 'mock' }], schedule: {}, logs: [], audit: [], runs: {} }));
  try {
    await run(process.execPath, [path.join(__dirname, '..', 'nightshift-daemon.js'), '--once', '--state', statePath], { cwd: workspace, env: { ...process.env, OLLAMA_BASE_URL: `http://127.0.0.1:${port}`, NIGHTSHIFT_TEST_STREAM: '{"message":{"content":"health "}}\n{"message":{"content":"check"}}\n{"done":true}' } });
    const state = JSON.parse(await fs.readFile(statePath, 'utf8'));
    assert.equal(state.queue[0].status, 'completed', 'queue task should persist as completed');
    assert.ok(Object.values(state.runs).some((run) => run.status === 'completed'), 'daemon run should complete');
    assert.ok(state.logs.some((log) => /health check|Model task complete|verified/.test(log.message)), 'execution stream logs should persist');
    assert.ok(state.audit.some((entry) => entry.egress === 'zero-egress-local'), 'privacy audit should record zero-egress execution');
    const branches = (await run('git', ['branch', '--list', 'nightshift/*'], { cwd: workspace })).stdout;
    assert.match(branches, /nightshift\//, 'daemon should isolate work on a Night Shift branch');
    console.log('Night Shift integration test passed');
  } finally {
    ollama.close();
    await fs.rm(root, { recursive: true, force: true });
  }
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
