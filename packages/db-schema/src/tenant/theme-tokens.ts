import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const themeTokensTable = sqliteTable("theme_tokens", {
  id: text("id").primaryKey(),
  tokenSetId: text("token_set_id").notNull(),
  group: text("group").notNull(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  type: text("type").notNull(),
  reference: text("reference"),
  metadata: text("metadata").notNull(), // JSON
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
