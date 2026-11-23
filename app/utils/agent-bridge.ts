export interface AgentBridgeResponse<T = any> {
  success: boolean;
  content?: T;
  files?: Array<{ name: string; isDirectory: boolean }>;
  stdout?: string;
  stderr?: string;
  text?: string;
  error?: string;
}

export interface WorkspaceEntry {
  path: string;
  isDirectory: boolean;
  size?: number;
}

type ElectronRendererBridge = {
  isElectron: true
  invoke(channel: string, ...args: unknown[]): Promise<any>
  send(channel: string, payload?: unknown): void
  on(channel: string, listener: (payload: any) => void): () => void
}

export class AgentBridge {
  private static getIpcRenderer(): ElectronRendererBridge | null {
    if (typeof window === 'undefined') return null
    return (window as Window & { electronAPI?: ElectronRendererBridge }).electronAPI || null
  }

  static isElectron(): boolean {
    return this.getIpcRenderer() !== null;
  }

  static async readFile(filePath: string): Promise<AgentBridgeResponse<string>> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('read-file', filePath);
  }

  static async readFileInWorkspace(rootPath: string, filePath: string): Promise<AgentBridgeResponse<string>> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('read-file-in-workspace', rootPath, filePath);
  }

  static async askLocalAI(messages: any[], options?: { fastPath?: boolean; structured?: boolean }): Promise<AgentBridgeResponse<string>> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('ask-local-ai', messages, options || {});
  }

  static onLocalToken(listener: (payload: { token: string; done: boolean }) => void) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return () => undefined;
    return ipcRenderer.on('ollama:token', listener)
  }

  static async writeFile(filePath: string, content: string): Promise<AgentBridgeResponse> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('write-file', filePath, content);
  }

  static async listDir(dirPath: string): Promise<AgentBridgeResponse> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('list-dir', dirPath);
  }

  static async inspectWorkspace(rootPath: string): Promise<AgentBridgeResponse<WorkspaceEntry[]>> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('inspect-workspace', rootPath);
  }

  static async writeFileInWorkspace(rootPath: string, filePath: string, content: string): Promise<AgentBridgeResponse> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('write-file-in-workspace', rootPath, filePath, content);
  }

  static async deleteFileInWorkspace(rootPath: string, filePath: string): Promise<AgentBridgeResponse> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('delete-file-in-workspace', rootPath, filePath);
  }

  static async runCommandInWorkspace(rootPath: string, command: string): Promise<AgentBridgeResponse> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('run-command-in-workspace', rootPath, command);
  }

  static async runCommand(command: string, cwd: string): Promise<AgentBridgeResponse> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('run-command', command, cwd);
  }

  static async selectDirectory(): Promise<{success: boolean, path?: string}> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false };
    return await ipcRenderer.invoke('select-directory');
  }

  static async startTerminal(options: { id?: string; cwd?: string; workspaceRoot?: string; shell?: string }) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('terminal.start', options);
  }

  static writeTerminal(data: string, id = 'default') {
    this.getIpcRenderer()?.send('terminal.write', { id, data });
  }

  static activateTerminal(id = 'default') {
    this.getIpcRenderer()?.send('terminal.activate', id);
  }

  static resizeTerminal(cols: number, rows: number, id = 'default') {
    this.getIpcRenderer()?.send('terminal.resize', { id, cols, rows });
  }

  static async closeTerminal(id = 'default') {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('terminal.close', id);
  }

  static async getGitBranch(rootPath: string): Promise<{ success: boolean; branch: string }> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, branch: 'main' };
    return await ipcRenderer.invoke('workspace.get-git-branch', rootPath);
  }

  static async getGitStatus(rootPath: string) {
    return this.getIpcRenderer()?.invoke('git_status', rootPath) ?? { success: false, error: 'Not running in Electron' }
  }

  static async getGitDiff(rootPath: string) {
    return this.getIpcRenderer()?.invoke('git_diff', rootPath) ?? { success: false, error: 'Not running in Electron' }
  }

  static async createGitBranch(rootPath: string, branchName: string) {
    return this.getIpcRenderer()?.invoke('git_create_branch', rootPath, branchName) ?? { success: false, error: 'Not running in Electron' }
  }

  static async commitGit(rootPath: string, message: string) {
    return this.getIpcRenderer()?.invoke('git_commit', rootPath, message) ?? { success: false, error: 'Not running in Electron' }
  }

  static async pushGit(rootPath: string, branchName?: string) {
    return this.getIpcRenderer()?.invoke('git_push', rootPath, branchName) ?? { success: false, error: 'Not running in Electron' }
  }

  static async createGitHubPullRequest(rootPath: string, details: { title: string; body: string; head?: string; base?: string }) {
    return this.getIpcRenderer()?.invoke('github_create_pr', rootPath, details) ?? { success: false, error: 'Not running in Electron' }
  }

  static async getGitHubAuth() {
    return this.getIpcRenderer()?.invoke('github:get-auth') ?? { success: false, error: 'Not running in Electron' }
  }

  static async setGitHubToken(token: string) {
    return this.getIpcRenderer()?.invoke('github:set-token', token) ?? { success: false, error: 'Not running in Electron' }
  }

  static async getPlanState() {
    return this.getIpcRenderer()?.invoke('subscription:get') ?? { success: false, error: 'Not running in Electron' }
  }

  static async setPlanState(state: { tier: 'free' | 'pro'; devPreview: boolean }) {
    return this.getIpcRenderer()?.invoke('subscription:set', state) ?? { success: false, error: 'Not running in Electron' }
  }

  static onTerminalData(listener: (payload: { id: string; data: string }) => void) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return () => undefined;
    return ipcRenderer.on('terminal.incomingData', listener)
  }

  // --- Phase 1: Local Privacy Guardrail Bridge ---
  static async toggleStrictPrivacy(enabled?: boolean) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('privacy:toggle-strict-mode', enabled);
  }

  static async getPrivacyStatus() {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('privacy:get-status');
  }

  static async clearPrivacyAudit() {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('privacy:clear-audit');
  }

  // --- Phase 1: Safe Git Sandbox Bridge ---
  static async prepareGitSandbox(workspaceRoot: string) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('git-sandbox:prepare', workspaceRoot);
  }

  static async getGitSandboxDiff(workspaceRoot: string) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('git-sandbox:diff', workspaceRoot);
  }

  static async restoreGitSandbox(workspaceRoot: string, popStash = false) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('git-sandbox:restore', workspaceRoot, popStash);
  }

  // --- Phase 1: Checkpointed Autonomous Overnight Runner Bridge ---
  static async startOvernightRun(options: {
    workspaceRoot: string;
    taskPrompt: string;
    ollamaModel?: string;
    maxIterations?: number;
    stepTimeoutMs?: number;
    defaultVerificationCommand?: string;
  }) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('overnight:start', options);
  }

  static async getOvernightCheckpoint(runId: string) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('overnight:get-checkpoint', runId);
  }

  static async abortOvernightRun(runId: string) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('overnight:abort', runId);
  }

  static async pauseOvernightRun(runId: string) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('overnight:pause', runId);
  }

  static async listActiveOvernightRuns() {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('overnight:list-active');
  }

  static async syncNightShift(payload: { tasks?: any[]; schedule?: any; remoteWorker?: any }) {
    return this.getIpcRenderer()?.invoke('nightshift:sync', payload) ?? { success: false, error: 'Not running in Electron' }
  }

  static async startNightShift(payload: { tasks?: any[]; workspaceRoot?: string; ollamaModel?: string; taskPrompt?: string; defaultVerificationCommand?: string }) {
    return this.getIpcRenderer()?.invoke('nightshift:start', payload) ?? { success: false, error: 'Not running in Electron' }
  }

  static async getNightShiftStatus() {
    return this.getIpcRenderer()?.invoke('nightshift:status') ?? { success: false, error: 'Not running in Electron' }
  }

  static async getNightShiftLogs() {
    return this.getIpcRenderer()?.invoke('nightshift:logs') ?? { success: false, error: 'Not running in Electron' }
  }

  static async stopNightShift() {
    return this.getIpcRenderer()?.invoke('nightshift:stop') ?? { success: false, error: 'Not running in Electron' }
  }

  static async scheduleNightShift(schedule: { enabled?: boolean; time?: string; frequency?: string; wake?: boolean }) {
    return this.getIpcRenderer()?.invoke('nightshift:schedule', schedule) ?? { success: false, error: 'Not running in Electron' }
  }

  static async testNightShift(options: { workspaceRoot?: string; ollamaModel?: string }) {
    return this.getIpcRenderer()?.invoke('nightshift:test', options) ?? { success: false, error: 'Not running in Electron' }
  }

  static onNightShiftLog(listener: (payload: any) => void) {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return () => undefined;
    return ipcRenderer.on('nightshift:log', listener)
  }
}
