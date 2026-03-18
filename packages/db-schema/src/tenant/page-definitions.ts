import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const pageDefinitionsTable = sqliteTable("page_definitions", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  code: text("code").notNull(),
  pageType: text("page_type").notNull(),
  name: text("name").notNull(),
  seoProfileId: text("seo_profile_id"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
