import type { TenantId } from "../value-objects/tenant-id.vo";
import type { UserRole } from "../value-objects/user-role.vo";

export interface TenantMembershipEntity {
  readonly id: string;
  readonly tenantId: TenantId;
  readonly userId: string;
  readonly role: UserRole;
}
