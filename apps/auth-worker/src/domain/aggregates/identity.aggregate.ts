import type { GlobalUserEntity } from "../entities/global-user.entity";
import type { TenantMembershipEntity } from "../entities/tenant-membership.entity";

export interface IdentityAggregate {
  readonly user: GlobalUserEntity;
  readonly memberships: ReadonlyArray<TenantMembershipEntity>;
}
