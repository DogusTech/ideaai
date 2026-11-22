const { app, BrowserWindow, ipcMain, nativeTheme, safeStorage, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const { exec, execFile, spawn } = require('child_process');
const https = require('https');
const waitOn = require('wait-on');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);
// Disable Chromium disk cache to avoid permission issues
app.commandLine.appendSwitch('disable-http-cache');
app.commandLine.appendSwitch('disable-application-cache');

// Use a writable user data directory to prevent cache/quota permission errors
const fsSync = require('fs');
const appIconPath = path.join(__dirname, 'public', 'icon.png');
const appIconFallbackPath = path.join(__dirname, 'build', 'icon.ico');
const resolvedAppIconPath = app.isPackaged && process.platform === 'win32' && fsSync.existsSync(appIconFallbackPath)
  ? appIconFallbackPath
  : appIconPath;
app.setAppUserModelId('com.aeternexus.turaen');
const userDataPath = path.join(app.getPath('home'), '.togetlinkk-data');
if (!fsSync.existsSync(userDataPath)) {
  fsSync.mkdirSync(userDataPath, { recursive: true });
}
app.setPath('userData', userDataPath);
const githubConfigPath = path.join(userDataPath, 'github-auth.json');
const nightshiftRemoteConfigPath = path.join(userDataPath, 'nightshift-remote.json');
const nightshiftStatePath = path.join(userDataPath, 'nightshift-state.json');
const subscriptionPath = path.join(userDataPath, 'subscription.json');
const ollamaConfigPath = path.join(userDataPath, 'ollama-config.json');
const nightshiftDaemonPath = path.join(__dirname, 'nightshift-daemon.js');
let nightshiftLogPump = null;
let nightshiftDaemonPid = null;

async function readGithubConfig() {
  try { return JSON.parse(await fs.readFile(githubConfigPath, 'utf8')); } catch { return {}; }
}

async function getGithubToken() {
  const config = await readGithubConfig();
  if (!config.encryptedToken || !safeStorage.isEncryptionAvailable()) return '';
  try { return safeStorage.decryptString(Buffer.from(config.encryptedToken, 'base64')); } catch { return ''; }
}

async function saveGithubToken(token) {
  if (!safeStorage.isEncryptionAvailable()) throw new Error('OS encrypted storage is unavailable on this device.');
  const encryptedToken = safeStorage.encryptString(token).toString('base64');
  await fs.writeFile(githubConfigPath, JSON.stringify({ encryptedToken, updatedAt: new Date().toISOString() }), { encoding: 'utf8', mode: 0o600 });
}

async function getNightshiftRemoteToken() {
  try {
    const config = JSON.parse(await fs.readFile(nightshiftRemoteConfigPath, 'utf8'));
    return config.encryptedToken && safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(Buffer.from(config.encryptedToken, 'base64')) : '';
  } catch { return ''; }
}

async function saveNightshiftRemoteToken(token) {
  if (!token) { await fs.rm(nightshiftRemoteConfigPath, { force: true }); return; }
  if (!safeStorage.isEncryptionAvailable()) throw new Error('OS encrypted storage is unavailable for the remote worker token.');
  await fs.writeFile(nightshiftRemoteConfigPath, JSON.stringify({ encryptedToken: safeStorage.encryptString(token).toString('base64') }), { encoding: 'utf8', mode: 0o600 });
}

async function readSubscription() {
  try {
    const state = JSON.parse(await fs.readFile(subscriptionPath, 'utf8'));
    return { tier: state.tier === 'pro' ? 'pro' : 'free', devPreview: Boolean(state.devPreview), updatedAt: state.updatedAt };
  } catch { return { tier: 'free', devPreview: false }; }
}

async function writeSubscription(state) {
  const next = { tier: state?.tier === 'pro' ? 'pro' : 'free', devPreview: Boolean(state?.devPreview), updatedAt: new Date().toISOString() };
  await fs.writeFile(subscriptionPath, JSON.stringify(next, null, 2), { encoding: 'utf8', mode: 0o600 });
  return next;
}

async function readNightshiftState() {
  try { return JSON.parse(await fs.readFile(nightshiftStatePath, 'utf8')); } catch { return { version: 1, queue: [], schedule: { enabled: false, time: '09:00', frequency: 'Every day', wake: true }, logs: [], audit: [], runs: {}, remoteWorker: { enabled: false, endpoint: '', token: '' } }; }
}

