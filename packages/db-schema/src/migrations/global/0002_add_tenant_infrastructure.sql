CREATE TABLE IF NOT EXISTS tenant_infrastructure (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL UNIQUE,
  d1_database_id TEXT NOT NULL,
  kv_namespace_id TEXT NOT NULL,
  r2_bucket_name TEXT NOT NULL,
  queue_name TEXT NOT NULL,
  configured_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tenant_domains (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  is_primary INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (tenant_id, domain)
);
