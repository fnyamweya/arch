export interface TenantConfigsSchemaRecord {
  readonly tenantId: string;
  readonly sentryDsn: string | null;
  readonly clerkPublishableKey: string;
}
