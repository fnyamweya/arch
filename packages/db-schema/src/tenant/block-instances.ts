import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const blockInstancesTable = sqliteTable("block_instances", {
  id: text("id").primaryKey(),
  pageVersionId: text("page_version_id").notNull(),
  slotKey: text("slot_key").notNull(),
  blockVersionId: text("block_version_id").notNull(),
  instanceKey: text("instance_key").notNull(),
  sortOrder: integer("sort_order").notNull(),
  config: text("config").notNull(), // JSON
  contentRef: text("content_ref"),
  visibilityRules: text("visibility_rules"), // JSON, nullable
  experimentRef: text("experiment_ref"),
  personalizationRules: text("personalization_rules"), // JSON, nullable
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
