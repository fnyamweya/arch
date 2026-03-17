import type { TenantAggregate } from "../aggregates/tenant.aggregate";

export interface TenantRepository {
  getById(tenantId: string): Promise<TenantAggregate | null>;
  save(tenant: TenantAggregate): Promise<void>;
}
