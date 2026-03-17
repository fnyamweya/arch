import type { JournalEntryAggregate } from "../../domain/aggregates/journal-entry.aggregate";
import type { JournalEntryRepository } from "../../domain/repositories/journal-entry.repository";
import { journalEntriesTable, journalLinesTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export class D1JournalEntryRepository implements JournalEntryRepository {
  private readonly db: ReturnType<typeof drizzle>;

  public constructor(database: D1Database) {
    this.db = drizzle(database);
  }

  public async getById(journalEntryId: string): Promise<JournalEntryAggregate | null> {
    const entryRows = await this.db
      .select()
      .from(journalEntriesTable)
      .where(eq(journalEntriesTable.id, journalEntryId))
      .limit(1);
    const entry = entryRows[0];
    if (entry === undefined) {
      return null;
    }
    const lineRows = await this.db
      .select()
      .from(journalLinesTable)
      .where(eq(journalLinesTable.journalEntryId, journalEntryId));
    return {
      entry: {
        id: entry.id,
        ledgerId: entry.ledgerId,
        referenceType: entry.referenceType,
        referenceId: entry.referenceId,
        status: entry.status
      },
      lines: lineRows.map((line) => ({
        id: line.id,
        journalEntryId: line.journalEntryId,
        accountId: line.accountId,
        debitAmountCents: line.debitAmountCents,
        creditAmountCents: line.creditAmountCents
      }))
    };
  }

  public async save(journalEntry: JournalEntryAggregate): Promise<void> {
    const now: Date = new Date();
    await this.db
      .insert(journalEntriesTable)
      .values({
        id: journalEntry.entry.id,
        ledgerId: journalEntry.entry.ledgerId,
        entryDate: now,
        postedAt: now,
        description: `ref:${journalEntry.entry.referenceType}`,
        referenceType: journalEntry.entry.referenceType,
        referenceId: journalEntry.entry.referenceId,
        status: journalEntry.entry.status,
        reversedByEntryId: null,
        reversesEntryId: null,
        metadataJson: "{}"
      })
      .onConflictDoUpdate({
        target: journalEntriesTable.id,
        set: {
          status: journalEntry.entry.status,
          postedAt: now
        }
      });
    for (const line of journalEntry.lines) {
      await this.db
        .insert(journalLinesTable)
        .values({
          id: line.id,
          journalEntryId: line.journalEntryId,
          accountId: line.accountId,
          debitAmountCents: line.debitAmountCents,
          creditAmountCents: line.creditAmountCents,
          currencyCode: "USD",
          description: "journal line"
        })
        .onConflictDoUpdate({
          target: journalLinesTable.id,
          set: {
            debitAmountCents: line.debitAmountCents,
            creditAmountCents: line.creditAmountCents
          }
        });
    }
  }
}
