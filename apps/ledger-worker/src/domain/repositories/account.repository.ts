import type { AccountEntity } from "../entities/account.entity";

export interface AccountRepository {
  getById(accountId: string): Promise<AccountEntity | null>;
  save(account: AccountEntity): Promise<void>;
}
