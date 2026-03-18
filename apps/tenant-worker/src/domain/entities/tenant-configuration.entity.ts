export interface TenantConfigurationEntity {
  readonly tenantId: string;
  readonly primaryDomain: string;
  readonly sentryDsn: string | null;
  readonly clerkPublishableKey: string;
  readonly clerkAuthDomain: string | null;
  readonly clerkProxyUrl: string | null;
  readonly clerkJwksUrl: string | null;
}
