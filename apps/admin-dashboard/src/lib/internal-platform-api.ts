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
    readonly clerkPublishableKey?: string | null;
    readonly clerkAuthDomain?: string | null;
    readonly clerkProxyUrl?: string | null;
}

export interface TenantClerkConfig {
    readonly id: string;
    readonly tenantId: string;
    readonly publishableKey: string;
    readonly encryptedSecretKey: string;
    readonly webhookSecret: string;
    readonly authDomain: string | null;
    readonly proxyUrl: string | null;
    readonly jwksUrl: string;
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

export async function getTenantClerkConfig(tenantId: string): Promise<TenantClerkConfig | null> {
    try {
        return await fetchFromWorker<TenantClerkConfig>(authWorkerOrigin(), `/internal/tenants/${tenantId}/clerk-config`);
    } catch {
        return null;
    }
}

export async function saveTenantClerkConfig(input: {
    readonly tenantId: string;
    readonly clerkPublishableKey: string;
    readonly clerkSecretKey?: string;
    readonly clerkWebhookSecret?: string;
    readonly clerkAuthDomain?: string | null;
    readonly clerkProxyUrl?: string | null;
    readonly clerkJwksUrl?: string | null;
}): Promise<void> {
    const origin = authWorkerOrigin();
    if (origin === null) {
        throw new Error("AUTH_WORKER_INTERNAL_URL is not configured.");
    }
    await fetchFromWorker(origin, `/internal/tenants/${input.tenantId}/configure-clerk-keys`, {
        method: "POST",
        body: JSON.stringify({
            clerkPublishableKey: input.clerkPublishableKey,
            clerkSecretKey: input.clerkSecretKey,
            clerkWebhookSecret: input.clerkWebhookSecret,
            clerkAuthDomain: input.clerkAuthDomain,
            clerkProxyUrl: input.clerkProxyUrl,
            clerkJwksUrl: input.clerkJwksUrl
        })
    });
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