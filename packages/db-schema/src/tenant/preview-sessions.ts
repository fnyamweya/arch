import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const previewSessionsTable = sqliteTable("preview_sessions", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  actorId: text("actor_id").notNull(),
  scopeType: text("scope_type").notNull(),
  scopeId: text("scope_id").notNull(),
  tokenHash: text("token_hash").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  revokedAt: integer("revoked_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
