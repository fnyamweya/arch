import type { AuthTokenPayload } from "@arch/auth-contracts";

export interface ResolvedTenantContext {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly tenantDomain: string;
  readonly sentryDsn: string | null;
  readonly clerkPublishableKey: string | null;
}

export interface ResolvedAuthContext {
  readonly subject: string;
  readonly tokenPayload: AuthTokenPayload;
}

export interface GatewayVariables {
  readonly requestId: string;
  readonly tenantContext: ResolvedTenantContext | null;
  readonly authContext: ResolvedAuthContext | null;
}
