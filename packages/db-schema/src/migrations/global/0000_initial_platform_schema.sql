CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL,
  plan_tier TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS global_users (
  id TEXT PRIMARY KEY NOT NULL,
  clerk_user_id TEXT NOT NULL UNIQUE,
  primary_email TEXT,
  first_name TEXT,
  last_name TEXT,
  image_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
