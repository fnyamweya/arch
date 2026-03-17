import type { AccountEntity } from "../../domain/entities/account.entity";
import type { AccountRepository } from "../../domain/repositories/account.repository";
import { tenantAccountsTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export class D1AccountRepository implements AccountRepository {
  private readonly db: ReturnType<typeof drizzle>;

  public constructor(database: D1Database) {
    this.db = drizzle(database);
  }

  public async getById(accountId: string): Promise<AccountEntity | null> {
    const rows = await this.db.select().from(tenantAccountsTable).where(eq(tenantAccountsTable.id, accountId)).limit(1);
    const row = rows[0];
    if (row === undefined) {
      return null;
    }
    return {
      id: row.id,
      ledgerId: row.ledgerId,
      code: row.code,
      accountType: row.accountType
    };
  }

  public async save(account: AccountEntity): Promise<void> {
    await this.db
      .insert(tenantAccountsTable)
      .values({
        id: account.id,
        ledgerId: account.ledgerId,
        code: account.code,
        name: account.code,
        accountType: account.accountType,
        status: "ACTIVE",
        createdAt: new Date()
      })
      .onConflictDoUpdate({
        target: tenantAccountsTable.id,
        set: {
          ledgerId: account.ledgerId,
          code: account.code,
          accountType: account.accountType
        }
      });
  }
}
