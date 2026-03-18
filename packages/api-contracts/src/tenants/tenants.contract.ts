export interface TenantResolutionRequest {
  readonly domain: string;
}

export type OnboardingUserRole = "PLATFORM_ADMIN" | "TENANT_ADMIN" | "VENDOR_OWNER" | "CUSTOMER";

export interface TenantOnboardingUserInput {
  readonly role: OnboardingUserRole;
  readonly email: string;
  readonly name: string;
  readonly password?: string;
}

export interface TenantOnboardingRequest {
  readonly tenantId?: string;
  readonly tenantSlug: string;
  readonly displayName: string;
  readonly primaryDomain: string;
  readonly users: ReadonlyArray<TenantOnboardingUserInput>;
}

export interface SeededTenantUser {
  readonly role: OnboardingUserRole;
  readonly userId: string;
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly temporaryPassword: boolean;
}

export interface TenantOnboardingResponse {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly tenantDomain: string;
  readonly displayName: string;
  readonly status: "ACTIVE";
  readonly sentryDsn: string | null;
  readonly infrastructureReady: boolean;
  readonly seededUsers: ReadonlyArray<SeededTenantUser>;
  readonly seededResources: {
    readonly storefrontId: string;
    readonly vendorId: string;
    readonly domains: ReadonlyArray<string>;
    readonly infrastructure: {
      readonly d1DatabaseId: string;
      readonly kvNamespaceId: string;
      readonly r2BucketName: string;
      readonly queueName: string;
    };
  };
}

export interface TenantResolutionResponse {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly tenantDomain: string;
  readonly sentryDsn: string | null;
}
