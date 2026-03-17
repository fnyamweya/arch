export interface AuthBindings {
  readonly PLATFORM_DB: D1Database;
  readonly PLATFORM_CONFIG_KV: KVNamespace;
  readonly CLERK_KEY_ENCRYPTION_SECRET: string;
  readonly PLATFORM_SENTRY_DSN: string;
}
