import type { TenantId, TenantSlug } from "./types";

export interface TenantResolution {
  readonly tenantId: TenantId;
  readonly tenantSlug: TenantSlug;
  readonly domain: string;
}

export interface TenantResolverPort {
  resolveByDomain(domain: string): Promise<TenantResolution | null>;
}

export const getRequestHost = (request: Request): string => {
  return new URL(request.url).host.toLowerCase();
};
