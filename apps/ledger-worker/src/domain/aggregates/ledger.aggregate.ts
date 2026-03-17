import type { AccountEntity } from "../entities/account.entity";
import type { LedgerEntity } from "../entities/ledger.entity";

export interface LedgerAggregate {
  readonly ledger: LedgerEntity;
  readonly accounts: ReadonlyArray<AccountEntity>;
}
