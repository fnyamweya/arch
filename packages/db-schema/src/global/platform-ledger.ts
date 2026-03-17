import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const platformLedgerTable = sqliteTable("platform_ledger", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull()
});
