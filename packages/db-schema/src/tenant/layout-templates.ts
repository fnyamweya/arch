import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const layoutTemplatesTable = sqliteTable("layout_templates", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  pageType: text("page_type").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
