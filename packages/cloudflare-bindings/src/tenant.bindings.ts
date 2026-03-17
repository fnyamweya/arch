export interface TenantBindings {
  readonly PLATFORM_DB: D1Database;
  readonly PLATFORM_CONFIG_KV: KVNamespace;
  readonly CLOUDFLARE_ACCOUNT_ID: string;
  readonly CLOUDFLARE_API_TOKEN: string;
  readonly PLATFORM_SENTRY_DSN: string;
}
