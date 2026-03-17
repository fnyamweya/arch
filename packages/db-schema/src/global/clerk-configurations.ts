import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const clerkConfigurationsTable = sqliteTable("clerk_configurations", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().unique(),
  clerkPublishableKey: text("clerk_publishable_key").notNull(),
  clerkSecretKeyEncrypted: text("clerk_secret_key_encrypted").notNull(),
  clerkWebhookSecret: text("clerk_webhook_secret").notNull(),
  clerkJwksUrl: text("clerk_jwks_url").notNull(),
  configuredAt: integer("configured_at", { mode: "timestamp_ms" }).notNull(),
  configuredBy: text("configured_by").notNull()
});
