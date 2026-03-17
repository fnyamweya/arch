export interface LoggerContext {
  readonly requestId?: string;
  readonly tenantId?: string;
  readonly userId?: string;
  readonly [key: string]: unknown;
}

export interface LoggerPort {
  info(message: string, context?: LoggerContext): void;
  warn(message: string, context?: LoggerContext): void;
  error(message: string, context?: LoggerContext): void;
}

export interface SentryInitConfig {
  readonly dsn: string;
  readonly environment: string;
  readonly tracesSampleRate: number;
}
