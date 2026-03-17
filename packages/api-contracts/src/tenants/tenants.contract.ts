export interface TenantResolutionRequest {
  readonly domain: string;
}

export interface TenantResolutionResponse {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly tenantDomain: string;
  readonly sentryDsn: string | null;
  readonly clerkPublishableKey: string | null;
}
