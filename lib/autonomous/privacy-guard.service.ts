import { session, Session } from 'electron';
import { BlockedRequestLog, PrivacyGuardStatus } from './types';

export class PrivacyGuardService {
  private static instance: PrivacyGuardService | null = null;
  private strictMode = false;
  private blockedLogs: BlockedRequestLog[] = [];
  private maxLogs = 200;
  private targetSession: Session | null = null;
  private filterAttached = false;

  private readonly ALLOWED_HOSTS = new Set([
    'localhost',
    '127.0.0.1',
    '::1',
    '0.0.0.0',
    'app.localhost',
  ]);

  private constructor() {}

  public static getInstance(): PrivacyGuardService {
    if (!PrivacyGuardService.instance) {
      PrivacyGuardService.instance = new PrivacyGuardService();
    }
    return PrivacyGuardService.instance;
  }

  public initialize(customSession?: Session): void {
    if (this.filterAttached) return;

    this.targetSession = customSession || session.defaultSession;
    if (!this.targetSession) {
      console.warn('[PrivacyGuard] Default Electron session is not available yet.');
      return;
    }

    // Intercept outbound network requests before they leave Electron
    this.targetSession.webRequest.onBeforeRequest(
      { urls: ['*://*/*'] },
      (details, callback) => {
        if (!this.strictMode) {
          return callback({ cancel: false });
        }

        const isAllowed = this.isRequestAllowed(details.url);

        if (isAllowed) {
          return callback({ cancel: false });
        }

        // Request blocked: Audit & record
        let hostname = 'unknown';
        try {
          hostname = new URL(details.url).hostname.toLowerCase();
        } catch {
          hostname = details.url;
        }

        const entry: BlockedRequestLog = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toISOString(),
          url: details.url,
          hostname,
          method: details.method || 'GET',
          resourceType: details.resourceType,
          reason: 'Blocked by Provable 100% Local Privacy Mode (Only localhost/127.0.0.1 permitted)',
        };

        this.blockedLogs.unshift(entry);
        if (this.blockedLogs.length > this.maxLogs) {
          this.blockedLogs.pop();
        }

        console.info(
          `[PrivacyGuard:BLOCKED] Disallowed outbound request stopped: ${details.method} ${details.url}`
        );

        return callback({ cancel: true });
      }
    );

    this.filterAttached = true;
    console.info('[PrivacyGuard] Strict Local Privacy Guardrail initialized on session.');
  }

  public setStrictMode(enabled: boolean): PrivacyGuardStatus {
    this.strictMode = Boolean(enabled);
    console.info(`[PrivacyGuard] Strict Local Privacy Mode is now ${this.strictMode ? 'ACTIVE (Zero outbound traffic)' : 'DISABLED'}`);
    return this.getStatus();
  }

  public toggleStrictMode(): PrivacyGuardStatus {
    return this.setStrictMode(!this.strictMode);
  }

  public getStatus(): PrivacyGuardStatus {
    return {
      strictLocalMode: this.strictMode,
      blockedCount: this.blockedLogs.length,
      recentBlocked: [...this.blockedLogs.slice(0, 50)],
      allowedHostnames: Array.from(this.ALLOWED_HOSTS),
    };
  }

  public clearAuditLogs(): void {
    this.blockedLogs = [];
  }

  public isRequestAllowed(rawUrl: string): boolean {
    if (!rawUrl) return false;

    // Custom protocols (devtools, data, blob, file) are internal
    if (
      rawUrl.startsWith('devtools:') ||
      rawUrl.startsWith('data:') ||
      rawUrl.startsWith('blob:') ||
      rawUrl.startsWith('file:') ||
      rawUrl.startsWith('chrome-extension:')
    ) {
      return true;
    }

    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname.toLowerCase();

      // Check against allowed local endpoints
      if (this.ALLOWED_HOSTS.has(host)) {
        return true;
      }

      // Explicit local domain suffix (e.g. *.localhost)
      if (host.endsWith('.localhost')) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }
}
