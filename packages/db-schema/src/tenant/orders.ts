import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ordersTable = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: text("customer_id").notNull(),
  status: text("status").notNull(),
  totalAmountCents: integer("total_amount_cents").notNull(),
  currencyCode: text("currency_code").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
});
