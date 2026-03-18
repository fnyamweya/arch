import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const themeVersionsTable = sqliteTable("theme_versions", {
  id: text("id").primaryKey(),
  themeId: text("theme_id").notNull(),
  version: text("version").notNull(),
  state: text("state").notNull(),
  baseThemeRef: text("base_theme_ref"),
  description: text("description").notNull(),
  createdBy: text("created_by").notNull(),
  publishedBy: text("published_by"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
});
