import "server-only";

import { headers } from "next/headers";

interface SuccessEnvelope<TData> {
    readonly success: true;
    readonly data: TData;
}

interface ErrorEnvelope {
    readonly success: false;
    readonly error: {
        readonly code: string;
        readonly message: string;
    };
}

type ApiEnvelope<TData> = SuccessEnvelope<TData> | ErrorEnvelope;

export interface ResolvedTenantConfig {
    readonly tenantId: string;
    readonly tenantSlug: string;
    readonly tenantDomain: string;
    readonly sentryDsn?: string | null;
}

export interface TenantAuthConfiguration {
    readonly scope: "platform";
    readonly tenantId: string;
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

export interface TenantDomainRecord {
    readonly id: string;
    readonly tenantId: string;
    readonly domain: string;
    readonly isPrimary: boolean;
}

export interface TenantDomainsResponse {
    readonly tenantId: string;
    readonly tenantSlug: string;
    readonly primaryDomain: string;
    readonly domains: ReadonlyArray<TenantDomainRecord>;
}

export type TenantOnboardingUserRole = "PLATFORM_ADMIN" | "TENANT_ADMIN" | "VENDOR_OWNER" | "CUSTOMER";

export interface TenantOnboardingUserInput {
    readonly role: TenantOnboardingUserRole;
    readonly email: string;
    readonly name: string;
    readonly password?: string;
}

export interface SeededTenantUser {
    readonly role: TenantOnboardingUserRole;
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
        readonly vendorId: string;
        readonly storefrontId: string;
        readonly domains: ReadonlyArray<string>;
        readonly infrastructure: {
            readonly d1DatabaseId: string;
            readonly kvNamespaceId: string;
            readonly r2BucketName: string;
            readonly queueName: string;
        };
    };
}

const normalizeOrigin = (value: string | undefined): string | null => {
    if (value === undefined) {
        return null;
    }
    const normalizedValue = value.trim();
    if (normalizedValue.length === 0) {
        return null;
    }
    return normalizedValue.endsWith("/") ? normalizedValue.slice(0, -1) : normalizedValue;
};

const normalizeHost = (value: string | null): string | null => {
    if (value === null) {
        return null;
    }
    const normalizedValue = value.trim().toLowerCase();
    if (normalizedValue.length === 0) {
        return null;
    }
    if (normalizedValue.startsWith("[")) {
        return normalizedValue;
    }
    const [host] = normalizedValue.split(":");
    return host ?? normalizedValue;
};

const readJson = async <TData>(response: Response): Promise<ApiEnvelope<TData>> => {
    return (await response.json()) as ApiEnvelope<TData>;
};

const fetchFromWorker = async <TData>(
    origin: string | null,
    path: string,
    init?: RequestInit
): Promise<TData | null> => {
    if (origin === null) {
        return null;
    }
    const response = await fetch(`${origin}${path}`, {
        ...init,
        headers: {
            "content-type": "application/json",
            ...(init?.headers ?? {})
        },
        cache: "no-store"
    });
    const payload = await readJson<TData>(response);
    if (!response.ok || payload.success === false) {
        throw new Error(payload.success === false ? payload.error.message : `Request failed with ${response.status}`);
    }
    return payload.data;
};

const authWorkerOrigin = (): string | null => normalizeOrigin(process.env.AUTH_WORKER_INTERNAL_URL);

const tenantWorkerOrigin = (): string | null => normalizeOrigin(process.env.TENANT_WORKER_INTERNAL_URL);

export async function resolveTenantForCurrentHost(): Promise<ResolvedTenantConfig | null> {
    const requestHeaders = await headers();
    const host = normalizeHost(requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"));
    if (host === null) {
        return null;
    }
    try {
        return await fetchFromWorker<ResolvedTenantConfig>(tenantWorkerOrigin(), "/internal/resolve-tenant", {
            method: "POST",
            body: JSON.stringify({ domain: host })
        });
    } catch {
        return null;
    }
}

export async function getTenantAuthConfiguration(tenantId: string): Promise<TenantAuthConfiguration | null> {
    try {
        return await fetchFromWorker<TenantAuthConfiguration>(authWorkerOrigin(), `/internal/tenants/${tenantId}/auth-configuration`);
    } catch {
        return null;
    }
}

export async function getTenantDomains(tenantId: string): Promise<TenantDomainsResponse | null> {
    try {
        return await fetchFromWorker<TenantDomainsResponse>(tenantWorkerOrigin(), `/internal/tenants/${tenantId}/domains`);
    } catch {
        return null;
    }
}

export async function createTenantDomain(input: {
    readonly tenantId: string;
    readonly domain: string;
    readonly isPrimary: boolean;
}): Promise<void> {
    const origin = tenantWorkerOrigin();
    if (origin === null) {
        throw new Error("TENANT_WORKER_INTERNAL_URL is not configured.");
    }
    await fetchFromWorker(origin, `/internal/tenants/${input.tenantId}/domains`, {
        method: "POST",
        body: JSON.stringify({ domain: input.domain, isPrimary: input.isPrimary })
    });
}

export async function makeTenantDomainPrimary(input: {
    readonly tenantId: string;
    readonly domain: string;
}): Promise<void> {
    const origin = tenantWorkerOrigin();
    if (origin === null) {
        throw new Error("TENANT_WORKER_INTERNAL_URL is not configured.");
    }
    await fetchFromWorker(origin, `/internal/tenants/${input.tenantId}/domains/set-primary`, {
        method: "POST",
        body: JSON.stringify({ domain: input.domain })
    });
}

export async function deleteTenantDomain(input: {
    readonly tenantId: string;
    readonly domain: string;
}): Promise<void> {
    const origin = tenantWorkerOrigin();
    if (origin === null) {
        throw new Error("TENANT_WORKER_INTERNAL_URL is not configured.");
    }
    await fetchFromWorker(origin, `/internal/tenants/${input.tenantId}/domains/remove`, {
        method: "POST",
        body: JSON.stringify({ domain: input.domain })
    });
}

export async function createTenantOnboarding(input: {
    readonly tenantSlug: string;
    readonly displayName: string;
    readonly primaryDomain: string;
    readonly users: ReadonlyArray<TenantOnboardingUserInput>;
}): Promise<TenantOnboardingResponse> {
    const origin = tenantWorkerOrigin();
    if (origin === null) {
        throw new Error("TENANT_WORKER_INTERNAL_URL is not configured.");
    }

    const result = await fetchFromWorker<TenantOnboardingResponse>(origin, "/tenants", {
        method: "POST",
        body: JSON.stringify(input)
    });

    if (result === null) {
        throw new Error("Tenant worker did not return onboarding data.");
    }

    return result;
}