import type { LedgerAggregate } from "../../domain/aggregates/ledger.aggregate";
import type { LedgerRepository } from "../../domain/repositories/ledger.repository";
import { tenantAccountsTable, tenantLedgerTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export class D1LedgerRepository implements LedgerRepository {
  private readonly db: ReturnType<typeof drizzle>;

  public constructor(database: D1Database) {
    this.db = drizzle(database);
  }

  public async getById(ledgerId: string): Promise<LedgerAggregate | null> {
    const ledgerRows = await this.db.select().from(tenantLedgerTable).where(eq(tenantLedgerTable.id, ledgerId)).limit(1);
    const ledger = ledgerRows[0];
    if (ledger === undefined) {
      return null;
    }
    const accountRows = await this.db
      .select()
      .from(tenantAccountsTable)
      .where(eq(tenantAccountsTable.ledgerId, ledgerId));
    return {
      ledger: {
        id: ledger.id,
        name: ledger.name,
        status: ledger.status
      },
      accounts: accountRows.map((account) => ({
        id: account.id,
        ledgerId: account.ledgerId,
        code: account.code,
        accountType: account.accountType
      }))
    };
  }

  public async save(ledger: LedgerAggregate): Promise<void> {
    const now: Date = new Date();
    await this.db
      .insert(tenantLedgerTable)
      .values({
        id: ledger.ledger.id,
        tenantId: ledger.ledger.id,
        name: ledger.ledger.name,
        status: ledger.ledger.status,
        createdAt: now
      })
      .onConflictDoUpdate({
        target: tenantLedgerTable.id,
        set: {
          name: ledger.ledger.name,
          status: ledger.ledger.status
        }
      });
    for (const account of ledger.accounts) {
      await this.db
        .insert(tenantAccountsTable)
        .values({
          id: account.id,
          ledgerId: account.ledgerId,
          code: account.code,
          name: account.code,
          accountType: account.accountType,
          status: "ACTIVE",
          createdAt: now
        })
        .onConflictDoUpdate({
          target: tenantAccountsTable.id,
          set: {
            code: account.code,
            accountType: account.accountType
          }
        });
    }
  }
}
