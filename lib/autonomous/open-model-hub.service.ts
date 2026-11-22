import { EventEmitter } from 'events';
import { DeviceTier } from './hardware-profiler.service';

export interface CuratedModelItem {
  id: string;
  name: string;
  modelTag: string;
  family: 'Qwen' | 'Meta' | 'DeepSeek' | 'Mistral' | 'Microsoft' | 'OpenCoder';
  tier: DeviceTier;
  downloadSizeApprox: string;
  parameters: string;
  contextWindow: number;
  description: string;
  recommended: boolean;
  installed?: boolean;
}

export interface ModelPullProgressEvent {
  modelTag: string;
  status: 'starting' | 'pulling' | 'verifying' | 'complete' | 'error' | 'cancelled';
  completedBytes: number;
  totalBytes: number;
  percent: number;
  message?: string;
  error?: string;
}

export const CURATED_MODEL_CATALOG: CuratedModelItem[] = [
  // Small Tier (<=4GB VRAM or <=8GB RAM)
  {
    id: 'qwen2.5-coder-3b',
    name: 'Qwen 2.5 Coder 3B',
    modelTag: 'qwen2.5-coder:3b',
    family: 'Qwen',
    tier: 'small',
    downloadSizeApprox: '1.9 GB',
    parameters: '3.09B',
    contextWindow: 4096,
    description: 'Ultra-fast lightweight coder with low RAM footprint. Runs smoothly on ultrabooks.',
    recommended: true,
  },
  {
    id: 'llama-3.2-3b',
    name: 'Llama 3.2 3B',
    modelTag: 'llama3.2:3b',
    family: 'Meta',
    tier: 'small',
    downloadSizeApprox: '2.0 GB',
    parameters: '3.21B',
    contextWindow: 4096,
    description: 'Meta compact reasoning model, responsive for general engineering assistance.',
    recommended: false,
  },
  {
    id: 'phi3.5-3.8b',
    name: 'Phi-3.5 Mini 3.8B',
    modelTag: 'phi3.5:3.8b',
    family: 'Microsoft',
    tier: 'small',
    downloadSizeApprox: '2.2 GB',
    parameters: '3.82B',
    contextWindow: 4096,
    description: 'Microsoft compact model with strong code and reasoning logic.',
    recommended: false,
  },

  // Medium Tier (6–8GB VRAM or 16GB RAM)
  {
    id: 'qwen2.5-coder-7b',
    name: 'Qwen 2.5 Coder 7B',
    modelTag: 'qwen2.5-coder:7b',
    family: 'Qwen',
    tier: 'medium',
    downloadSizeApprox: '4.7 GB',
    parameters: '7.61B',
    contextWindow: 8192,
    description: 'Industry benchmark for local agentic coding. Superb refactoring & tool use.',
    recommended: true,
  },
  {
    id: 'opencoder-8b',
    name: 'OpenCoder 8B',
    modelTag: 'opencoder:8b',
    family: 'OpenCoder',
    tier: 'medium',
    downloadSizeApprox: '4.9 GB',
    parameters: '8.0B',
    contextWindow: 8192,
    description: 'Truly open-source reproducible code model trained from scratch.',
    recommended: false,
  },
  {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B Instruct',
    modelTag: 'llama3.1:8b',
    family: 'Meta',
    tier: 'medium',
    downloadSizeApprox: '4.7 GB',
    parameters: '8.03B',
    contextWindow: 8192,
    description: 'Meta premier mid-sized open model with balanced coding and prose skills.',
    recommended: false,
  },
  {
    id: 'deepseek-coder-v2-16b',
    name: 'DeepSeek Coder V2 16B (Lite)',
    modelTag: 'deepseek-coder-v2:16b',
    family: 'DeepSeek',
    tier: 'medium',
    downloadSizeApprox: '8.9 GB',
    parameters: '15.7B MoE (2.4B active)',
    contextWindow: 8192,
    description: 'High-performance Mixture-of-Experts coder activating 2.4B params per token.',
    recommended: false,
  },

  // Large Tier (12–16GB VRAM or 32GB RAM)
  {
    id: 'qwen2.5-coder-14b',
    name: 'Qwen 2.5 Coder 14B',
    modelTag: 'qwen2.5-coder:14b',
    family: 'Qwen',
    tier: 'large',
    downloadSizeApprox: '9.0 GB',
    parameters: '14.7B',
    contextWindow: 16384,
    description: 'Deep architectural comprehension, multi-file edits, and complex test generation.',
    recommended: true,
  },
  {
    id: 'codestral-22b',
    name: 'Mistral Codestral 22B',
    modelTag: 'codestral:22b',
    family: 'Mistral',
    tier: 'large',
    downloadSizeApprox: '13.0 GB',
    parameters: '22.2B',
    contextWindow: 16384,
    description: 'Mistral state-of-the-art coding powerhouse with extensive language coverage.',
    recommended: false,
  },
  {
    id: 'deepseek-r1-14b',
    name: 'DeepSeek R1 Distill 14B',
    modelTag: 'deepseek-r1:14b',
    family: 'DeepSeek',
    tier: 'large',
    downloadSizeApprox: '9.0 GB',
    parameters: '14.7B',
    contextWindow: 16384,
    description: 'Reasoning-distilled open weights with step-by-step autonomous problem solving.',
    recommended: false,
  },

  // Massive Tier (24+GB VRAM or 64+GB Unified RAM)
  {
    id: 'qwen2.5-coder-32b',
    name: 'Qwen 2.5 Coder 32B',
    modelTag: 'qwen2.5-coder:32b',
    family: 'Qwen',
    tier: 'massive',
    downloadSizeApprox: '19.8 GB',
    parameters: '32.5B',
    contextWindow: 32768,
    description: 'Near Claude 3.5 Sonnet autonomous programming accuracy on local hardware.',
    recommended: true,
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B Instruct',
    modelTag: 'llama3.3:70b',
    family: 'Meta',
    tier: 'massive',
    downloadSizeApprox: '42.0 GB',
    parameters: '70.6B',
    contextWindow: 32768,
    description: 'Flagship open weights model rivaling commercial cloud LLMs in software engineering.',
    recommended: false,
  },
  {
    id: 'deepseek-r1-32b',
    name: 'DeepSeek R1 Distill 32B',
    modelTag: 'deepseek-r1:32b',
    family: 'DeepSeek',
    tier: 'massive',
    downloadSizeApprox: '19.8 GB',
    parameters: '32.8B',
    contextWindow: 32768,
    description: 'High-density chain-of-thought engine for complex overnight architecture tasks.',
    recommended: false,
  },
];

