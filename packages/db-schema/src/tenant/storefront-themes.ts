import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const storefrontThemesTable = sqliteTable("storefront_themes", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
