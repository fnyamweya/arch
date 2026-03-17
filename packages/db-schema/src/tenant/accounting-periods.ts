import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const accountingPeriodsTable = sqliteTable("accounting_periods", {
  id: text("id").primaryKey(),
  periodKey: text("period_key").notNull().unique(),
  startsAt: integer("starts_at", { mode: "timestamp_ms" }).notNull(),
  endsAt: integer("ends_at", { mode: "timestamp_ms" }).notNull(),
  status: text("status").notNull(),
  closedAt: integer("closed_at", { mode: "timestamp_ms" })
});
