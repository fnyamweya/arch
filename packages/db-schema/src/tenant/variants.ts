import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const variantsTable = sqliteTable("variants", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull(),
  sku: text("sku").notNull().unique(),
  title: text("title").notNull(),
  priceAmountCents: integer("price_amount_cents").notNull(),
  currencyCode: text("currency_code").notNull(),
  inventoryQuantity: integer("inventory_quantity").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
});
