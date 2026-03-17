import type { TenantConfigurationEntity } from "../entities/tenant-configuration.entity";
import type { TenantEntity } from "../entities/tenant.entity";

export interface TenantAggregate {
  readonly tenant: TenantEntity;
  readonly configuration: TenantConfigurationEntity;
}
