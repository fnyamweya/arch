import type { IdentityAggregate } from "../aggregates/identity.aggregate";

export interface IdentityRepository {
  getByUserId(userId: string): Promise<IdentityAggregate | null>;
  save(identity: IdentityAggregate): Promise<void>;
}