async function writeNightshiftState(state) {
  await fs.mkdir(path.dirname(nightshiftStatePath), { recursive: true });
  const temporary = `${nightshiftStatePath}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(state, null, 2), 'utf8');
  await fs.rename(temporary, nightshiftStatePath);
}

function nightshiftNodeCommand() { return process.env.NIGHTSHIFT_NODE || (process.platform === 'win32' ? 'node.exe' : 'node'); }

function sendNightshiftEvent(payload) {
  try { if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('nightshift:log', payload); } catch {}
}

function startNightshiftLogPump() {
  if (nightshiftLogPump) return;
  let seen = 0;
  nightshiftLogPump = setInterval(async () => {
    const state = await readNightshiftState();
    const logs = state.logs || [];
    logs.slice(seen).forEach((log) => sendNightshiftEvent(log));
    seen = logs.length;
  }, 750);
}

function spawnNightshiftDaemon(extraArgs = []) {
  const child = spawn(nightshiftNodeCommand(), [nightshiftDaemonPath, '--state', nightshiftStatePath, ...extraArgs], { detached: true, windowsHide: true, stdio: 'ignore' });
  nightshiftDaemonPid = child.pid || null;
  child.unref();
  startNightshiftLogPump();
  return { success: true, pid: nightshiftDaemonPid };
}

async function registerNightshiftSchedule(schedule) {
  const [hour, minute] = String(schedule.time || '09:00').split(':').map((value) => Math.max(0, Math.min(59, Number(value) || 0)));
  const nodeCommand = nightshiftNodeCommand();
  if (process.platform === 'win32') {
    const xmlPath = path.join(userDataPath, 'nightshift-task.xml');
    const start = new Date(); start.setHours(hour, minute, 0, 0); if (start <= new Date()) start.setDate(start.getDate() + 1);
    const iso = start.toISOString().replace(/\.\d{3}Z$/, '');
    const command = `${nodeCommand} "${nightshiftDaemonPath}" --scheduled --state "${nightshiftStatePath}"`;
    const xml = `<?xml version="1.0" encoding="UTF-16"?>\n<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task"><Triggers><CalendarTrigger><StartBoundary>${iso}</StartBoundary><ScheduleByDay><DaysInterval>1</DaysInterval></ScheduleByDay><Repetition><Interval>PT24H</Interval><StopAtDurationEnd>false</StopAtDurationEnd></Repetition></CalendarTrigger></Triggers><Principals><Principal id="Author"><LogonType>InteractiveToken</LogonType><RunLevel>LeastPrivilege</RunLevel></Principal></Principals><Settings><MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy><DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries><StopIfGoingOnBatteries>false</StopIfGoingOnBatteries><WakeToRun>true</WakeToRun><ExecutionTimeLimit>PT12H</ExecutionTimeLimit></Settings><Actions Context="Author"><Exec><Command>${command.replace(/&/g, '&amp;')}</Command></Exec></Actions></Task>`;
    await fs.writeFile(xmlPath, xml, 'utf16le');
    await execFileAsync('schtasks.exe', ['/Create', '/TN', 'Turaen Night Shift', '/XML', xmlPath, '/F'], { windowsHide: true, timeout: 15_000 });
    return { success: true, platform: 'windows', taskName: 'Turaen Night Shift' };
  }
  if (process.platform === 'darwin') {
    const plistPath = path.join(os.homedir(), 'Library', 'LaunchAgents', 'com.ideaai.nightshift.plist');
    await fs.mkdir(path.dirname(plistPath), { recursive: true });
    const plist = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key><string>com.ideaai.nightshift</string><key>ProgramArguments</key><array><string>${nodeCommand}</string><string>${nightshiftDaemonPath}</string><string>--scheduled</string><string>--state</string><string>${nightshiftStatePath}</string></array><key>StartCalendarInterval</key><dict><key>Hour</key><integer>${hour}</integer><key>Minute</key><integer>${minute}</integer></dict><key>RunAtLoad</key><false/><key>StandardOutPath</key><string>${path.join(userDataPath, 'nightshift-launchd.log')}</string><key>StandardErrorPath</key><string>${path.join(userDataPath, 'nightshift-launchd.error.log')}</string></dict></plist>`;
    await fs.writeFile(plistPath, plist, 'utf8');
    await execFileAsync('launchctl', ['load', '-w', plistPath], { timeout: 15_000 }).catch(() => undefined);
    return { success: true, platform: 'macos', taskName: plistPath };
  }
  const systemdDir = path.join(os.homedir(), '.config', 'systemd', 'user');
  await fs.mkdir(systemdDir, { recursive: true });
  await fs.writeFile(path.join(systemdDir, 'ideaai-nightshift.service'), `[Unit]\nDescription=Turaen Night Shift daemon\n[Service]\nType=oneshot\nExecStart=${nodeCommand} ${nightshiftDaemonPath} --scheduled --state ${nightshiftStatePath}\n`, 'utf8');
  await fs.writeFile(path.join(systemdDir, 'ideaai-nightshift.timer'), `[Unit]\nDescription=Turaen Night Shift timer\n[Timer]\nOnCalendar=*-*-* ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00\nPersistent=true\nWakeSystem=true\n[Install]\nWantedBy=timers.target\n`, 'utf8');
  await execFileAsync('systemctl', ['--user', 'daemon-reload'], { timeout: 15_000 }).catch(() => undefined);
  await execFileAsync('systemctl', ['--user', 'enable', '--now', 'ideaai-nightshift.timer'], { timeout: 15_000 }).catch(() => undefined);
  return { success: true, platform: 'linux', taskName: 'ideaai-nightshift.timer' };
}

const isDev = !app.isPackaged;

let systemInformation;
try {
  systemInformation = require('systeminformation');
} catch {
  systemInformation = null;
}
let nodePty;
try { nodePty = require('node-pty'); } catch { nodePty = null; }

let mainWindow;
const terminalSessions = new Map();
const activeTerminalIds = new Map();
const activeShells = new Map();
const pendingTerminalCommands = new Map();
let terminalCommandSequence = 0;
let activeOllamaModel = process.env.OLLAMA_MODEL || 'ui-llama';
const activeModelPulls = new Set();
const RECOMMENDED_OLLAMA_MODELS = new Set([
  'qwen2.5-coder:1.5b',
  'qwen2.5-coder:3b',
  'qwen2.5-coder:7b',
  'qwen2.5-coder:14b',
  'deepseek-coder-v2:16b',
  'llama3.2:3b',
  'codegemma:7b',
]);

function isTrustedModelRenderer(event) {
  return Boolean(mainWindow && !mainWindow.isDestroyed() && event.sender.id === mainWindow.webContents.id);
}

ipcMain.handle('window:minimize', (event) => {
  if (!isTrustedModelRenderer(event)) return false;
  mainWindow.minimize();
  return true;
});

ipcMain.handle('window:toggle-maximize', (event) => {
  if (!isTrustedModelRenderer(event)) return false;
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
  return mainWindow.isMaximized();
});

ipcMain.handle('window:close', (event) => {
  if (!isTrustedModelRenderer(event)) return false;
  mainWindow.close();
  return true;
});


ipcMain.handle('theme:set', (event, themeMode) => {
  if (!isTrustedModelRenderer(event)) return false;
  try {
    if (themeMode === 'dark') nativeTheme.themeSource = 'dark';
    else if (themeMode === 'light') nativeTheme.themeSource = 'light';
    else nativeTheme.themeSource = 'system';
    return true;
  } catch (err) {
    return false;
  }
});
function parseModelSize(value) {
  const match = String(value || '').match(/([\d.]+)\s*(B|KB|MB|GB|TB)/i);
  if (!match) return 0;
  const unit = match[2].toUpperCase();
  const power = { B: 0, KB: 1, MB: 2, GB: 3, TB: 4 }[unit] || 0;
  return Number(match[1]) * (1024 ** power);
}

function parseOllamaList(output) {
  return String(output || '').split(/\r?\n/).slice(1).flatMap((line) => {
    const match = line.trim().match(/^(\S+)\s+(\S+)\s+([\d.]+\s+[KMGT]?B)\s*(.*)$/i);
    if (!match) return [];
    return [{ name: match[1], id: match[2], sizeBytes: parseModelSize(match[3]), modifiedAt: match[4].trim() }];
  });
}

function getOllamaModelsDirectory() {
  return process.env.OLLAMA_MODELS || path.join(os.homedir(), '.ollama', 'models');
}

async function getDiskCapacity(directory) {
  let existingPath = path.resolve(directory);
  while (existingPath !== path.dirname(existingPath)) {
    try {
      const stat = await fs.stat(existingPath);
      if (stat.isDirectory()) break;
      existingPath = path.dirname(existingPath);
    } catch {
      existingPath = path.dirname(existingPath);
    }
  }
  if (typeof fs.statfs === 'function') {
    try {
      const stat = await fs.statfs(existingPath);
      const blockSize = Number(stat.bsize || stat.frsize || 0);
      const freeBlocks = Number(stat.bavail ?? stat.bfree ?? 0);
      return { totalBytes: Number(stat.blocks) * blockSize, freeBytes: freeBlocks * blockSize };
    } catch { /* Try the optional systeminformation adapter. */ }
  }
  if (systemInformation?.fsSize) {
    try {
      const target = path.resolve(directory).toLowerCase();
      const disks = await systemInformation.fsSize();
      const disk = disks
        .filter((item) => typeof item.mount === 'string' && target.startsWith(path.resolve(item.mount).toLowerCase()))
        .sort((a, b) => b.mount.length - a.mount.length)[0];
      if (disk) return { totalBytes: Number(disk.size || 0), freeBytes: Number(disk.available || 0) };
    } catch { /* Disk usage is optional on unsupported filesystems. */ }
  }
  return null;
}

async function detectGpuName() {
  if (systemInformation?.graphics) {
    try {
      const graphics = await systemInformation.graphics();
      const controllers = (graphics.controllers || []).map((controller) => controller.model || controller.name).filter(Boolean);
      if (controllers.length) return [...new Set(controllers)].join(' · ');
    } catch { /* Use OS-specific fallback below. */ }
  }

  const fallbackCommands = process.platform === 'win32'
    ? [
        ['nvidia-smi', ['--query-gpu=name', '--format=csv,noheader']],
        ['powershell.exe', ['-NoProfile', '-Command', '(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join "; "']],
      ]
    : process.platform === 'darwin'
      ? [['system_profiler', ['SPDisplaysDataType']]]
      : [['nvidia-smi', ['--query-gpu=name', '--format=csv,noheader']], ['lspci', ['-mm']]];

  for (const [command, args] of fallbackCommands) {
    try {
      const result = await execFileAsync(command, args, { timeout: 8_000, windowsHide: true, maxBuffer: 1024 * 1024 });
      const lines = String(result.stdout || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const gpuLines = process.platform === 'linux' && command === 'lspci'
        ? lines.filter((line) => /VGA compatible controller|3D controller|Display controller/i.test(line))
        : lines;
      if (gpuLines.length) return gpuLines.slice(0, 3).join(' · ');
    } catch { /* GPU utilities are optional on many machines. */ }
  }
  return 'Not detected';
}

async function detectWindowsGpu() {
  if (process.platform !== 'win32') return null;
  try {
    const script = 'Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM | ConvertTo-Json -Compress';
    const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
      timeout: 8_000, windowsHide: true, maxBuffer: 1024 * 1024,
    });
    const parsed = JSON.parse(String(stdout || 'null'));
    const controllers = Array.isArray(parsed) ? parsed : [parsed];
    const controller = controllers.find((item) => item && item.Name);
    if (!controller) return null;
    return { name: String(controller.Name), vramBytes: Number(controller.AdapterRAM) || 0 };
  } catch (error) {
    console.warn('[hardware] PowerShell GPU detection failed:', error.message);
    return null;
  }
}

async function getMachineSnapshot() {
  let totalRamBytes = os.totalmem();
  let freeRamBytes = os.freemem();
  if (systemInformation?.mem) {
    try {
      const memory = await systemInformation.mem();
      totalRamBytes = Number(memory.total || totalRamBytes);
      freeRamBytes = Number(memory.available || memory.free || freeRamBytes);
    } catch { /* Keep the Node.js os values. */ }
  }
  const windowsGpu = await detectWindowsGpu();
  const gpuName = windowsGpu?.name || await detectGpuName();
  let gpuVramBytes = windowsGpu?.vramBytes || 0;
  if (!gpuVramBytes && systemInformation?.graphics) {
    try {
      const graphics = await systemInformation.graphics();
      const controller = (graphics.controllers || []).find((item) => Number(item.vram || 0) > 0);
      if (controller) gpuVramBytes = Number(controller.vram) * 1024 * 1024;
    } catch { /* VRAM reporting varies by operating system and driver. */ }
  }
  const cpuCores = Math.max(1, os.cpus()?.length || 1);
  const integratedGpu = /integrated|uhd|iris|radeon graphics|vega graphics|microsoft basic/i.test(gpuName) || gpuVramBytes < 1024 ** 3;
  const totalRamGb = totalRamBytes / (1024 ** 3);
  const tier = totalRamGb <= 8 || integratedGpu ? 'low' : totalRamGb >= 32 ? 'high' : 'medium';
  return {
    totalRamBytes,
    freeRamBytes,
    gpuName,
    gpuVramBytes,
    cpuCores,
    tier,
    tierLabel: tier === 'low' ? 'Low' : tier === 'high' ? 'High' : 'Medium',
    recommendedNumCtx: tier === 'low' ? 2048 : tier === 'high' ? 8192 : 4096,
    platform: `${os.type()} ${os.release()}`,
    modelDirectory: getOllamaModelsDirectory(),
  };
}

function getOllamaRuntimeOptions(machine, fastPath = false) {
  const tier = machine?.tier || 'medium';
  const cpuCores = Math.max(1, Number(machine?.cpuCores || os.cpus()?.length || 1));
  const gpuVramGb = Number(machine?.gpuVramBytes || 0) / (1024 ** 3);
  const integratedGpu = /integrated|uhd|iris|radeon graphics|vega graphics|microsoft basic/i.test(machine?.gpuName || '') || gpuVramGb < 1;
  return {
    num_ctx: fastPath ? 2048 : tier === 'low' ? 2048 : tier === 'high' ? 8192 : 4096,
    num_gpu: integratedGpu ? 0 : tier === 'high' ? 999 : Math.max(8, Math.floor(gpuVramGb * 8)),
    num_thread: tier === 'low' ? Math.max(2, cpuCores - 1) : Math.max(2, Math.min(cpuCores, tier === 'high' ? 12 : 8)),
    keep_alive: '15m',
    temperature: 0.1,
    top_p: 0.9,
    repeat_penalty: 1.05,
  };
}

async function readOllamaConfig() {
  try { return JSON.parse(await fs.readFile(ollamaConfigPath, 'utf8')); } catch { return {}; }
}

async function saveOllamaBinary(binaryPath) {
  const normalized = path.resolve(String(binaryPath || ''));
  await fs.writeFile(ollamaConfigPath, JSON.stringify({ binaryPath: normalized, updatedAt: new Date().toISOString() }, null, 2), { encoding: 'utf8', mode: 0o600 });
  return normalized;
}

async function discoverOllamaBinary() {
  const config = await readOllamaConfig();
  const candidates = [];
  if (config.binaryPath) candidates.push(config.binaryPath);
  try {
    const result = await execFileAsync(process.platform === 'win32' ? 'where.exe' : 'which', ['ollama'], { timeout: 4_000, windowsHide: true, maxBuffer: 64 * 1024 });
    candidates.push(...String(result.stdout || '').split(/\r?\n/).map((value) => value.trim()).filter(Boolean));
  } catch {}
  if (process.platform === 'win32') {
    candidates.push(path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Ollama', 'ollama.exe'));
    candidates.push(path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Ollama', 'ollama.exe'));
  } else {
    candidates.push('/usr/local/bin/ollama', '/opt/homebrew/bin/ollama');
  }
  for (const candidate of candidates) {
    try {
      if (candidate && fsSync.existsSync(candidate) && fsSync.statSync(candidate).isFile()) return candidate;
    } catch {}
  }
  return null;
}

async function runOllama(args, timeout = 30_000) {
  const binary = await discoverOllamaBinary();
  if (!binary) return { success: false, stdout: '', stderr: '', error: 'Ollama executable not found. Browse for Ollama or install it, then try again.' };
  return new Promise((resolve) => {
    execFile(binary, args, { timeout, windowsHide: true, maxBuffer: 2 * 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({ success: !error, stdout: String(stdout || ''), stderr: String(stderr || ''), error: error ? error.message : '' });
    });
  });
}

function ollamaBaseUrl() {
  return (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
}

let ollamaWakePromise = null;
async function ensureOllamaReady({ startIfMissing = true } = {}) {
  const binary = await discoverOllamaBinary();
  const probe = async () => {
    const response = await fetch(`${ollamaBaseUrl()}/api/tags`, { signal: AbortSignal.timeout(900) });
    return response.ok;
  };
  try { if (await probe()) return { success: true, running: true, started: false }; } catch {}
  if (!startIfMissing) return { success: false, running: false, started: false, binaryPath: binary, error: 'Could not connect to Ollama at 127.0.0.1:11434.' };
  if (!binary) return { success: false, running: false, started: false, error: 'Ollama executable not found. Browse for Ollama or install it, then try again.', code: 'OLLAMA_NOT_FOUND', action: 'install' };
  if (!ollamaWakePromise) {
    ollamaWakePromise = (async () => {
      try {
        const child = spawn(binary, ['serve'], { detached: true, windowsHide: true, stdio: 'ignore' });
        child.unref();
      } catch {
        return { success: false, running: false, started: false, error: 'Could not start Ollama. Browse for the executable or install Ollama, then try again.', code: 'OLLAMA_NOT_FOUND', action: 'install' };
      }
      const deadline = Date.now() + 8000;
      while (Date.now() < deadline) {
        try { if (await probe()) return { success: true, running: true, started: true, binaryPath: binary }; } catch {}
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
      return { success: false, running: false, started: true, binaryPath: binary, error: 'Ollama did not become ready within 8 seconds. Start Ollama and try again.', code: 'OLLAMA_UNREACHABLE', action: 'start' };
    })().finally(() => { ollamaWakePromise = null; });
  }
  return ollamaWakePromise;
}

ipcMain.handle('ollama:get-binary', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const config = await readOllamaConfig();
  return { success: true, path: await discoverOllamaBinary(), customPath: config.binaryPath || '' };
});

ipcMain.handle('ollama:browse-binary', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Ollama executable',
    properties: ['openFile'],
    filters: process.platform === 'win32' ? [{ name: 'Ollama executable', extensions: ['exe'] }] : [{ name: 'Executable', extensions: ['*'] }],
  });
  if (result.canceled || !result.filePaths[0]) return { success: false, canceled: true };
  try {
    const selected = result.filePaths[0];
    if (!(await fs.stat(selected)).isFile()) throw new Error('Selected Ollama path is not a file.');
    return { success: true, path: await saveOllamaBinary(selected) };
  } catch (error) { return { success: false, error: error.message || 'Could not save the Ollama path.' }; }
});

function downloadFile(url, targetPath, onProgress) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) return downloadFile(response.headers.location, targetPath, onProgress).then(resolve, reject);
      if (response.statusCode !== 200) return reject(new Error(`Ollama download failed with HTTP ${response.statusCode}.`));
      const total = Number(response.headers['content-length'] || 0); let received = 0;
      const output = fsSync.createWriteStream(targetPath);
      response.on('data', (chunk) => { received += chunk.length; onProgress(total ? Math.round(received / total * 100) : 0); });
      response.pipe(output); output.on('finish', () => output.close(() => resolve(targetPath))); output.on('error', reject);
    });
    request.on('error', reject);
  });
}

ipcMain.handle('ollama:install', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const sendProgress = (payload) => { try { if (!event.sender.isDestroyed()) event.sender.send('ollama:install-progress', payload); } catch {} };
  try {
    const tempRoot = await fs.mkdtemp(path.join(app.getPath('temp'), 'turaen-ollama-'));
    const filename = process.platform === 'win32' ? 'OllamaSetup.exe' : process.platform === 'darwin' ? 'Ollama-darwin.zip' : 'ollama-install.sh';
    const target = path.join(tempRoot, filename);
    const url = process.platform === 'win32' ? 'https://ollama.com/download/OllamaSetup.exe' : process.platform === 'darwin' ? 'https://ollama.com/download/Ollama-darwin.zip' : 'https://ollama.com/install.sh';
    sendProgress({ status: 'downloading', percent: 0, message: 'Downloading Ollama…' });
    await downloadFile(url, target, (percent) => sendProgress({ status: 'downloading', percent, message: `Downloading Ollama… ${percent}%` }));
    if (process.platform === 'win32') spawn(target, [], { detached: true, windowsHide: false, stdio: 'ignore' }).unref();
    else if (process.platform === 'darwin') spawn('open', [target], { detached: true, stdio: 'ignore' }).unref();
    else spawn('sh', [target], { detached: true, windowsHide: true, stdio: 'ignore' }).unref();
    sendProgress({ status: 'launched', percent: 100, message: 'Installer launched. Waiting for Ollama…' });
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) { const ready = await ensureOllamaReady(); if (ready.success) return { success: true, path: ready.binaryPath }; await new Promise((resolve) => setTimeout(resolve, 1000)); }
    return { success: false, error: 'Ollama installer launched, but the runtime is not ready yet.' };
  } catch (error) { sendProgress({ status: 'error', percent: 0, message: error.message }); return { success: false, error: error.message || 'Could not install Ollama.' }; }
});

async function listOllamaModelsHttp() {
  const response = await fetch(`${ollamaBaseUrl()}/api/tags`, { signal: AbortSignal.timeout(5_000) });
  if (!response.ok) throw new Error(`Ollama API returned ${response.status}.`);
  const payload = await response.json();
  return (payload.models || []).map((model) => ({
    name: String(model.name || model.model || ''),
    id: String(model.digest || ''),
    sizeBytes: Number(model.size || 0),
    modifiedAt: String(model.modified_at || ''),
  })).filter((model) => model.name);
}

async function listOllamaModels() {
  const ready = await ensureOllamaReady();
  if (!ready.success) return { success: false, models: [], error: ready.error };
  try { return { success: true, models: await listOllamaModelsHttp(), source: 'http' }; }
  catch (httpError) {
    const result = await runOllama(['list'], 20_000);
    if (result.success) return { success: true, models: parseOllamaList(result.stdout), source: 'cli' };
    return { success: false, models: [], error: result.stderr || result.error || httpError.message || 'Ollama is unavailable.' };
  }
}

ipcMain.handle('models:get-machine', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try {
    return { success: true, machine: await getMachineSnapshot() };
  } catch (error) {
    return { success: false, error: error.message || 'Could not read hardware details.' };
  }
});
ipcMain.handle('ollama:ensure-ready', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  return ensureOllamaReady();
});
ipcMain.handle('models:get-runtime-status', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, ollama: false, lmStudio: false };
  const ollamaResult = await listOllamaModels();
  let lmStudio = false;
  try {
    const response = await fetch('http://127.0.0.1:1234/v1/models', { signal: AbortSignal.timeout(1500) });
    lmStudio = response.ok;
  } catch { lmStudio = false; }
  return { success: true, ollama: ollamaResult.success, lmStudio };
});

ipcMain.removeHandler('hardware:get-profile');
ipcMain.handle('hardware:get-profile', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try {
    const machine = await getMachineSnapshot();
    return { success: true, profile: { ...machine, tierDescription: `${machine.tierLabel} hardware profile · ${machine.recommendedNumCtx} token context` } };
  } catch (error) {
    return { success: false, error: error.message || 'Could not profile this machine.' };
  }
});

ipcMain.handle('subscription:get', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  return { success: true, state: await readSubscription() };
});

ipcMain.handle('subscription:set', async (event, state = {}) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try { return { success: true, state: await writeSubscription(state) }; }
  catch (error) { return { success: false, error: error.message || 'Could not save subscription state.' }; }
});

ipcMain.handle('models:get-hub-catalog', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const machine = await getMachineSnapshot();
  const listing = await listOllamaModels();
  const installed = new Set(listing.success ? listing.models.map((model) => model.name) : []);
  const catalog = [
    ['Qwen 2.5 Coder · 1.5B', 'qwen2.5-coder:1.5b', 'Qwen', 'low', '1.0 GB', '1.5B', 2048, 'Ultra-lightweight coding model', true],
    ['Qwen 2.5 Coder · 3B', 'qwen2.5-coder:3b', 'Qwen', 'low', '2.0 GB', '3B', 4096, 'Fast coding model for low-memory devices', true],
    ['Llama 3.2 · 3B', 'llama3.2:3b', 'Meta', 'low', '2.0 GB', '3B', 4096, 'Lightweight general assistant', true],
    ['Qwen 2.5 Coder · 7B', 'qwen2.5-coder:7b', 'Qwen', 'medium', '4.7 GB', '7B', 8192, 'Balanced repository coding model', true],
    ['Qwen 2.5 Coder · 14B', 'qwen2.5-coder:14b', 'Qwen', 'high', '9.0 GB', '14B', 8192, 'Larger model for involved refactors', false],
    ['DeepSeek Coder V2 · 16B', 'deepseek-coder-v2:16b', 'DeepSeek', 'high', '8.9 GB', '16B', 8192, 'Mixture-of-experts coding model', false],
    ['CodeGemma · 7B', 'codegemma:7b', 'Google', 'medium', '5.0 GB', '7B', 8192, 'Compact code generation model', false],
  ].map(([name, modelTag, family, tier, downloadSizeApprox, parameters, contextWindow, description, recommended], index) => ({
    id: `catalog-${index + 1}`,
    name, modelTag, family, tier, downloadSizeApprox, parameters, contextWindow, description, recommended,
    installed: installed.has(modelTag),
  }));
  return { success: true, catalog, machine };
});

ipcMain.handle('ollama:list', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const result = await listOllamaModels();
  if (!result.success) return { success: false, error: result.error || 'Ollama is unavailable.' };
  const models = result.models;
  const modelBytes = models.reduce((total, model) => total + model.sizeBytes, 0);
  const disk = await getDiskCapacity(getOllamaModelsDirectory());
  const totalBytes = disk?.totalBytes || 0;
  const freeBytes = disk?.freeBytes || 0;
  const usedBytes = Math.max(0, totalBytes - freeBytes);
  return {
    success: true,
    models,
    storage: {
      totalBytes,
      freeBytes,
      modelBytes,
      otherBytes: Math.max(0, usedBytes - modelBytes),
      path: getOllamaModelsDirectory(),
    },
  };
});

ipcMain.handle('ollama:pull', async (event, modelName) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  if (!RECOMMENDED_OLLAMA_MODELS.has(modelName)) return { success: false, error: 'This model is not in the approved catalog.' };
  if (activeModelPulls.has(modelName)) return { success: false, error: 'This model is already downloading.' };
  activeModelPulls.add(modelName);
  const sendProgress = (payload) => {
    try { if (!event.sender.isDestroyed()) event.sender.send('ollama:pull-progress', { modelName, ...payload }); } catch {}
  };
  try {
    sendProgress({ percent: 0, status: 'starting', message: 'Connecting to Ollama…' });
    try {
      const response = await fetch(`${ollamaBaseUrl()}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelName, stream: true }),
      });
      if (!response.ok || !response.body) throw new Error(`Ollama pull API returned ${response.status}.`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let pullComplete = false;
      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.trim()) continue;
          const item = JSON.parse(line);
          if (item.error) throw new Error(item.error);
          if (item.status === 'success') pullComplete = true;
          const total = Number(item.total || 0);
          const completed = Number(item.completed || 0);
          const percent = total > 0 ? Math.min(99, Math.round(completed / total * 100)) : 0;
          sendProgress({ percent, status: item.status === 'success' ? 'complete' : 'pulling', message: String(item.status || 'Downloading model layers…') });
        }
        if (done) break;
      }
      if (buffer.trim()) {
        const item = JSON.parse(buffer);
        if (item.error) throw new Error(item.error);
        if (item.status === 'success') pullComplete = true;
      }
      if (!pullComplete) throw new Error('Ollama closed the pull stream before reporting completion.');
      sendProgress({ percent: 100, status: 'complete', message: 'Download complete' });
      return { success: true };
    } catch (httpError) {
      sendProgress({ percent: 0, status: 'pulling', message: 'HTTP pull unavailable; trying Ollama CLI…' });
      const result = await new Promise((resolve) => {
        let outputBuffer = '';
        let lastMessage = '';
        let child;
        try { child = spawn('ollama', ['pull', modelName], { windowsHide: true, shell: false, stdio: ['ignore', 'pipe', 'pipe'] }); }
        catch (error) { resolve({ success: false, error: error.message }); return; }
        const consume = (chunk) => {
          outputBuffer += String(chunk);
          const lines = outputBuffer.split(/\r\n|\n|\r/);
          outputBuffer = lines.pop() || '';
          for (const line of lines) {
            const cleaned = line.trim();
            if (!cleaned) continue;
            lastMessage = cleaned;
            const matches = [...cleaned.matchAll(/(\d+(?:\.\d+)?)%/g)];
            sendProgress({ percent: matches.length ? Math.min(100, Number(matches.at(-1)[1])) : 0, status: 'pulling', message: cleaned.slice(0, 160) });
          }
        };
        child.stdout.setEncoding('utf8').on('data', consume);
        child.stderr.setEncoding('utf8').on('data', consume);
        child.once('error', (error) => resolve({ success: false, error: error.message }));
        child.once('close', (code) => {
          if (code === 0) resolve({ success: true });
          else resolve({ success: false, error: lastMessage || `ollama pull exited with code ${code}; API error: ${httpError.message}` });
        });
      });
      if (result.success) sendProgress({ percent: 100, status: 'complete', message: 'Download complete' });
      else sendProgress({ percent: 0, status: 'error', message: result.error });
      return result;
    }
  } finally {
    activeModelPulls.delete(modelName);
  }
});

