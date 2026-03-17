import type { TenantId, TenantResources } from "./types";

export interface TenantResourceResolverPort {
  resolveByTenantId(tenantId: TenantId): Promise<TenantResources | null>;
}
