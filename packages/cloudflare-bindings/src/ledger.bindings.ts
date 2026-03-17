export interface LedgerBindings {
  readonly TENANT_DB: D1Database;
  readonly PLATFORM_DB: D1Database;
  readonly TENANT_EVENTS_QUEUE: Queue;
  readonly PLATFORM_SENTRY_DSN: string;
}
