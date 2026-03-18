export type TenantId = string & { readonly __brand: "TenantId" };
export type TenantSlug = string & { readonly __brand: "TenantSlug" };

export interface TenantDomain {
  readonly domain: string;
  readonly isPrimary: boolean;
}

export interface TenantResources {
  readonly tenantId: TenantId;
  readonly tenantSlug: TenantSlug;
  readonly d1DatabaseId: string;
  readonly kvNamespaceId: string;
  readonly r2BucketName: string;
  readonly queueName: string;
  readonly sentryDsn: string | null;
  readonly domains: ReadonlyArray<TenantDomain>;
}

export interface TenantContext {
  readonly tenantId: TenantId;
  readonly tenantSlug: TenantSlug;
  readonly tenantDomain: string;
  readonly resources: TenantResources;
}
