import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const journalEntriesTable = sqliteTable("journal_entries", {
  id: text("id").primaryKey(),
  ledgerId: text("ledger_id").notNull(),
  entryDate: integer("entry_date", { mode: "timestamp_ms" }).notNull(),
  postedAt: integer("posted_at", { mode: "timestamp_ms" }),
  description: text("description").notNull(),
  referenceType: text("reference_type").notNull(),
  referenceId: text("reference_id").notNull(),
  status: text("status").notNull(),
  reversedByEntryId: text("reversed_by_entry_id"),
  reversesEntryId: text("reverses_entry_id"),
  metadataJson: text("metadata_json").notNull()
});
