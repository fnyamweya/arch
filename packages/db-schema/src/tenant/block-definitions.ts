import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const blockDefinitionsTable = sqliteTable("block_definitions", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  category: text("category").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