ipcMain.handle('ollama:load', async (event, modelName) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  if (typeof modelName !== 'string' || !/^[a-zA-Z0-9._:/-]{1,120}$/.test(modelName)) return { success: false, error: 'Invalid model name.' };
  const listing = await listOllamaModels();
  if (!listing.success || !listing.models.some((model) => model.name === modelName)) {
    return { success: false, error: 'Download this model before loading it.' };
  }
  try {
    const response = await fetch(`${ollamaBaseUrl()}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: modelName, prompt: '', stream: false, keep_alive: '10m' }),
      signal: AbortSignal.timeout(180_000),
    });
    if (!response.ok) throw new Error(`Ollama returned ${response.status}.`);
    activeOllamaModel = modelName;
    return { success: true, modelName };
  } catch (error) {
    return { success: false, error: error.message || 'Could not load the model from Ollama.' };
  }
});

ipcMain.handle('ollama:delete', async (event, modelName) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  if (typeof modelName !== 'string' || !/^[a-zA-Z0-9._:/-]{1,120}$/.test(modelName)) return { success: false, error: 'Invalid model name.' };
  const listing = await listOllamaModels();
  if (!listing.success || !listing.models.some((model) => model.name === modelName)) {
    return { success: false, error: 'That model is not installed.' };
  }
  let deleteResult = { success: false };
  try {
    const response = await fetch(`${ollamaBaseUrl()}/api/delete`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: modelName }), signal: AbortSignal.timeout(60_000) });
    deleteResult = { success: response.ok, error: response.ok ? '' : `Ollama returned ${response.status}.` };
  } catch (error) { deleteResult.error = error.message; }
  if (!deleteResult.success) {
    const result = await runOllama(['rm', modelName], 60_000);
    deleteResult = { success: result.success, error: result.stderr || result.error || deleteResult.error };
  }
  if (!deleteResult.success) return { success: false, error: deleteResult.error || `Could not remove ${modelName}.` };
  if (activeOllamaModel === modelName) {
    const remaining = listing.models.filter((model) => model.name !== modelName);
    activeOllamaModel = remaining[0]?.name || process.env.OLLAMA_MODEL || 'ui-llama';
  }
  return { success: true };
});

function resolveInsideWorkspace(rootPath, requestedPath) {
  const root = path.resolve(rootPath);
  const candidate = path.resolve(root, requestedPath);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    throw new Error('Path is outside the selected workspace');
  }
  return candidate;
}

function getTerminalSession(event, id = 'default') {
  if (!isTrustedModelRenderer(event)) throw new Error('Untrusted terminal renderer');
  return terminalSessions.get(`${event.sender.id}:${id}`);
}

function startTerminalSession(event, { id = 'default', cwd, workspaceRoot, shell: requestedShell } = {}) {
  if (!isTrustedModelRenderer(event)) throw new Error('Untrusted terminal renderer');
  const key = `${event.sender.id}:${id}`;
  activeTerminalIds.set(event.sender.id, id);
  const root = workspaceRoot ? path.resolve(workspaceRoot) : path.resolve(cwd || os.homedir());
  const workingDirectory = workspaceRoot ? resolveInsideWorkspace(root, cwd || '.') : root;
  const existing = terminalSessions.get(key);
  if (existing && existing.cwd === workingDirectory && existing.shellName === (requestedShell || 'PowerShell') && !existing.exited) return { success: true, id, initialOutput: existing.buffer.slice(-50000), cwd: existing.cwd };
  if (existing) { try { existing.kill(); } catch {} terminalSessions.delete(key); }
  const isWindows = process.platform === 'win32';
  let shell = isWindows ? (process.env.COMSPEC || 'powershell.exe') : (process.env.SHELL || '/bin/bash');
  let shellArgs = isWindows ? ['-NoLogo', '-NoProfile'] : ['-i'];
  if (isWindows && requestedShell === 'CMD') { shell = process.env.COMSPEC || 'cmd.exe'; shellArgs = []; }
  if (isWindows && requestedShell === 'WSL') { shell = 'wsl.exe'; shellArgs = []; }
  if (isWindows && requestedShell === 'Git Bash') {
    const candidates = [path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Git', 'bin', 'bash.exe'), path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Git', 'bin', 'bash.exe')];
    shell = candidates.find((candidate) => require('fs').existsSync(candidate)) || 'bash.exe';
    shellArgs = ['--login', '-i'];
  }
  activeShells.set(event.sender.id, requestedShell || 'PowerShell');
  let child = null;
  let pty = false;
  if (nodePty) {
    try {
      child = nodePty.spawn(shell, shellArgs, {
        cwd: workingDirectory, cols: 100, rows: 24, name: 'xterm-256color',
        env: { ...process.env, TERM: 'xterm-256color' },
      });
      pty = true;
    } catch (error) {
      console.warn('[terminal] node-pty unavailable, using piped shell fallback:', error.message);
    }
  }
  if (!child) child = spawn(shell, isWindows ? [...shellArgs, ...(requestedShell === 'CMD' || requestedShell === 'WSL' || requestedShell === 'Git Bash' ? [] : ['-Command', '-'])] : ['--noprofile', '--norc', '-i'],
    { cwd: workingDirectory, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, TERM: 'xterm-256color' } });
  const session = {
    child, pty, key, id, cwd: workingDirectory, workspaceRoot: root, shellName: requestedShell || 'PowerShell', buffer: '', exited: false,
    write: (data) => pty ? child.write(String(data)) : child.stdin.write(String(data)),
    resize: (cols, rows) => { if (pty) child.resize(Math.max(2, cols | 0), Math.max(1, rows | 0)); },
    kill: () => { session.exited = true; try { child.kill(); } catch {} },
  };
  terminalSessions.set(key, session);
  const forward = (chunk) => {
    const text = String(chunk);
    session.buffer = (session.buffer + text).slice(-250000);
    event.sender.send('terminal.incomingData', { id, data: text });
    for (const [commandId, pending] of pendingTerminalCommands) {
      if (pending.key !== key) continue;
      pending.output += text;
      const marker = `__IDEAAI_COMMAND_DONE:${commandId}:`;
      const index = pending.output.indexOf(marker);
      if (index >= 0) {
        const tail = pending.output.slice(index + marker.length);
        const match = tail.match(/(-?\d+)/);
        const fullOutput = pending.output.slice(0, index);
        pendingTerminalCommands.delete(commandId);
        clearTimeout(pending.timer);
        pending.resolve({ success: Boolean(match && Number(match[1]) === 0), stdout: fullOutput, stderr: '', error: match && Number(match[1]) !== 0 ? `Command exited with code ${match[1]}` : null });
      }
    }
  };
  if (pty) child.onData(forward);
  else { child.stdout.on('data', forward); child.stderr.on('data', forward); }
  const onExit = () => {
    session.exited = true;
    terminalSessions.delete(key);
    event.sender.send('terminal.incomingData', { id, data: '\r\n[Shell exited]\r\n' });
  };
  if (pty) child.onExit(onExit);
  else { child.on('error', (error) => event.sender.send('terminal.incomingData', { id, data: `\r\nTerminal error: ${error.message}\r\n` })); child.on('exit', onExit); }
  return { success: true, id, cwd: workingDirectory, initialOutput: '' };
}

ipcMain.handle('terminal.start', (event, options) => {
  try { return startTerminalSession(event, options || {}); }
  catch (error) { return { success: false, error: error.message }; }
});
ipcMain.handle('workspace.get-git-branch', async (event, rootPath) => {
  if (!isTrustedModelRenderer(event)) return { success: false, branch: 'main' };
  try {
    const root = path.resolve(rootPath);
    const { stdout } = await execFileAsync('git', ['branch', '--show-current'], { cwd: root, windowsHide: true, timeout: 5000 });
    return { success: true, branch: stdout.trim() || 'detached' };
  } catch { return { success: false, branch: 'main' }; }
});

function runGit(rootPath, args, timeout = 15_000) {
  return execFileAsync('git', args, { cwd: path.resolve(rootPath), windowsHide: true, timeout, maxBuffer: 4 * 1024 * 1024 });
}

function parseGitRemote(remote) {
  const value = String(remote || '').trim().replace(/\.git$/, '');
  const match = value.match(/github\.com[/:]([^/]+)\/([^/]+)$/i);
  return match ? { owner: match[1], name: match[2], fullName: `${match[1]}/${match[2]}` } : null;
}

async function getGitHubCliStatus() {
  try {
    const result = await execFileAsync('gh', ['auth', 'status', '--hostname', 'github.com'], { windowsHide: true, timeout: 8_000, maxBuffer: 512 * 1024 });
    const output = `${result.stdout || ''}\n${result.stderr || ''}`;
    const account = output.match(/Logged in to github\.com account ([^\s(]+)/i)?.[1] || '';
    return { authenticated: true, account, source: 'gh' };
  } catch { return { authenticated: false, account: '', source: 'none' }; }
}

async function getGitStatus(rootPath) {
  const root = path.resolve(rootPath);
  const [branchResult, remoteResult, statusResult, identityResult] = await Promise.all([
    runGit(root, ['branch', '--show-current']),
    runGit(root, ['remote', 'get-url', 'origin']).catch(() => ({ stdout: '' })),
    runGit(root, ['status', '--porcelain=v1', '--branch']),
    runGit(root, ['config', '--get-regexp', '^user\\.(name|email)$']).catch(() => ({ stdout: '' })),
  ]);
  const branch = String(branchResult.stdout || '').trim() || 'detached';
  const remote = String(remoteResult.stdout || '').trim();
  let ahead = 0;
  let behind = 0;
  try {
    const counts = await runGit(root, ['rev-list', '--left-right', '--count', '@{upstream}...HEAD']);
    [behind, ahead] = String(counts.stdout || '0 0').trim().split(/\s+/).map((value) => Number(value) || 0);
  } catch {}
  const cli = await getGitHubCliStatus();
  const token = await getGithubToken();
  return {
    success: true,
    branch,
    repository: parseGitRemote(remote),
    remote,
    ahead,
    behind,
    dirty: String(statusResult.stdout || '').split(/\r?\n/).some((line) => /^[ MARC?][MARCDU?]/.test(line)),
    identity: String(identityResult.stdout || '').trim(),
    github: { ...cli, authenticated: cli.authenticated || Boolean(token), source: cli.authenticated ? cli.source : token ? 'pat' : 'none' },
  };
}

ipcMain.handle('github:get-auth', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const token = await getGithubToken();
  const cli = await getGitHubCliStatus();
  return { success: true, configured: Boolean(token), authenticated: cli.authenticated || Boolean(token), account: cli.account || '', source: cli.authenticated ? cli.source : token ? 'pat' : 'none' };
});

ipcMain.handle('github:set-token', async (event, token) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try {
    const value = String(token || '').trim();
    if (!value) {
      await fs.rm(githubConfigPath, { force: true });
      return { success: true, configured: false };
    }
    if (!/^(gh[pousr]_|github_pat_)[A-Za-z0-9_]+$/.test(value)) return { success: false, error: 'Enter a valid GitHub token.' };
    await saveGithubToken(value);
    return { success: true, configured: true };
  } catch (error) { return { success: false, error: error.message || 'Could not save GitHub token.' }; }
});

ipcMain.handle('git_status', async (event, rootPath) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try { return await getGitStatus(rootPath); } catch (error) { return { success: false, error: error.message || 'Could not read Git status.' }; }
});

ipcMain.handle('git_diff', async (event, rootPath) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try { const result = await runGit(rootPath, ['diff', 'HEAD'], 30_000); return { success: true, diff: result.stdout || '' }; }
  catch (error) { return { success: false, error: error.message || 'Could not read Git diff.' }; }
});

ipcMain.handle('git_create_branch', async (event, rootPath, branchName) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try {
    const branch = String(branchName || '').trim().replace(/[^a-zA-Z0-9._/-]+/g, '-').replace(/^[-/]+|[-/]+$/g, '').slice(0, 80);
    if (!branch) return { success: false, error: 'A valid branch name is required.' };
    const result = await runGit(rootPath, ['switch', '-c', branch]);
    return { success: true, branch, output: result.stdout || result.stderr || '' };
  } catch (error) { return { success: false, error: error.message || 'Could not create Git branch.' }; }
});

ipcMain.handle('git_commit', async (event, rootPath, message) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try {
    const commitMessage = String(message || '').trim();
    if (!/^(feat|fix|refactor):\s+\S+/i.test(commitMessage)) return { success: false, error: 'Commit message must use feat:, fix:, or refactor:.' };
    await runGit(rootPath, ['add', '-A']);
    const result = await runGit(rootPath, ['commit', '-m', commitMessage], 30_000);
    const hash = (await runGit(rootPath, ['rev-parse', '--short', 'HEAD'])).stdout.trim();
    return { success: true, message: commitMessage, hash, output: result.stdout || result.stderr || '' };
  } catch (error) { return { success: false, error: error.message || 'Could not create Git commit.' }; }
});

ipcMain.handle('git_push', async (event, rootPath, branchName) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try {
    const branch = String(branchName || '').trim() || (await runGit(rootPath, ['branch', '--show-current'])).stdout.trim();
    const result = await runGit(rootPath, ['push', '-u', 'origin', branch], 60_000);
    return { success: true, branch, output: result.stdout || result.stderr || '' };
  } catch (error) { return { success: false, error: error.message || 'Could not push the Git branch.' }; }
});

ipcMain.handle('github_create_pr', async (event, rootPath, details = {}) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try {
    const remote = String((await runGit(rootPath, ['remote', 'get-url', 'origin'])).stdout || '').trim();
    const repository = parseGitRemote(remote);
    if (!repository) throw new Error('The workspace origin is not a GitHub repository.');
    const token = await getGithubToken();
    const cliToken = token || (await execFileAsync('gh', ['auth', 'token'], { windowsHide: true, timeout: 8_000 })).stdout.trim();
    if (!cliToken) throw new Error('Authenticate GitHub in Settings or with gh auth login first.');
    const head = String(details.head || (await runGit(rootPath, ['branch', '--show-current'])).stdout.trim());
    const base = String(details.base || 'main');
    const response = await fetch(`https://api.github.com/repos/${repository.owner}/${repository.name}/pulls`, {
      method: 'POST',
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${cliToken}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: String(details.title || 'Turaen changes'), head, base, body: String(details.body || '') }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || `GitHub returned ${response.status}.`);
    return { success: true, url: payload.html_url, number: payload.number, title: payload.title, repository: repository.fullName };
  } catch (error) { return { success: false, error: error.message || 'Could not open GitHub Pull Request.' }; }
});

