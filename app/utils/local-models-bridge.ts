export type DeviceTier = 'low' | 'medium' | 'high'

export type HardwareProfile = {
  tier: DeviceTier
  recommendedNumCtx: number
  totalRamBytes: number
  freeRamBytes: number
  cpuCores: number
  platform: string
  gpuName: string
  gpuVramBytes: number
  tierLabel: string
  tierDescription: string
}

export type CuratedModelItem = {
  id: string
  name: string
  modelTag: string
  family: 'Qwen' | 'Meta' | 'DeepSeek' | 'Mistral' | 'Microsoft' | 'OpenCoder'
  tier: DeviceTier
  downloadSizeApprox: string
  parameters: string
  contextWindow: number
  description: string
  recommended: boolean
  installed?: boolean
}

export type ModelPullProgressEvent = {
  modelTag: string
  status: 'starting' | 'pulling' | 'verifying' | 'complete' | 'error' | 'cancelled'
  completedBytes: number
  totalBytes: number
  percent: number
  message?: string
  error?: string
}

export type MachineSnapshot = {
  totalRamBytes: number
  freeRamBytes: number
  gpuName: string
  gpuVramBytes?: number
  tier?: DeviceTier
  tierLabel?: string
  recommendedNumCtx?: number
  platform: string
  modelDirectory: string
}

export type InstalledOllamaModel = {
  name: string
  id: string
  sizeBytes: number
  modifiedAt: string
}

export type ModelStorage = {
  totalBytes: number
  freeBytes: number
  modelBytes: number
  otherBytes: number
  path: string
}

export type PullProgress = {
  modelName: string
  percent: number
  status: string
  message?: string
}

type IpcRendererLike = {
  invoke(channel: string, ...args: unknown[]): Promise<any>
  on(channel: string, listener: (payload: any) => void): () => void
}

function getIpcRenderer(): IpcRendererLike | null {
  if (typeof window === 'undefined') return null
  try {
    return (window as Window & { electronAPI?: IpcRendererLike }).electronAPI || null
  } catch {
    return null
  }
}

export const localModelsBridge = {
  available: () => Boolean(getIpcRenderer()),
  getMachine: () => getIpcRenderer()?.invoke('models:get-machine') ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),
  getRuntimeStatus: () => getIpcRenderer()?.invoke('models:get-runtime-status') ?? Promise.resolve({ success: false, ollama: false, lmStudio: false }),
  ensureOllamaReady: () => getIpcRenderer()?.invoke('ollama:ensure-ready') ?? Promise.resolve({ success: false, error: 'The desktop Ollama bridge is unavailable.' }),
  getOllamaBinary: () => getIpcRenderer()?.invoke('ollama:get-binary') ?? Promise.resolve({ success: false, path: '' }),
  browseOllamaBinary: () => getIpcRenderer()?.invoke('ollama:browse-binary') ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),
  installOllama: () => getIpcRenderer()?.invoke('ollama:install') ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),
  list: () => getIpcRenderer()?.invoke('ollama:list') ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),
  pull: (modelName: string) => getIpcRenderer()?.invoke('ollama:pull', modelName) ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),
  load: (modelName: string) => getIpcRenderer()?.invoke('ollama:load', modelName) ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),
  remove: (modelName: string) => getIpcRenderer()?.invoke('ollama:delete', modelName) ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),
  onPullProgress(callback: (progress: PullProgress) => void) {
    const ipc = getIpcRenderer()
    if (!ipc) return () => undefined
    return ipc.on('ollama:pull-progress', callback)
  },
  onInstallProgress(callback: (progress: { percent?: number; status?: string; message?: string }) => void) {
    const ipc = getIpcRenderer()
    if (!ipc) return () => undefined
    return ipc.on('ollama:install-progress', callback)
  },

  // --- Phase 2: Hardware Profiler & Open-Source Model Hub ---
  getHardwareProfile: (forceRefresh = false): Promise<{ success: boolean; profile?: HardwareProfile; error?: string }> =>
    getIpcRenderer()?.invoke('hardware:get-profile', forceRefresh) ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),
  
  getHubCatalog: (): Promise<{ success: boolean; catalog?: CuratedModelItem[]; error?: string }> =>
    getIpcRenderer()?.invoke('models:get-hub-catalog') ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),

  hubPull: (modelTag: string): Promise<{ success: boolean; error?: string }> =>
    getIpcRenderer()?.invoke('models:hub-pull', modelTag) ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),

  hubCancelPull: (modelTag: string): Promise<{ success: boolean; cancelled?: boolean; error?: string }> =>
    getIpcRenderer()?.invoke('models:hub-cancel-pull', modelTag) ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),

  hubDelete: (modelTag: string): Promise<{ success: boolean; error?: string }> =>
    getIpcRenderer()?.invoke('models:hub-delete', modelTag) ?? Promise.resolve({ success: false, error: 'Desktop IPC is unavailable.' }),

  onHubPullProgress(callback: (progress: ModelPullProgressEvent) => void) {
    const ipc = getIpcRenderer()
    if (!ipc) return () => undefined
    return ipc.on('models:pull-progress', callback)
  },
}
