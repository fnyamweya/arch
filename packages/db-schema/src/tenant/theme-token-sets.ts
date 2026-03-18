import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const themeTokenSetsTable = sqliteTable("theme_token_sets", {
  id: text("id").primaryKey(),
  themeVersionId: text("theme_version_id").notNull(),
  mode: text("mode").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
