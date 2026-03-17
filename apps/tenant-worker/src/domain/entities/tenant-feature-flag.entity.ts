export interface TenantFeatureFlagEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly key: string;
  readonly enabled: boolean;
}
