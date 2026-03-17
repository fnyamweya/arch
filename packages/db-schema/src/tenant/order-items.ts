import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const orderItemsTable = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(),
  productId: text("product_id").notNull(),
  variantId: text("variant_id"),
  quantity: integer("quantity").notNull(),
  unitPriceAmountCents: integer("unit_price_amount_cents").notNull(),
  lineTotalAmountCents: integer("line_total_amount_cents").notNull(),
  currencyCode: text("currency_code").notNull()
});
