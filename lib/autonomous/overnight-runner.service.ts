import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { GitSandboxService } from './git-sandbox.service';
import { HardwareProfilerService } from './hardware-profiler.service';
import {
  LOCAL_OLLAMA_LARGE_NUM_CTX,
  LOCAL_OLLAMA_NUM_CTX,
  packLocalConversation,
  truncateLocalText,
} from '../local-context';
import {
  OvernightRunCheckpoint,
  OvernightRunOptions,
  OvernightRunStatus,
  SubtaskPlan,
  VerificationResult,
  MorningSummaryReport,
} from './types';

const execAsync = promisify(exec);

export class OvernightRunnerService {
  private static activeRunners = new Map<string, OvernightRunnerService>();

  private options: OvernightRunOptions;
  private checkpoint: OvernightRunCheckpoint;
  private gitSandbox: GitSandboxService;
  private abortRequested: boolean = false;
  private pauseRequested: boolean = false;
  private checkpointFilePath: string;

  private constructor(options: OvernightRunOptions) {
    this.options = {
      maxIterations: 20,
      stepTimeoutMs: 120_000,
      ollamaModel: 'qwen2.5-coder:7b',
      autoCommitOnSuccess: true,
      ...options,
    };

    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.gitSandbox = new GitSandboxService(this.options.workspaceRoot);

    this.checkpointFilePath = path.join(
      this.options.workspaceRoot,
      '.ideaai',
      'runs',
      `${runId}.json`
    );

    this.checkpoint = {
      runId,
      taskPrompt: this.options.taskPrompt,
      workspaceRoot: path.resolve(this.options.workspaceRoot),
      status: 'idle',
      ollamaModel: this.options.ollamaModel || 'qwen2.5-coder:7b',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      originalBranch: '',
      isolatedBranch: '',
      totalIterations: 0,
      maxIterations: this.options.maxIterations || 20,
      subtasks: [],
      currentSubtaskIndex: 0,
      logs: [],
    };
  }

  public static create(options: OvernightRunOptions): OvernightRunnerService {
    const runner = new OvernightRunnerService(options);
    OvernightRunnerService.activeRunners.set(runner.checkpoint.runId, runner);
    return runner;
  }

  public static getActiveRunner(runId: string): OvernightRunnerService | undefined {
    return OvernightRunnerService.activeRunners.get(runId);
  }

  public static listActiveRunners(): OvernightRunCheckpoint[] {
    return Array.from(OvernightRunnerService.activeRunners.values()).map(r => r.getCheckpoint());
  }

  public getCheckpoint(): OvernightRunCheckpoint {
    return { ...this.checkpoint };
  }

  public abort(): void {
    this.abortRequested = true;
    this.log('warn', 'Abort requested by user.');
    this.checkpoint.status = 'aborted';
    this.persistCheckpoint().catch(console.error);
  }

  public pause(): void {
    this.pauseRequested = true;
    this.log('info', 'Pause requested by user.');
    this.checkpoint.status = 'paused';
    this.persistCheckpoint().catch(console.error);
  }

