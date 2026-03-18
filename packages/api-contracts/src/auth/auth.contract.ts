export interface AuthTokenPayloadContract {
  readonly sub: string;
  readonly sid: string;
  readonly exp: number;
  readonly iat: number;
  readonly orgId: string | null;
  readonly tenantId: string | null;
  readonly platformRole: "PLATFORM_ADMIN" | null;
  readonly tenantRole: "TENANT_ADMIN" | "VENDOR_OWNER" | "VENDOR_STAFF" | "CUSTOMER" | null;
  readonly permissions: ReadonlyArray<
    | "manage:tenants"
    | "manage:tenant-config"
    | "manage:vendors"
    | "manage:products"
    | "manage:orders"
    | "view:ledger"
    | "manage:ledger"
  >;
}

export interface VerifyTokenRequest {
  readonly token: string;
  readonly tenantId: string | null;
}

export interface VerifyTokenResponse {
  readonly subject: string;
  readonly payload: AuthTokenPayloadContract;
}

export interface AuthUserContract {
  readonly id: string;
  readonly email: string | null;
  readonly name: string | null;
  readonly image: string | null;
}

export interface AuthMembershipContract {
  readonly id: string;
  readonly tenantId: string;
  readonly userId: string;
  readonly role: "PLATFORM_ADMIN" | "TENANT_ADMIN" | "VENDOR_OWNER" | "VENDOR_STAFF" | "CUSTOMER";
}

export interface AuthSessionContract {
  readonly sessionId: string;
  readonly userId: string;
  readonly expiresAt: number;
  readonly issuedAt: number;
}

export interface ClientSessionResponse {
  readonly authenticated: boolean;
  readonly session: AuthSessionContract | null;
  readonly user: AuthUserContract | null;
  readonly memberships: ReadonlyArray<AuthMembershipContract>;
  readonly authorization: AuthTokenPayloadContract | null;
}

export interface ClientProfileResponse {
  readonly user: AuthUserContract;
  readonly memberships: ReadonlyArray<AuthMembershipContract>;
  readonly authorization: AuthTokenPayloadContract;
}

export interface AuthProvidersResponse {
  readonly credentialStrategies: ReadonlyArray<"email" | "username" | "phone">;
  readonly socialProviders: ReadonlyArray<"google" | "facebook">;
  readonly sessionTransports: ReadonlyArray<"cookie" | "bearer">;
  readonly organizationEnabled: boolean;
  readonly adminEnabled: boolean;
}

export interface AuthPlatformConfigurationResponse {
  readonly scope: "platform";
  readonly tenantId: string | null;
  readonly appName: string;
  readonly tenantScopedConfiguration: boolean;
  readonly trustedOrigins: ReadonlyArray<string>;
  readonly cookieDomain: string | null;
  readonly credentialStrategies: ReadonlyArray<"email" | "username" | "phone">;
  readonly socialProviders: ReadonlyArray<"google" | "facebook">;
  readonly organizationEnabled: boolean;
  readonly adminEnabled: boolean;
  readonly phoneOtpWebhookConfigured: boolean;
}
