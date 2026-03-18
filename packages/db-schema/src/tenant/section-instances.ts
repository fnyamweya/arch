import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const sectionInstancesTable = sqliteTable("section_instances", {
  id: text("id").primaryKey(),
  pageVersionId: text("page_version_id").notNull(),
  sectionDefinitionId: text("section_definition_id").notNull(),
  slotKey: text("slot_key").notNull(),
  sortOrder: integer("sort_order").notNull(),
  sectionConfig: text("section_config").notNull(), // JSON
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
