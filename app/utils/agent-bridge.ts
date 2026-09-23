export interface AgentBridgeResponse<T = any> {
  success: boolean;
  content?: T;
  files?: Array<{ name: string; isDirectory: boolean }>;
  stdout?: string;
  stderr?: string;
  error?: string;
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

  static async readFile(filePath: string): Promise<AgentBridgeResponse<string>> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('read-file', filePath);
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

  static async runCommand(command: string, cwd: string): Promise<AgentBridgeResponse> {
    const ipcRenderer = this.getIpcRenderer();
    if (!ipcRenderer) return { success: false, error: 'Not running in Electron' };
    return await ipcRenderer.invoke('run-command', command, cwd);
  }
}
