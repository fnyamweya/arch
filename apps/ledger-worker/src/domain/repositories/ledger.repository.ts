import type { LedgerAggregate } from "../aggregates/ledger.aggregate";

export interface LedgerRepository {
  getById(ledgerId: string): Promise<LedgerAggregate | null>;
  save(ledger: LedgerAggregate): Promise<void>;
}