  private log(level: 'info' | 'warn' | 'error' | 'success', message: string, subtaskId?: string) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      subtaskId,
    };
    this.checkpoint.logs.push(entry);
    console.log(`[OvernightRunner:${level.toUpperCase()}] ${message}`);
  }

  private async persistCheckpoint(): Promise<void> {
    try {
      this.checkpoint.updatedAt = new Date().toISOString();
      await fs.mkdir(path.dirname(this.checkpointFilePath), { recursive: true });
      await fs.writeFile(
        this.checkpointFilePath,
        JSON.stringify(this.checkpoint, null, 2),
        'utf-8'
      );
    } catch (err: any) {
      console.error('[OvernightRunner] Failed to persist checkpoint:', err.message);
    }
  }

  /**
   * Safe local call to Ollama endpoint (strictly 127.0.0.1:11434).
   * Automatically applies the detected hardware tier's optimal num_ctx context window.
   */
  private async queryOllama(messages: Array<{ role: string; content: string }>): Promise<string> {
    const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
    const url = `${baseUrl}/api/chat`;

    let numCtx = LOCAL_OLLAMA_NUM_CTX;
    try {
      const profile = await HardwareProfilerService.getInstance().getProfile();
      numCtx = Math.min(LOCAL_OLLAMA_LARGE_NUM_CTX, Math.max(LOCAL_OLLAMA_NUM_CTX, profile.recommendedNumCtx));
    } catch {
      numCtx = LOCAL_OLLAMA_NUM_CTX;
    }

    const packedMessages = packLocalConversation(messages, {
      contextWindow: numCtx,
      reserveTokens: 1024,
      systemBudgetRatio: 0.6,
      maxMessages: 24,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);
    const requestChat = (requestMessages: typeof packedMessages) => fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.checkpoint.ollamaModel,
        messages: requestMessages,
        stream: false,
        options: {
          temperature: 0.2,
          num_ctx: numCtx,
          keep_alive: '15m',
          top_p: 0.9,
        },
      }),
      signal: controller.signal,
    });

    try {
      let response = await requestChat(packedMessages);
      if (response.status === 400) {
        const errorText = await response.text();
        if (/context|token|length|too long|prompt/i.test(errorText)) {
          const reducedMessages = packLocalConversation(messages, {
            contextWindow: Math.max(2048, Math.floor(numCtx / 2)),
            reserveTokens: 512,
            systemBudgetRatio: 0.55,
            maxMessages: 12,
          });
          response = await requestChat(reducedMessages);
        }
      }

      if (!response.ok) {
        throw new Error(`Ollama returned status ${response.status}: ${response.statusText}`);
      }

      const data: any = await response.json();
      return data?.message?.content || '';
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Subtask planning phase: parses user prompt into atomic actionable tasks.
   */
  private async planSubtasks(): Promise<SubtaskPlan[]> {
    this.checkpoint.status = 'planning';
    this.log('info', `Planning autonomous task execution using model ${this.checkpoint.ollamaModel}...`);
    await this.persistCheckpoint();

    const systemPrompt = `Always respond in clear, concise American English unless the user explicitly requests another language.
You are the IdeaAI Autonomous Planning Engine.
Your job is to break down a software engineering task into atomic subtasks.
Respond ONLY with a valid JSON array of objects with the following schema:
[
  {
    "id": "task-1",
    "title": "Short title",
    "description": "What exact changes to make",
    "targetFiles": ["relative/path/to/file.ts"],
    "verificationCommand": "npm test or npx tsc --noEmit or npm run build"
  }
]
Do not output markdown code blocks or conversational text. Output pure JSON only.`;

    const userPrompt = `Task to execute autonomously:\n"${this.options.taskPrompt}"\n\nWorkspace root: "${this.options.workspaceRoot}"\nDefault verification command: "${this.options.defaultVerificationCommand || 'npm test'}"`;

    const rawResponse = await this.queryOllama([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    try {
      const cleanJson = rawResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, index) => ({
          id: item.id || `task-${index + 1}`,
          title: item.title || `Subtask ${index + 1}`,
          description: item.description || '',
          targetFiles: Array.isArray(item.targetFiles) ? item.targetFiles : [],
          verificationCommand: item.verificationCommand || this.options.defaultVerificationCommand || 'npm test',
          status: 'pending',
          retries: 0,
          maxRetries: 3,
          appliedEdits: [],
        }));
      }
    } catch (parseErr) {
      this.log('warn', `Ollama output was not standard JSON array. Creating single fallback task.`);
    }

    // Fallback single task
    return [
      {
        id: 'task-1',
        title: 'Execute Requested Task',
        description: this.options.taskPrompt,
        targetFiles: [],
        verificationCommand: this.options.defaultVerificationCommand || 'npm test',
        status: 'pending',
        retries: 0,
        maxRetries: 3,
        appliedEdits: [],
      },
    ];
  }

  /**
   * Runs verification command (build/lint/test) inside the workspace root.
   */
  private async runVerification(command: string): Promise<VerificationResult> {
    const start = Date.now();
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.options.workspaceRoot,
        windowsHide: true,
        timeout: this.options.stepTimeoutMs || 120_000,
        maxBuffer: 4 * 1024 * 1024,
      });

      return {
        command,
        exitCode: 0,
        stdout: String(stdout || ''),
        stderr: String(stderr || ''),
        durationMs: Date.now() - start,
        passed: true,
      };
    } catch (err: any) {
      return {
        command,
        exitCode: typeof err?.code === 'number' ? err.code : 1,
        stdout: String(err?.stdout || ''),
        stderr: String(err?.stderr || err?.message || ''),
        durationMs: Date.now() - start,
        passed: false,
      };
    }
  }

  /**
   * Generates and applies code modifications for a subtask.
   */
  private async executeSubtaskEdits(subtask: SubtaskPlan, errorContext?: string): Promise<void> {
    const isHealing = Boolean(errorContext);
    this.checkpoint.status = isHealing ? 'healing' : 'executing';
    await this.persistCheckpoint();

    let existingFileContents = '';
    for (const relPath of subtask.targetFiles) {
      if (existingFileContents.length >= 12_000) break;
      try {
        const fullPath = path.resolve(this.options.workspaceRoot, relPath);
        const data = await fs.readFile(fullPath, 'utf-8');
        // Keep the whole prompt inside the local context window.
        const remainingBudget = Math.max(0, 12_000 - existingFileContents.length);
        existingFileContents += `\n--- File: ${relPath} ---\n${truncateLocalText(data, Math.min(1600, Math.floor(remainingBudget / 3)))}\n`;
      } catch {
        // File may be new
        existingFileContents += `\n--- File: ${relPath} (New file) ---\n`;
      }
    }

    const systemPrompt = `Always respond in clear, concise American English unless the user explicitly requests another language.
You are IdeaAI Autonomous Engineer. You generate concrete file writes to solve engineering tasks.
Output ONLY a JSON array of files to write or update, formatted as:
[
  {
    "path": "relative/path/to/file.ts",
    "content": "full content of the file"
  }
]
No conversation or markdown outside JSON.`;

    const promptMessage = isHealing
      ? `Subtask: "${subtask.title}"\nDescription: "${subtask.description}"\n\nPREVIOUS VERIFICATION FAILED:\n${truncateLocalText(String(errorContext || ''), 1200)}\n\nExisting files:\n${existingFileContents}\nFix the error and produce the corrected file contents.`
      : `Subtask: "${subtask.title}"\nDescription: "${subtask.description}"\n\nExisting files:\n${existingFileContents}\nProduce the files to accomplish this subtask.`;

    const rawResponse = await this.queryOllama([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: promptMessage },
    ]);

    try {
      const cleanJson = rawResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const filesToWrite: Array<{ path: string; content: string }> = JSON.parse(cleanJson);

      for (const item of filesToWrite) {
        if (!item.path || typeof item.content !== 'string') continue;
        const targetPath = path.resolve(this.options.workspaceRoot, item.path);

        // Security check: must reside inside workspaceRoot
        if (!targetPath.startsWith(path.resolve(this.options.workspaceRoot))) {
          this.log('error', `Security guardrail blocked attempt to write outside workspace: ${item.path}`);
          continue;
        }

        let backup: string | undefined;
        try {
          backup = await fs.readFile(targetPath, 'utf-8');
        } catch {
          backup = undefined;
        }

        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, item.content, 'utf-8');

        subtask.appliedEdits.push({
          path: item.path,
          type: 'write',
          content: item.content,
          backupContent: backup,
        });

        this.log('info', `Applied file edit: ${item.path}`, subtask.id);
      }
    } catch (parseErr) {
      this.log('warn', `Could not parse Ollama edit response as JSON: ${rawResponse.slice(0, 100)}...`);
    }
  }

  /**
   * Main state-machine execution loop with self-healing and hard circuit breakers.
   */
  public async run(): Promise<MorningSummaryReport> {
    try {
      this.checkpoint.status = 'initializing';
      this.log('info', `Starting autonomous overnight run: ${this.checkpoint.runId}`);
      await this.persistCheckpoint();

      // Step 1: Git Sandbox Isolation
      const sandboxStatus = await this.gitSandbox.prepareSandbox();
      this.checkpoint.originalBranch = sandboxStatus.originalBranch;
      this.checkpoint.isolatedBranch = sandboxStatus.isolatedBranch || '';
      this.log('info', `Isolated sandbox branch created: ${this.checkpoint.isolatedBranch}`);
      await this.persistCheckpoint();

      // Step 2: Plan Subtasks
      this.checkpoint.subtasks = await this.planSubtasks();
      this.log('info', `Planned ${this.checkpoint.subtasks.length} subtasks.`);
      await this.persistCheckpoint();

      // Step 3: Execution Loop
      for (let i = 0; i < this.checkpoint.subtasks.length; i++) {
        if (this.abortRequested) {
          this.checkpoint.status = 'aborted';
          break;
        }
        if (this.pauseRequested) {
          this.checkpoint.status = 'paused';
          break;
        }

        this.checkpoint.currentSubtaskIndex = i;
        const subtask = this.checkpoint.subtasks[i];
        subtask.status = 'running';
        this.log('info', `[Subtask ${i + 1}/${this.checkpoint.subtasks.length}] ${subtask.title}`, subtask.id);
        await this.persistCheckpoint();

        let subtaskSuccess = false;
        let lastErrorContext = '';

        while (subtask.retries <= subtask.maxRetries) {
          // Hard circuit breaker check
          this.checkpoint.totalIterations++;
          if (this.checkpoint.totalIterations > this.checkpoint.maxIterations) {
            this.log('error', `Hard circuit breaker tripped! Maximum total iterations (${this.checkpoint.maxIterations}) exceeded.`);
            throw new Error(`Max iterations (${this.checkpoint.maxIterations}) reached. Autonomous runner halted.`);
          }

          if (this.abortRequested || this.pauseRequested) break;

          // Apply edits (or self-heal if retrying)
          await this.executeSubtaskEdits(subtask, lastErrorContext);

          // Verification step
          this.checkpoint.status = 'verifying';
          await this.persistCheckpoint();

          this.log('info', `Verifying subtask with command: ${subtask.verificationCommand}`, subtask.id);
          const verification = await this.runVerification(subtask.verificationCommand);
          subtask.lastVerification = verification;

          if (verification.passed) {
            subtaskSuccess = true;
            subtask.status = 'completed';
            this.log('success', `Verification passed for "${subtask.title}" in ${verification.durationMs}ms`, subtask.id);
            break;
          } else {
            subtask.retries++;
            this.log(
              'warn',
              `Verification failed (exit code ${verification.exitCode}). Attempt ${subtask.retries}/${subtask.maxRetries} to self-heal.`,
              subtask.id
            );
            lastErrorContext = `Exit Code: ${verification.exitCode}\nSTDERR:\n${verification.stderr}\nSTDOUT:\n${verification.stdout}`;
            subtask.errorLog = lastErrorContext;
            await this.persistCheckpoint();
          }
        }

        if (!subtaskSuccess) {
          subtask.status = 'failed';
          this.log('error', `Subtask "${subtask.title}" failed after ${subtask.maxRetries} healing retries.`, subtask.id);
        }

        await this.persistCheckpoint();
      }

      // Step 4: Commit and Produce Morning Summary Report
      const allPassed = this.checkpoint.subtasks.every(s => s.status === 'completed');
      let commitHash: string | null = null;

      if (this.options.autoCommitOnSuccess) {
        commitHash = await this.gitSandbox.commitSandboxChanges(
          `feat(auto): autonomous run ${this.checkpoint.runId}\n\nTask: ${this.options.taskPrompt}`
        );
        if (commitHash) {
          this.log('success', `Committed changes to ${this.checkpoint.isolatedBranch} (${commitHash.substring(0, 8)})`);
        }
      }

      const diffSummary = await this.gitSandbox.getDiffSummary();
      const uniqueFilesTouched = new Set(
        this.checkpoint.subtasks.flatMap(s => s.appliedEdits.map(e => e.path))
      );

      const morningSummary: MorningSummaryReport = {
        runId: this.checkpoint.runId,
        taskPrompt: this.options.taskPrompt,
        status: allPassed ? 'completed' : 'failed',
        startedAt: this.checkpoint.createdAt,
        finishedAt: new Date().toISOString(),
        isolatedBranch: this.checkpoint.isolatedBranch,
        originalBranch: this.checkpoint.originalBranch,
        subtasks: this.checkpoint.subtasks.map(s => ({
          title: s.title,
          status: s.status === 'completed' ? 'completed' : 'failed',
          retries: s.retries,
          filesTouched: s.appliedEdits.map(e => e.path),
        })),
        totalFilesModified: uniqueFilesTouched.size,
        totalVerificationsPassed: this.checkpoint.subtasks.filter(s => s.status === 'completed').length,
        totalVerificationsFailed: this.checkpoint.subtasks.filter(s => s.status === 'failed').length,
        diffSummary,
        gitCommitHash: commitHash || undefined,
      };

      this.checkpoint.summary = morningSummary;
      this.checkpoint.status = morningSummary.status;
      await this.persistCheckpoint();

      this.log('success', `Autonomous run finished. Morning report generated.`);
      return morningSummary;
    } catch (err: any) {
      this.checkpoint.status = 'failed';
      this.log('error', `Run terminated with fatal error: ${err.message}`);
      await this.persistCheckpoint();
      throw err;
    } finally {
      OvernightRunnerService.activeRunners.delete(this.checkpoint.runId);
    }
  }
}
