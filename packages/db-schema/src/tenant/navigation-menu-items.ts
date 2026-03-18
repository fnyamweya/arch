import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const navigationMenuItemsTable = sqliteTable("navigation_menu_items", {
  id: text("id").primaryKey(),
  navigationMenuId: text("navigation_menu_id").notNull(),
  parentItemId: text("parent_item_id"),
  label: text("label").notNull(),
  itemType: text("item_type").notNull(),
  href: text("href"),
  pageRef: text("page_ref"),
  externalTarget: text("external_target"),
  sortOrder: integer("sort_order").notNull(),
  visibilityRules: text("visibility_rules"), // JSON, nullable
});
