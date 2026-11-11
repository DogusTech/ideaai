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

export class AgentBridge {
  private static getIpcRenderer() {
    if (typeof window !== 'undefined' && window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        return ipcRenderer;
      } catch (error) {
        console.warn('Electron ipcRenderer not available:', error);
      }
    }
    return null;
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

  static async askLocalAI(messages: any[]): Promise<AgentBridgeResponse<string>> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('ask-local-ai', messages);
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
}
