import type { ClerkConfigurationEntity } from "../entities/clerk-configuration.entity";

export interface ClerkConfigRepository {
  getByTenantId(tenantId: string): Promise<ClerkConfigurationEntity | null>;
  save(configuration: ClerkConfigurationEntity): Promise<void>;
}
