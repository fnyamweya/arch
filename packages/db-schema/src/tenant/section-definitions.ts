import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const sectionDefinitionsTable = sqliteTable("section_definitions", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id"),
  code: text("code").notNull(),
  name: text("name").notNull(),
  allowedPageTypes: text("allowed_page_types").notNull(), // JSON array
  compositionSchema: text("composition_schema").notNull(), // JSON
  status: text("status").notNull(),
});
