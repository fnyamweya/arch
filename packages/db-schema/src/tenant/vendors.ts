import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const vendorsTable = sqliteTable("vendors", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  businessName: text("business_name").notNull(),
  status: text("status").notNull(),
  commissionRateBasisPoints: integer("commission_rate_basis_points").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
});
