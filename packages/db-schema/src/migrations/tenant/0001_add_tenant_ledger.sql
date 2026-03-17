CREATE TABLE IF NOT EXISTS tenant_ledger (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tenant_accounts (
  id TEXT PRIMARY KEY NOT NULL,
  ledger_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY NOT NULL,
  ledger_id TEXT NOT NULL,
  entry_date INTEGER NOT NULL,
  posted_at INTEGER,
  description TEXT NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  status TEXT NOT NULL,
  reversed_by_entry_id TEXT,
  reverses_entry_id TEXT,
  metadata_json TEXT NOT NULL
);