export class OpenModelHubService extends EventEmitter {
  private static instance: OpenModelHubService | null = null;
  private activeAbortControllers = new Map<string, AbortController>();

  private constructor() {
    super();
  }

  public static getInstance(): OpenModelHubService {
    if (!OpenModelHubService.instance) {
      OpenModelHubService.instance = new OpenModelHubService();
    }
    return OpenModelHubService.instance;
  }

  private ollamaBaseUrl(): string {
    return (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
  }

  /**
   * Retrieves curated models catalog, marking those currently installed in local Ollama.
   */
  public async getCatalog(): Promise<CuratedModelItem[]> {
    const installed = await this.listInstalledModels();
    const installedTags = new Set(installed.map((m) => m.name.toLowerCase()));

    return CURATED_MODEL_CATALOG.map((item) => ({
      ...item,
      installed: installedTags.has(item.modelTag.toLowerCase()),
    }));
  }

  /**
   * Lists all installed models directly from local Ollama endpoint.
   */
  public async listInstalledModels(): Promise<Array<{ name: string; id: string; sizeBytes: number; modifiedAt: string }>> {
    try {
      const response = await fetch(`${this.ollamaBaseUrl()}/api/tags`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return [];
      const payload: any = await response.json();
      return (payload.models || []).map((model: any) => ({
        name: String(model.name || model.model || ''),
        id: String(model.digest || ''),
        sizeBytes: Number(model.size || 0),
        modifiedAt: String(model.modified_at || ''),
      })).filter((m: any) => m.name);
    } catch {
      return [];
    }
  }

  /**
   * Streams model download via Ollama's /api/pull and emits progress events.
   */
  public async pullModel(modelTag: string): Promise<{ success: boolean; error?: string }> {
    if (this.activeAbortControllers.has(modelTag)) {
      return { success: false, error: 'Download is already in progress for this model.' };
    }

    const controller = new AbortController();
    this.activeAbortControllers.set(modelTag, controller);

    const emitProgress = (payload: Omit<ModelPullProgressEvent, 'modelTag'>) => {
      this.emit('progress', { modelTag, ...payload } as ModelPullProgressEvent);
    };

    try {
      emitProgress({
        status: 'starting',
        completedBytes: 0,
        totalBytes: 0,
        percent: 0,
        message: `Connecting to local Ollama daemon for ${modelTag}...`,
      });

      const response = await fetch(`${this.ollamaBaseUrl()}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelTag, stream: true }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Ollama returned HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let isDone = false;

      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const item = JSON.parse(line);
            if (item.error) throw new Error(item.error);

            if (item.status === 'success') {
              isDone = true;
            }

            const total = Number(item.total || 0);
            const completed = Number(item.completed || 0);
            const percent = total > 0 ? Math.min(99, Math.round((completed / total) * 100)) : 0;

            emitProgress({
              status: item.status === 'success' ? 'complete' : 'pulling',
              completedBytes: completed,
              totalBytes: total,
              percent: isDone ? 100 : percent,
              message: String(item.status || 'Downloading model layers...'),
            });
          } catch (err: any) {
            if (err.message && !err.message.includes('Unexpected')) {
              throw err;
            }
          }
        }

        if (done) break;
      }

      emitProgress({
        status: 'complete',
        completedBytes: 100,
        totalBytes: 100,
        percent: 100,
        message: 'Download complete and verified by Ollama.',
      });

      return { success: true };
    } catch (err: any) {
      const isCancelled = controller.signal.aborted;
      emitProgress({
        status: isCancelled ? 'cancelled' : 'error',
        completedBytes: 0,
        totalBytes: 0,
        percent: 0,
        error: isCancelled ? 'Download cancelled by user.' : err.message,
      });
      return { success: false, error: err.message };
    } finally {
      this.activeAbortControllers.delete(modelTag);
    }
  }

  /**
   * Cancels an active model download.
   */
  public cancelPull(modelTag: string): boolean {
    const controller = this.activeAbortControllers.get(modelTag);
    if (controller) {
      controller.abort();
      this.activeAbortControllers.delete(modelTag);
      return true;
    }
    return false;
  }

  /**
   * Deletes a model from local storage.
   */
  public async deleteModel(modelTag: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.ollamaBaseUrl()}/api/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelTag }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete model: Ollama returned ${response.status}`);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
