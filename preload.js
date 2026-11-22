const { contextBridge, ipcRenderer } = require('electron');

const invokeChannels = new Set([
  'read-file', 'read-file-in-workspace', 'ask-local-ai', 'write-file', 'list-dir',
  'inspect-workspace', 'write-file-in-workspace', 'delete-file-in-workspace', 'run-command-in-workspace', 'run-command',
  'select-directory', 'terminal.start', 'terminal.close', 'workspace.get-git-branch',
  'models:get-machine', 'models:get-runtime-status', 'ollama:list', 'ollama:pull', 'ollama:load', 'ollama:delete',
  'ollama:ensure-ready', 'ollama:get-binary', 'ollama:browse-binary', 'ollama:install',
  'github:get-auth', 'github:set-token', 'git_status', 'git_diff', 'git_create_branch', 'git_commit', 'git_push', 'github_create_pr',
  'nightshift:sync', 'nightshift:start', 'nightshift:status', 'nightshift:logs', 'nightshift:stop', 'nightshift:schedule', 'nightshift:test',
  'subscription:get', 'subscription:set',
  // Autonomous & Privacy channels
  'privacy:toggle-strict-mode', 'privacy:get-status', 'privacy:clear-audit',
  'git-sandbox:prepare', 'git-sandbox:diff', 'git-sandbox:restore',
  'overnight:start', 'overnight:get-checkpoint', 'overnight:abort', 'overnight:pause', 'overnight:list-active',
  // Hardware Profiler & Model Hub channels
  'hardware:get-profile', 'models:get-hub-catalog', 'models:hub-pull', 'models:hub-cancel-pull', 'models:hub-delete',
]);
const invokeChannelsExtended = ['window:minimize', 'window:toggle-maximize', 'window:close', 'theme:set'];
for (const channel of invokeChannelsExtended) invokeChannels.add(channel);
const sendChannels = new Set(['terminal.write', 'terminal.activate', 'terminal.resize']);
const eventChannels = new Set(['terminal.incomingData', 'ollama:pull-progress', 'ollama:install-progress', 'models:pull-progress', 'ollama:token', 'nightshift:log']);

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  invoke(channel, ...args) {
    if (!invokeChannels.has(channel)) return Promise.reject(new Error(`IPC channel is not allowed: ${channel}`));
    return ipcRenderer.invoke(channel, ...args);
  },
  send(channel, payload) {
    if (!sendChannels.has(channel)) throw new Error(`IPC channel is not allowed: ${channel}`);
    ipcRenderer.send(channel, payload);
  },
  on(channel, callback) {
    if (!eventChannels.has(channel)) throw new Error(`IPC event is not allowed: ${channel}`);
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
});
