export interface TenantDomainEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly domain: string;
  readonly isPrimary: boolean;
}
