import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const productsTable = sqliteTable("products", {
  id: text("id").primaryKey(),
  vendorId: text("vendor_id").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
});
