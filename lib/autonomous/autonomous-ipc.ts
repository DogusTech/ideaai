import { ipcMain, BrowserWindow } from 'electron';
import { PrivacyGuardService } from './privacy-guard.service';
import { GitSandboxService } from './git-sandbox.service';
import { OvernightRunnerService } from './overnight-runner.service';
import { HardwareProfilerService } from './hardware-profiler.service';
import { OpenModelHubService } from './open-model-hub.service';
import { OvernightRunOptions } from './types';

export function registerAutonomousIpcHandlers(): void {
  const privacyGuard = PrivacyGuardService.getInstance();
  const hardwareProfiler = HardwareProfilerService.getInstance();
  const modelHub = OpenModelHubService.getInstance();

  // Forward model pull progress to all active browser windows
  modelHub.on('progress', (progressEvent) => {
    try {
      const windows = BrowserWindow.getAllWindows();
      for (const win of windows) {
        if (!win.isDestroyed()) {
          win.webContents.send('models:pull-progress', progressEvent);
        }
      }
    } catch (err: any) {
      console.warn('[autonomous-ipc] Error sending pull progress:', err.message);
    }
  });

  // --- 0. Hardware Profiler Channels ---
  ipcMain.removeHandler('hardware:get-profile');
  ipcMain.handle('hardware:get-profile', async (_event, forceRefresh?: boolean) => {
    try {
      const profile = await hardwareProfiler.getProfile(forceRefresh);
      return { success: true, profile };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // --- 0.1 In-App Open-Source Model Hub Channels ---
  ipcMain.handle('models:get-hub-catalog', async () => {
    try {
      const catalog = await modelHub.getCatalog();
      return { success: true, catalog };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('models:hub-pull', async (_event, modelTag: string) => {
    try {
      return await modelHub.pullModel(modelTag);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('models:hub-cancel-pull', (_event, modelTag: string) => {
    try {
      const cancelled = modelHub.cancelPull(modelTag);
      return { success: true, cancelled };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('models:hub-delete', async (_event, modelTag: string) => {
    try {
      return await modelHub.deleteModel(modelTag);
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // --- 1. Privacy Guardrail Channels ---
  ipcMain.handle('privacy:toggle-strict-mode', (_event, enabled?: boolean) => {
    try {
      if (typeof enabled === 'boolean') {
        return { success: true, status: privacyGuard.setStrictMode(enabled) };
      }
      return { success: true, status: privacyGuard.toggleStrictMode() };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('privacy:get-status', () => {
    try {
      return { success: true, status: privacyGuard.getStatus() };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('privacy:clear-audit', () => {
    try {
      privacyGuard.clearAuditLogs();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // --- 2. Git Sandbox Channels ---
  ipcMain.handle('git-sandbox:prepare', async (_event, workspaceRoot: string) => {
    try {
      const sandbox = new GitSandboxService(workspaceRoot);
      const status = await sandbox.prepareSandbox();
      return { success: true, status };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('git-sandbox:diff', async (_event, workspaceRoot: string) => {
    try {
      const sandbox = new GitSandboxService(workspaceRoot);
      const diff = await sandbox.getDiffSummary();
      return { success: true, diff };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('git-sandbox:restore', async (_event, workspaceRoot: string, popStash?: boolean) => {
    try {
      const sandbox = new GitSandboxService(workspaceRoot);
      await sandbox.restoreOriginalBranch(popStash);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // --- 3. Overnight Runner Channels ---
  ipcMain.handle('overnight:start', async (_event, options: OvernightRunOptions) => {
    try {
      const runner = OvernightRunnerService.create(options);
      // Run asynchronously in background so IPC returns immediately with runId
      runner.run().catch((err) => {
        console.error(`[AutonomousRunner] Run ${runner.getCheckpoint().runId} failed:`, err);
      });

      return { success: true, runId: runner.getCheckpoint().runId, checkpoint: runner.getCheckpoint() };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('overnight:get-checkpoint', (_event, runId: string) => {
    try {
      const runner = OvernightRunnerService.getActiveRunner(runId);
      if (!runner) {
        return { success: false, error: `No active runner found for runId: ${runId}` };
      }
      return { success: true, checkpoint: runner.getCheckpoint() };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('overnight:abort', (_event, runId: string) => {
    try {
      const runner = OvernightRunnerService.getActiveRunner(runId);
      if (runner) {
        runner.abort();
        return { success: true };
      }
      return { success: false, error: `Runner ${runId} not found` };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('overnight:pause', (_event, runId: string) => {
    try {
      const runner = OvernightRunnerService.getActiveRunner(runId);
      if (runner) {
        runner.pause();
        return { success: true };
      }
      return { success: false, error: `Runner ${runId} not found` };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('overnight:list-active', () => {
    try {
      return { success: true, runs: OvernightRunnerService.listActiveRunners() };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}
