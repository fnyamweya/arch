import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const layoutVersionsTable = sqliteTable("layout_versions", {
  id: text("id").primaryKey(),
  layoutTemplateId: text("layout_template_id").notNull(),
  version: text("version").notNull(),
  state: text("state").notNull(),
  schema: text("schema").notNull(), // JSON
  createdBy: text("created_by").notNull(),
  publishedBy: text("published_by"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
});
