CREATE TABLE IF NOT EXISTS platform_ledger (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS platform_accounts (
  id TEXT PRIMARY KEY NOT NULL,
  ledger_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
