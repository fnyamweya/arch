import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const navigationMenusTable = sqliteTable("navigation_menus", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  locale: text("locale").notNull(),
  state: text("state").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
