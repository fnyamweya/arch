export interface GatewayBindings {
  readonly PLATFORM_DB: D1Database;
  readonly PLATFORM_CONFIG_KV: KVNamespace;
  readonly RATE_LIMITER_WORKER: Fetcher;
  readonly AUTH_WORKER: Fetcher;
  readonly CATALOG_WORKER: Fetcher;
  readonly ORDER_WORKER: Fetcher;
  readonly VENDOR_WORKER: Fetcher;
  readonly TENANT_WORKER: Fetcher;
  readonly LEDGER_WORKER: Fetcher;
  readonly PLATFORM_SENTRY_DSN: string;
}
