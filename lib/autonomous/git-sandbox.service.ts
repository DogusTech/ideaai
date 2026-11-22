import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { GitSandboxStatus } from './types';

const execFileAsync = promisify(execFile);

export class GitSandboxService {
  private workspaceRoot: string;
  private originalBranch: string = 'main';
  private isolatedBranch: string = '';
  private didStash: boolean = false;
  private stashRef: string = '';

  constructor(workspaceRoot: string) {
    this.workspaceRoot = path.resolve(workspaceRoot);
  }

  private async runGit(args: string[], timeoutMs = 15000): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    try {
      const { stdout, stderr } = await execFileAsync('git', args, {
        cwd: this.workspaceRoot,
        windowsHide: true,
        timeout: timeoutMs,
        maxBuffer: 5 * 1024 * 1024,
      });
      return { stdout: String(stdout || '').trim(), stderr: String(stderr || '').trim(), exitCode: 0 };
    } catch (err: any) {
      return {
        stdout: String(err?.stdout || '').trim(),
        stderr: String(err?.stderr || err?.message || '').trim(),
        exitCode: typeof err?.code === 'number' ? err.code : 1,
      };
    }
  }

  /**
   * Verifies if directory is a git repository.
   */
  public async isGitRepository(): Promise<boolean> {
    const res = await this.runGit(['rev-parse', '--is-inside-work-tree']);
    return res.exitCode === 0 && res.stdout === 'true';
  }

  /**
   * Gets current branch name or detached state.
   */
  public async getCurrentBranch(): Promise<string> {
    const res = await this.runGit(['branch', '--show-current']);
    if (res.exitCode === 0 && res.stdout) {
      return res.stdout;
    }
    const headRes = await this.runGit(['rev-parse', '--short', 'HEAD']);
    return headRes.stdout ? `detached-${headRes.stdout}` : 'HEAD';
  }

  /**
   * Checks for uncommitted changes (tracked + untracked).
   */
  public async hasUncommittedChanges(): Promise<boolean> {
    const res = await this.runGit(['status', '--porcelain']);
    return Boolean(res.stdout && res.stdout.length > 0);
  }

  /**
   * Prepares safe autonomous sandbox:
   * 1. Checks git repo.
   * 2. Preserves current branch.
   * 3. Stashes dirty state if present.
   * 4. Creates and checks out isolated branch `ideaai/auto-<timestamp>`.
   */
  public async prepareSandbox(): Promise<GitSandboxStatus> {
    const isRepo = await this.isGitRepository();
    if (!isRepo) {
      throw new Error(`Workspace at ${this.workspaceRoot} is not a valid Git repository.`);
    }

    this.originalBranch = await this.getCurrentBranch();
    const isDirty = await this.hasUncommittedChanges();

    if (isDirty) {
      const stashMsg = `ideaai-auto-stash-${Date.now()}`;
      const stashRes = await this.runGit(['stash', 'push', '-u', '-m', stashMsg]);
      if (stashRes.exitCode === 0) {
        this.didStash = true;
        this.stashRef = stashMsg;
      } else {
        throw new Error(`Failed to stash uncommitted changes before autonomous run: ${stashRes.stderr}`);
      }
    }

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    this.isolatedBranch = `ideaai/auto-${timestamp}`;

    const checkoutRes = await this.runGit(['checkout', '-b', this.isolatedBranch]);
    if (checkoutRes.exitCode !== 0) {
      throw new Error(`Failed to create isolated sandbox branch ${this.isolatedBranch}: ${checkoutRes.stderr}`);
    }

    return {
      isGitRepo: true,
      currentBranch: this.isolatedBranch,
      originalBranch: this.originalBranch,
      isolatedBranch: this.isolatedBranch,
      isDirty: false,
      stashed: this.didStash,
      stashRef: this.stashRef || undefined,
    };
  }

  /**
   * Generates diff stats between the original branch and the isolated sandbox.
   */
  public async getDiffSummary(): Promise<string> {
    const diffStat = await this.runGit(['diff', '--stat', `${this.originalBranch}...${this.isolatedBranch}`]);
    if (diffStat.exitCode === 0 && diffStat.stdout) {
      return diffStat.stdout;
    }
    const localStat = await this.runGit(['diff', '--stat']);
    return localStat.stdout || 'No file changes detected.';
  }

  /**
   * Commits current autonomous work on the sandbox branch.
   */
  public async commitSandboxChanges(message: string): Promise<string | null> {
    await this.runGit(['add', '-A']);
    const commitRes = await this.runGit(['commit', '-m', message]);
    if (commitRes.exitCode === 0) {
      const hashRes = await this.runGit(['rev-parse', 'HEAD']);
      return hashRes.stdout || null;
    }
    return null;
  }

  /**
   * Restores original working branch and pops stash if requested.
   */
  public async restoreOriginalBranch(popStash = false): Promise<void> {
    if (this.originalBranch) {
      await this.runGit(['checkout', this.originalBranch]);
      if (popStash && this.didStash) {
        await this.runGit(['stash', 'pop']);
        this.didStash = false;
      }
    }
  }

  public getStatus(): GitSandboxStatus {
    return {
      isGitRepo: true,
      currentBranch: this.isolatedBranch || this.originalBranch,
      originalBranch: this.originalBranch,
      isolatedBranch: this.isolatedBranch || undefined,
      isDirty: false,
      stashed: this.didStash,
      stashRef: this.stashRef || undefined,
    };
  }
}
