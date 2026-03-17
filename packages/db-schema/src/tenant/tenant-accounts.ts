import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tenantAccountsTable = sqliteTable("tenant_accounts", {
  id: text("id").primaryKey(),
  ledgerId: text("ledger_id").notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  accountType: text("account_type").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull()
});
