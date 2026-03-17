import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const journalLinesTable = sqliteTable("journal_lines", {
  id: text("id").primaryKey(),
  journalEntryId: text("journal_entry_id").notNull(),
  accountId: text("account_id").notNull(),
  debitAmountCents: integer("debit_amount_cents").notNull(),
  creditAmountCents: integer("credit_amount_cents").notNull(),
  currencyCode: text("currency_code").notNull(),
  description: text("description").notNull()
});
