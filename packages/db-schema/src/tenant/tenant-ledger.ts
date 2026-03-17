import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tenantLedgerTable = sqliteTable("tenant_ledger", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().unique(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull()
});
