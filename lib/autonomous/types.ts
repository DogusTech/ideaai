export interface BlockedRequestLog {
  id: string;
  timestamp: string;
  url: string;
  hostname: string;
  method: string;
  resourceType?: string;
  reason: string;
}

export interface PrivacyGuardStatus {
  strictLocalMode: boolean;
  blockedCount: number;
  recentBlocked: BlockedRequestLog[];
  allowedHostnames: string[];
}

export interface GitSandboxStatus {
  isGitRepo: boolean;
  currentBranch: string;
  originalBranch: string;
  isolatedBranch?: string;
  isDirty: boolean;
  stashed: boolean;
  stashRef?: string;
}

export interface VerificationResult {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  passed: boolean;
}

export interface FileEditOperation {
  path: string;
  type: 'write' | 'delete' | 'patch';
  content?: string;
  backupContent?: string;
}

export interface SubtaskPlan {
  id: string;
  title: string;
  description: string;
  targetFiles: string[];
  verificationCommand: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
  retries: number;
  maxRetries: number;
  errorLog?: string;
  lastVerification?: VerificationResult;
  appliedEdits: FileEditOperation[];
}

export type OvernightRunStatus =
  | 'idle'
  | 'initializing'
  | 'planning'
  | 'executing'
  | 'verifying'
  | 'healing'
  | 'completed'
  | 'failed'
  | 'aborted'
  | 'paused';

export interface MorningSummaryReport {
  runId: string;
  taskPrompt: string;
  status: OvernightRunStatus;
  startedAt: string;
  finishedAt?: string;
  isolatedBranch: string;
  originalBranch: string;
  subtasks: {
    title: string;
    status: 'completed' | 'failed';
    retries: number;
    filesTouched: string[];
  }[];
  totalFilesModified: number;
  totalVerificationsPassed: number;
  totalVerificationsFailed: number;
  diffSummary: string;
  gitCommitHash?: string;
}

export interface OvernightRunCheckpoint {
  runId: string;
  taskPrompt: string;
  workspaceRoot: string;
  status: OvernightRunStatus;
  ollamaModel: string;
  createdAt: string;
  updatedAt: string;
  originalBranch: string;
  isolatedBranch: string;
  totalIterations: number;
  maxIterations: number;
  subtasks: SubtaskPlan[];
  currentSubtaskIndex: number;
  logs: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    message: string;
    subtaskId?: string;
  }>;
  summary?: MorningSummaryReport;
}

export interface OvernightRunOptions {
  workspaceRoot: string;
  taskPrompt: string;
  ollamaModel?: string;
  maxIterations?: number;
  stepTimeoutMs?: number;
  defaultVerificationCommand?: string;
  autoCommitOnSuccess?: boolean;
}
