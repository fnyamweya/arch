export interface OrderBindings {
  readonly TENANT_DB: D1Database;
  readonly TENANT_KV: KVNamespace;
  readonly TENANT_EVENTS_QUEUE: Queue;
  readonly INVENTORY_LOCKS_WORKER: Fetcher;
  readonly PLATFORM_SENTRY_DSN: string;
}
