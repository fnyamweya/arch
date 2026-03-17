import type { Permission } from "./permissions";
import type { PlatformRole, TenantRole } from "./roles";

export interface AuthTokenPayload {
  readonly sub: string;
  readonly sid: string;
  readonly exp: number;
  readonly iat: number;
  readonly orgId: string | null;
  readonly tenantId: string | null;
  readonly platformRole: PlatformRole | null;
  readonly tenantRole: TenantRole | null;
  readonly permissions: ReadonlyArray<Permission>;
}
