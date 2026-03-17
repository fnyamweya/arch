export interface VendorBindings {
  readonly TENANT_DB: D1Database;
  readonly TENANT_KV: KVNamespace;
  readonly TENANT_EVENTS_QUEUE: Queue;
  readonly PLATFORM_SENTRY_DSN: string;
}
