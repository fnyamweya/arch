CREATE TABLE IF NOT EXISTS clerk_configurations (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL UNIQUE,
  clerk_publishable_key TEXT NOT NULL,
  clerk_secret_key_encrypted TEXT NOT NULL,
  clerk_webhook_secret TEXT NOT NULL,
  clerk_jwks_url TEXT NOT NULL,
  configured_at INTEGER NOT NULL,
  configured_by TEXT NOT NULL
);
