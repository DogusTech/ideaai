import os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export type DeviceTier = 'small' | 'medium' | 'large' | 'massive';

export interface HardwareProfile {
  tier: DeviceTier;
  recommendedNumCtx: number;
  totalRamBytes: number;
  freeRamBytes: number;
  cpuCores: number;
  platform: string;
  gpuName: string;
  gpuVramBytes: number;
  tierLabel: string;
  tierDescription: string;
}

export class HardwareProfilerService {
  private static instance: HardwareProfilerService | null = null;
  private cachedProfile: HardwareProfile | null = null;

  private constructor() {}

  public static getInstance(): HardwareProfilerService {
    if (!HardwareProfilerService.instance) {
      HardwareProfilerService.instance = new HardwareProfilerService();
    }
    return HardwareProfilerService.instance;
  }

  /**
   * Detects dedicated GPU VRAM and model via nvidia-smi with cross-platform fallbacks.
   */
  public async detectGpu(): Promise<{ name: string; vramBytes: number }> {
    // 1. Try nvidia-smi
    try {
      const { stdout } = await execFileAsync(
        'nvidia-smi',
        ['--query-gpu=name,memory.total', '--format=csv,noheader,nounits'],
        { timeout: 6000, windowsHide: true }
      );
      const line = String(stdout || '').trim().split(/\r?\n/)[0];
      if (line) {
        const [rawName, rawMib] = line.split(',').map((s) => s.trim());
        const mib = Number(rawMib);
        if (rawName && !Number.isNaN(mib) && mib > 0) {
          return {
            name: rawName,
            vramBytes: mib * 1024 * 1024,
          };
        }
      }
    } catch {
      // nvidia-smi not available or failed
    }

    // 2. Windows fallback: PowerShell Win32_VideoController
    if (process.platform === 'win32') {
      try {
        const script =
          'Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM | ConvertTo-Json -Compress';
        const { stdout } = await execFileAsync(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-Command', script],
          { timeout: 7000, windowsHide: true }
        );
        const parsed = JSON.parse(String(stdout || 'null'));
        const controllers = Array.isArray(parsed) ? parsed : [parsed];
        const validController = controllers.find(
          (c) => c && c.Name && Number(c.AdapterRAM) > 0
        ) || controllers[0];

        if (validController && validController.Name) {
          return {
            name: String(validController.Name),
            vramBytes: Number(validController.AdapterRAM) || 0,
          };
        }
      } catch {
        // fallback to generic
      }
    }

    // 3. macOS fallback: system_profiler
    if (process.platform === 'darwin') {
      try {
        const { stdout } = await execFileAsync(
          'system_profiler',
          ['SPDisplaysDataType'],
          { timeout: 7000 }
        );
        const text = String(stdout || '');
        const chipsetMatch = text.match(/Chipset Model:\s*(.+)/i);
        const vramMatch = text.match(/VRAM \(Total\):\s*([\d.]+)\s*(MB|GB)/i);
        let vramBytes = 0;
        if (vramMatch) {
          const num = Number(vramMatch[1]);
          const unit = vramMatch[2].toUpperCase();
          vramBytes = unit === 'GB' ? num * 1024 * 1024 * 1024 : num * 1024 * 1024;
        }
        return {
          name: chipsetMatch ? chipsetMatch[1].trim() : 'Apple Silicon / Metal GPU',
          vramBytes,
        };
      } catch {
        // fallback
      }
    }

    return {
      name: 'Integrated Graphics / CPU Execution',
      vramBytes: 0,
    };
  }

  /**
   * Classifies hardware into 4 tiers:
   * - Small (<= 4 GB VRAM or <= 8 GB RAM) -> num_ctx: 4096
   * - Medium (6-8 GB VRAM or 16 GB RAM) -> num_ctx: 8192
   * - Large (12-16 GB VRAM or 32 GB RAM) -> num_ctx: 16384
   * - Massive (24+ GB VRAM or 64+ GB Unified/System RAM) -> num_ctx: 32768
   */
  public classifyTier(ramBytes: number, vramBytes: number): {
    tier: DeviceTier;
    recommendedNumCtx: number;
    tierLabel: string;
    tierDescription: string;
  } {
    const GIB = 1024 ** 3;
    const vramGB = vramBytes / GIB;
    const ramGB = ramBytes / GIB;

    if (vramGB >= 22 || ramGB >= 60) {
      return {
        tier: 'massive',
        recommendedNumCtx: 32768,
        tierLabel: 'Massive (32k Context)',
        tierDescription: 'High-end workstation or server GPU with 24GB+ VRAM or 64GB+ unified RAM. Perfect for 32B-70B models.',
      };
    }

    if (vramGB >= 11 || ramGB >= 28) {
      return {
        tier: 'large',
        recommendedNumCtx: 16384,
        tierLabel: 'Large (16k Context)',
        tierDescription: 'Pro developer setup with 12-16GB VRAM or 32GB RAM. Ideal for 14B-22B open-weights coding models.',
      };
    }

    if (vramGB >= 5.5 || ramGB >= 14) {
      return {
        tier: 'medium',
        recommendedNumCtx: 8192,
        tierLabel: 'Medium (8k Context)',
        tierDescription: 'Standard engineering laptop or desktop with 6-8GB VRAM or 16GB RAM. Excellent for 7B-8B coding models.',
      };
    }

    return {
      tier: 'small',
      recommendedNumCtx: 4096,
      tierLabel: 'Small (4k Context)',
      tierDescription: 'Lightweight setup with <=4GB VRAM or <=8GB RAM. Optimized for high-efficiency 3B models.',
    };
  }

  /**
   * Generates a complete hardware profile.
   */
  public async getProfile(forceRefresh = false): Promise<HardwareProfile> {
    if (this.cachedProfile && !forceRefresh) {
      return this.cachedProfile;
    }

    const totalRamBytes = os.totalmem();
    const freeRamBytes = os.freemem();
    const cpuCores = os.cpus().length;
    const platform = `${os.type()} ${os.arch()} (${os.release()})`;
    const gpu = await this.detectGpu();

    const classification = this.classifyTier(totalRamBytes, gpu.vramBytes);

    this.cachedProfile = {
      tier: classification.tier,
      recommendedNumCtx: classification.recommendedNumCtx,
      totalRamBytes,
      freeRamBytes,
      cpuCores,
      platform,
      gpuName: gpu.name,
      gpuVramBytes: gpu.vramBytes,
      tierLabel: classification.tierLabel,
      tierDescription: classification.tierDescription,
    };

    return this.cachedProfile;
  }
}
