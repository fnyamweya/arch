import type { TenantAggregate } from "../aggregates/tenant.aggregate";
import type { TenantDomainEntity } from "../entities/tenant-domain.entity";

export interface TenantRepository {
  getById(tenantId: string): Promise<TenantAggregate | null>;
  listDomains(tenantId: string): Promise<ReadonlyArray<TenantDomainEntity>>;
  upsertDomain(tenantId: string, domain: string, isPrimary: boolean): Promise<void>;
  setPrimaryDomain(tenantId: string, domain: string): Promise<void>;
  removeDomain(tenantId: string, domain: string): Promise<void>;
  save(tenant: TenantAggregate): Promise<void>;
}
