import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const redirectRulesTable = sqliteTable("redirect_rules", {
  id: text("id").primaryKey(),
  storefrontId: text("storefront_id").notNull(),
  sourcePath: text("source_path").notNull(),
  destinationPath: text("destination_path").notNull(),
  httpStatus: text("http_status").notNull(),
  active: integer("active", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
