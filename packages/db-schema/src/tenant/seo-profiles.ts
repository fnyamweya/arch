import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const seoProfilesTable = sqliteTable("seo_profiles", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  code: text("code").notNull(),
  titleTemplate: text("title_template").notNull(),
  descriptionTemplate: text("description_template").notNull(),
  robots: text("robots").notNull(),
  canonicalStrategy: text("canonical_strategy").notNull(),
  structuredDataConfig: text("structured_data_config").notNull(), // JSON
  socialMeta: text("social_meta").notNull(), // JSON
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
