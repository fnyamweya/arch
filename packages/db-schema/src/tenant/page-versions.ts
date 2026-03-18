import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const pageVersionsTable = sqliteTable("page_versions", {
  id: text("id").primaryKey(),
  pageDefinitionId: text("page_definition_id").notNull(),
  layoutVersionId: text("layout_version_id").notNull(),
  version: text("version").notNull(),
  state: text("state").notNull(),
  locale: text("locale").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  contentSchemaVersion: text("content_schema_version").notNull(),
  createdBy: text("created_by").notNull(),
  publishedBy: text("published_by"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
});