ipcMain.handle('nightshift:sync', async (event, payload = {}) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const state = await readNightshiftState();
  const remoteToken = String(payload.remoteWorker?.token || await getNightshiftRemoteToken());
  if (Array.isArray(payload.tasks)) state.queue = payload.tasks.map((task) => ({ ...task, status: task.status || 'queued' }));
  if (payload.schedule) state.schedule = { ...state.schedule, ...payload.schedule };
  if (payload.remoteWorker) {
    state.remoteWorker = { ...state.remoteWorker, ...payload.remoteWorker, token: '' };
    if (payload.remoteWorker.token !== undefined) await saveNightshiftRemoteToken(String(payload.remoteWorker.token || ''));
  }
  await writeNightshiftState(state);
  if (state.remoteWorker?.enabled && state.remoteWorker.endpoint) {
    try {
      const response = await fetch(`${String(state.remoteWorker.endpoint).replace(/\/$/, '')}/nightshift/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(remoteToken ? { Authorization: `Bearer ${remoteToken}` } : {}) }, body: JSON.stringify({ tasks: state.queue, schedule: state.schedule }) });
      if (!response.ok) throw new Error(`Remote worker returned ${response.status}.`);
      state.remoteSync = { status: 'synced', at: new Date().toISOString() };
      await writeNightshiftState(state);
    } catch (error) { state.remoteSync = { status: 'error', error: error.message, at: new Date().toISOString() }; await writeNightshiftState(state); }
  }
  return { success: true, state: { ...state, remoteWorker: { ...state.remoteWorker, token: state.remoteWorker?.token ? '••••••' : '' } } };
});

ipcMain.handle('nightshift:start', async (event, payload = {}) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const state = await readNightshiftState();
  if (Array.isArray(payload.tasks)) state.queue = payload.tasks.map((task) => ({ ...task, workspaceRoot: task.workspaceRoot || payload.workspaceRoot, ollamaModel: task.ollamaModel || payload.ollamaModel, status: 'queued' }));
  else if (payload.taskPrompt) state.queue = [{ id: `task-${Date.now()}`, title: payload.taskPrompt, verificationCommand: payload.defaultVerificationCommand || 'npm test', workspaceRoot: payload.workspaceRoot, ollamaModel: payload.ollamaModel, status: 'queued' }];
  await writeNightshiftState(state);
  return spawnNightshiftDaemon(['--once']);
});

ipcMain.handle('nightshift:status', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const state = await readNightshiftState();
  const remoteToken = await getNightshiftRemoteToken();
  if (state.remoteWorker?.enabled && state.remoteWorker.endpoint && remoteToken) {
    try {
      const response = await fetch(`${String(state.remoteWorker.endpoint).replace(/\/$/, '')}/nightshift/results`, { headers: { Authorization: `Bearer ${remoteToken}` } });
      if (response.ok) { state.remoteResults = await response.json(); await writeNightshiftState(state); }
    } catch {}
  }
  const runs = Object.values(state.runs || {});
  return { success: true, state, active: runs.find((run) => run.status === 'running') || null, daemonPid: nightshiftDaemonPid };
});

ipcMain.handle('nightshift:logs', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const state = await readNightshiftState();
  return { success: true, logs: state.logs || [], audit: state.audit || [] };
});

ipcMain.handle('nightshift:stop', async (event) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  if (nightshiftDaemonPid) { try { process.kill(nightshiftDaemonPid); } catch {} nightshiftDaemonPid = null; }
  const state = await readNightshiftState();
  for (const run of Object.values(state.runs || {})) if (run.status === 'running') run.status = 'aborted';
  await writeNightshiftState(state);
  return { success: true };
});

ipcMain.handle('nightshift:schedule', async (event, schedule = {}) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const state = await readNightshiftState();
  state.schedule = { ...state.schedule, ...schedule, enabled: schedule.enabled !== false };
  await writeNightshiftState(state);
  try { return await registerNightshiftSchedule(state.schedule); }
  catch (error) { return { success: false, error: error.message || 'Could not register the OS wake schedule.' }; }
});

ipcMain.handle('nightshift:test', async (event, options = {}) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  const state = await readNightshiftState();
  await writeNightshiftState(state);
  const child = spawn(nightshiftNodeCommand(), [nightshiftDaemonPath, '--test', '--state', nightshiftStatePath, '--workspace', String(options.workspaceRoot || process.cwd()), '--model', String(options.ollamaModel || 'qwen2.5-coder:3b')], { detached: true, windowsHide: true, stdio: 'ignore' });
  nightshiftDaemonPid = child.pid || null; child.unref(); startNightshiftLogPump();
  return { success: true, runId: `health-check-${Date.now()}` };
});
ipcMain.on('terminal.write', (event, { id = 'default', data } = {}) => {
  try { getTerminalSession(event, id)?.write(String(data || '')); }
  catch (error) { event.sender.send('terminal.incomingData', { id, data: `\r\n${error.message}\r\n` }); }
});
ipcMain.on('terminal.resize', (event, { id = 'default', cols, rows } = {}) => {
  try { getTerminalSession(event, id)?.resize(cols, rows); } catch {}
});
ipcMain.handle('terminal.close', (event, id = 'default') => {
  try {
    const session = getTerminalSession(event, id);
    if (session) { session.kill(); terminalSessions.delete(session.key); }
    if (activeTerminalIds.get(event.sender.id) === id) activeTerminalIds.set(event.sender.id, 'default');
    return { success: true };
  } catch (error) { return { success: false, error: error.message }; }
});
ipcMain.on('terminal.activate', (event, id = 'default') => {
  if (isTrustedModelRenderer(event)) activeTerminalIds.set(event.sender.id, String(id));
});

function runCommandInTerminal(event, command, cwd, workspaceRoot) {
  return new Promise((resolve) => {
    const id = activeTerminalIds.get(event.sender.id) || 'default';
    let session = getTerminalSession(event, id);
    if (!session || session.exited || session.child.killed) {
      const started = startTerminalSession(event, { id, cwd, workspaceRoot, shell: activeShells.get(event.sender.id) });
      if (!started.success) return resolve(started);
      session = getTerminalSession(event, id);
    }
    const commandId = `${Date.now()}_${++terminalCommandSequence}`;
    const timer = setTimeout(() => {
      pendingTerminalCommands.delete(commandId);
      resolve({ success: false, stdout: '', stderr: '', error: 'Command timed out after 5 minutes.' });
    }, 300000);
    pendingTerminalCommands.set(commandId, { key: session.key, output: '', resolve, timer });
    const normalizedCommand = String(command || '');
    const targetCwd = cwd || workspaceRoot;
    const quotePowerShell = (value) => `'${String(value).replace(/'/g, "''")}'`;
    const quotePosix = (value) => `'${String(value).replace(/'/g, "'\\''")}'`;
    const cdPrefix = targetCwd
      ? (process.platform === 'win32' ? `Set-Location -LiteralPath ${quotePowerShell(targetCwd)}; ` : `cd ${quotePosix(targetCwd)} && `)
      : '';
    const script = process.platform === 'win32'
      ? `${cdPrefix}& { ${normalizedCommand} }; $ideaaiCode = if ($?) { if ($LASTEXITCODE -ne $null) { $LASTEXITCODE } else { 0 } } else { 1 }; Write-Output "__IDEAAI_COMMAND_DONE:${commandId}:$ideaaiCode__"`
      : `${cdPrefix}{ ${normalizedCommand} }; ideaai_code=$?; printf '\\n__IDEAAI_COMMAND_DONE:${commandId}:%s__\\n' "$ideaai_code"`;
    session.write(`${script}\n`);
  });
}

