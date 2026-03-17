export interface TenantConfigurationEntity {
  readonly tenantId: string;
  readonly primaryDomain: string;
  readonly sentryDsn: string | null;
  readonly clerkPublishableKey: string;
}
