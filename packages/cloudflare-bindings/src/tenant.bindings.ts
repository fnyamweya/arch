export interface TenantBindings {
  readonly PLATFORM_DB: D1Database;
  readonly PLATFORM_CONFIG_KV: KVNamespace;
  readonly AUTH_WORKER: Fetcher;
  readonly INTERNAL_BOOTSTRAP_SECRET: string;
  readonly CLOUDFLARE_ACCOUNT_ID: string;
  readonly CLOUDFLARE_API_TOKEN: string;
  readonly PLATFORM_BASE_DOMAIN: string;
  readonly GATEWAY_WORKER_SERVICE: string;
  readonly GATEWAY_WORKER_ENVIRONMENT?: string;
  readonly PLATFORM_SENTRY_DSN: string;
}