const IGNORED_WORKSPACE_ENTRIES = new Set([
  '.git', 'node_modules', '.next', 'dist', 'build', 'release', 'coverage'
]);

async function collectWorkspaceEntries(rootPath, currentPath, entries, depth) {
  if (depth > 8 || entries.length >= 1000) return;
  const children = await fs.readdir(currentPath, { withFileTypes: true });
  for (const child of children) {
    if (IGNORED_WORKSPACE_ENTRIES.has(child.name)) continue;
    const absolutePath = path.join(currentPath, child.name);
    const relativePath = path.relative(rootPath, absolutePath) || child.name;
    if (child.isDirectory()) {
      entries.push({ path: relativePath, isDirectory: true });
      await collectWorkspaceEntries(rootPath, absolutePath, entries, depth + 1);
    } else {
      const stat = await fs.stat(absolutePath);
      entries.push({ path: relativePath, isDirectory: false, size: stat.size });
    }
    if (entries.length >= 1000) return;
  }
}

ipcMain.handle('inspect-workspace', async (event, rootPath) => {
  try {
    const resolvedRoot = path.resolve(rootPath);
    const entries = [];
    await collectWorkspaceEntries(resolvedRoot, resolvedRoot, entries, 0);
    return { success: true, content: entries };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-file-in-workspace', async (event, rootPath, filePath) => {
  try {
    const resolvedPath = resolveInsideWorkspace(rootPath, filePath);
    const content = await fs.readFile(resolvedPath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file-in-workspace', async (event, rootPath, filePath, content) => {
  try {
    const resolvedPath = resolveInsideWorkspace(rootPath, filePath);
    await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
    await fs.writeFile(resolvedPath, content, 'utf-8');
    return { success: true, content: path.relative(path.resolve(rootPath), resolvedPath) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-file-in-workspace', async (event, rootPath, filePath) => {
  if (!isTrustedModelRenderer(event)) return { success: false, error: 'Untrusted renderer.' };
  try {
    const target = resolveInsideWorkspace(rootPath, filePath);
    const stat = await fs.lstat(target);
    if (!stat.isFile()) return { success: false, error: 'Only files can be reverted from this panel.' };
    await fs.unlink(target);
    return { success: true };
  } catch (error) { return { success: false, error: error.message || 'Could not remove file.' }; }
});

ipcMain.handle('run-command-in-workspace', async (event, rootPath, command) => {
  try { return await runCommandInTerminal(event, command, rootPath, rootPath); }
  catch (error) { return { success: false, stdout: '', stderr: '', error: error.message }; }
});

// --- AI Agent IPC Handlers ---
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    // Klasor yoksa olustur
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-dir', async (event, dirPath) => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const result = files.map(f => ({ name: f.name, isDirectory: f.isDirectory() }));
    return { success: true, files: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('run-command', async (event, command, cwd) => {
  try { return await runCommandInTerminal(event, command, cwd, null); }
  catch (error) { return { success: false, stdout: '', stderr: '', error: error.message }; }
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (result.canceled) return { success: false };
  return { success: true, path: result.filePaths[0] };
});

// --- LOCAL AI ENGINE (OLLAMA) ROUTER ---
ipcMain.handle('ask-local-ai', async (event, messages, options = {}) => {
  try {
    const ready = await ensureOllamaReady();
    if (!ready.success) return { success: false, error: ready.error };
    const fastPath = Boolean(options?.fastPath);
    // Fast conversational replies must not wait on hardware probing or workspace work.
    const machine = fastPath ? null : await getMachineSnapshot();
    const model = activeOllamaModel;
    const promptMessages = [{ role: 'system', content: 'Always respond in clear, concise American English unless the user explicitly requests another language.' }, ...(Array.isArray(messages) ? messages : [])];
    const runtimeOptions = getOllamaRuntimeOptions(machine, fastPath);
    const basePayload = { model, messages: promptMessages, stream: true, options: runtimeOptions };
    const supportsThinking = /(^|[-:])(deepseek-r1|qwen3|qwq)(?=[:\-]|$)/i.test(model);
    const requestPayload = supportsThinking ? { ...basePayload, think: false } : basePayload;
    const requestChat = (payload) => fetch(`${ollamaBaseUrl()}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    let response = await requestChat(requestPayload);
    if (response.status === 400) {
      let body = {};
      try { body = await response.json(); } catch {}
      const firstError = String(body.error || 'Ollama rejected the chat request.');
      response = await requestChat(basePayload);
      if (!response.ok) {
        let retryBody = {};
        try { retryBody = await response.json(); } catch {}
        throw new Error(String(retryBody.error || firstError));
      }
    }

    if (!response.ok) {
      let body = {};
      try { body = await response.json(); } catch {}
      throw new Error(String(body.error || `Ollama API error: ${response.status} ${response.statusText}`));
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Ollama did not return a stream.');
    const decoder = new TextDecoder();
    let buffer = '';
    let text = '';
    const emit = (payload) => {
      try { if (!event.sender.isDestroyed()) event.sender.send('ollama:token', payload); } catch {}
    };
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        const item = JSON.parse(line);
        if (item.error) throw new Error(item.error);
        const token = String(item.message?.content || '');
        if (token) { text += token; emit({ token, done: false }); }
      }
      if (done) break;
    }
    if (buffer.trim()) {
      const item = JSON.parse(buffer);
      const token = String(item.message?.content || '');
      if (token) { text += token; emit({ token, done: false }); }
    }
    emit({ token: '', done: true });
    return { success: true, text };
    
  } catch (error) {
    console.error("Local AI error:", error);
    const message = error?.message || 'Could not connect to Ollama at 127.0.0.1:11434.';
    const unreachable = /ECONNREFUSED|ETIMEDOUT|timed out|fetch failed|could not connect|did not become ready/i.test(message);
    return {
      success: false, 
      error: message,
      code: unreachable ? 'OLLAMA_UNREACHABLE' : 'OLLAMA_API_ERROR',
      action: unreachable ? 'start' : /not found|pull/i.test(message) ? 'pull' : 'retry',
    };
  }
});
// -----------------------------
// -----------------------------

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Turaen',
    icon: resolvedAppIconPath,
    // Use a frameless desktop surface while retaining a native taskbar icon.
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    show: false
  });
  mainWindow.setIcon(resolvedAppIconPath);

  // Microsoft Store Google Auth Fix (Hide Electron from User-Agent)
  mainWindow.webContents.userAgent = mainWindow.webContents.userAgent.replace(/Electron\/\S+/, "");
  app.userAgentFallback = app.userAgentFallback ? app.userAgentFallback.replace(/Electron\/\S+/, "") : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  
  // Handle popups correctly for Firebase Auth
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        autoHideMenuBar: true,
        icon: resolvedAppIconPath,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      }
    };
  });

  // Wait for Next dev server to be ready
  (async () => {
    try {
      await waitOn({ resources: ['http://localhost:3000'], timeout: 20000, interval: 500 });
    } catch (e) {
      console.warn('[electron] Next dev server not reachable after wait, proceeding anyway');
    }
    const startUrl = isDev
      ? 'http://localhost:3000/matrix-demo/app'
      : (process.env.TURAEN_WEB_APP_URL || process.env.IDEAAI_WEB_APP_URL || 'https://turaen.com/matrix-demo/app');
    mainWindow.loadURL(startUrl);
  })();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Autonomous & Privacy Guardrail Subsystem
let privacyGuardInstance = null;
try {
  const { PrivacyGuardService, registerAutonomousIpcHandlers } = require('./dist/autonomous');
  registerAutonomousIpcHandlers();
  privacyGuardInstance = PrivacyGuardService.getInstance();
} catch (err) {
  console.warn('[autonomous] Could not initialize compiled autonomous module:', err.message);
}

app.whenReady().then(() => {
  if (privacyGuardInstance) {
    try {
      privacyGuardInstance.initialize();
    } catch (err) {
      console.warn('[autonomous] Failed to initialize PrivacyGuardService on defaultSession:', err.message);
    }
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  for (const session of terminalSessions.values()) session.child.kill();
  terminalSessions.clear();
  activeTerminalIds.clear();
  for (const pending of pendingTerminalCommands.values()) {
    clearTimeout(pending.timer);
    pending.resolve({ success: false, stdout: '', stderr: '', error: 'Application is closing.' });
  }
  pendingTerminalCommands.clear();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
