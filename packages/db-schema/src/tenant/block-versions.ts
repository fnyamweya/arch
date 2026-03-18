import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const blockVersionsTable = sqliteTable("block_versions", {
  id: text("id").primaryKey(),
  blockDefinitionId: text("block_definition_id").notNull(),
  version: text("version").notNull(),
  state: text("state").notNull(),
  configSchema: text("config_schema").notNull(), // JSON
  contentSchema: text("content_schema").notNull(), // JSON
  defaultConfig: text("default_config").notNull(), // JSON
  defaultContent: text("default_content").notNull(), // JSON
  allowedPageTypes: text("allowed_page_types").notNull(), // JSON array
  allowedSlots: text("allowed_slots").notNull(), // JSON array
  dataRequirements: text("data_requirements").notNull(), // JSON
  cacheMaxAge: integer("cache_max_age").notNull(),
  cacheStaleWhileRevalidate: integer("cache_stale_while_revalidate").notNull(),
  cacheTags: text("cache_tags").notNull(), // JSON array
  seoPolicy: text("seo_policy").notNull(), // JSON
  hydrationStrategy: text("hydration_strategy").notNull(),
  deprecationStatus: text("deprecation_status").notNull(),
  migrationStrategy: text("migration_strategy"), // JSON, nullable
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
});
