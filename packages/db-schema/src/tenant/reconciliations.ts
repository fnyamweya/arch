import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reconciliationsTable = sqliteTable("reconciliations", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  periodKey: text("period_key").notNull(),
  status: text("status").notNull(),
  reconciledBy: text("reconciled_by").notNull(),
  reconciledAt: integer("reconciled_at", { mode: "timestamp_ms" }).notNull()
});
