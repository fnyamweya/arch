export interface AuthBindings {
  readonly PLATFORM_DB: D1Database;
  readonly PLATFORM_CONFIG_KV: KVNamespace;
  readonly BETTER_AUTH_SECRET: string;
  readonly INTERNAL_BOOTSTRAP_SECRET: string;
  readonly BETTER_AUTH_TRUSTED_ORIGINS?: string;
  readonly BETTER_AUTH_COOKIE_DOMAIN?: string;
  readonly BETTER_AUTH_GOOGLE_CLIENT_ID?: string;
  readonly BETTER_AUTH_GOOGLE_CLIENT_SECRET?: string;
  readonly BETTER_AUTH_FACEBOOK_CLIENT_ID?: string;
  readonly BETTER_AUTH_FACEBOOK_CLIENT_SECRET?: string;
  readonly PHONE_OTP_WEBHOOK_URL?: string;
  readonly PLATFORM_SENTRY_DSN: string;
}
