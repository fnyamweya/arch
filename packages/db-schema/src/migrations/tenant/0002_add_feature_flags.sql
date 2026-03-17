CREATE TABLE IF NOT EXISTS tenant_feature_flags (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  key TEXT NOT NULL,
  enabled INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (tenant_id, key)
);
