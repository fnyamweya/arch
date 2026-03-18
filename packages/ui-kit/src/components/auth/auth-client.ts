"use client";

import * as React from "react";

interface AuthTokenPayloadClient {
    readonly sub: string;
    readonly sid: string;
    readonly exp: number;
    readonly iat: number;
    readonly orgId: string | null;
    readonly tenantId: string | null;
    readonly platformRole: "PLATFORM_ADMIN" | null;
    readonly tenantRole: "TENANT_ADMIN" | "VENDOR_OWNER" | "VENDOR_STAFF" | "CUSTOMER" | null;
    readonly permissions: ReadonlyArray<string>;
}

interface AuthMembershipClient {
    readonly id: string;
    readonly tenantId: string;
    readonly userId: string;
    readonly role: "PLATFORM_ADMIN" | "TENANT_ADMIN" | "VENDOR_OWNER" | "VENDOR_STAFF" | "CUSTOMER";
}

interface AuthUserClient {
    readonly id: string;
    readonly email: string | null;
    readonly name: string | null;
    readonly image: string | null;
}

interface ClientSessionResponse {
    readonly authenticated: boolean;
    readonly session: {
        readonly sessionId: string;
        readonly userId: string;
        readonly expiresAt: number;
        readonly issuedAt: number;
    } | null;
    readonly user: AuthUserClient | null;
    readonly memberships: ReadonlyArray<AuthMembershipClient>;
    readonly authorization: AuthTokenPayloadClient | null;
}

interface AuthProvidersResponse {
    readonly credentialStrategies: ReadonlyArray<"email" | "username" | "phone">;
    readonly socialProviders: ReadonlyArray<"google" | "facebook">;
    readonly sessionTransports: ReadonlyArray<"cookie" | "bearer">;
    readonly organizationEnabled: boolean;
    readonly adminEnabled: boolean;
}

interface QueryState<TData> {
    readonly data: TData | null;
    readonly isLoading: boolean;
    readonly error: Error | null;
    readonly refresh: () => Promise<void>;
}

const readJson = async <TData>(input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, {
        ...init,
        credentials: "include",
        headers: {
            "content-type": "application/json",
            ...(init?.headers ?? {}),
        },
    });
    const payload = (await response.json()) as
        | { success: true; data: TData }
        | { success: false; error: { message: string } };

    if (!response.ok || payload.success === false) {
        throw new Error(payload.success === false ? payload.error.message : `Request failed with ${response.status}`);
    }

    return payload.data;
};

const useQuery = <TData,>(path: string): QueryState<TData> => {
    const [data, setData] = React.useState<TData | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const refresh = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const nextData = await readJson<TData>(path, { cache: "no-store" });
            setData(nextData);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError : new Error("Request failed"));
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, [path]);

    React.useEffect(() => {
        void refresh();
    }, [refresh]);

    return { data, isLoading, error, refresh };
};

export const authClient = {
    useSession(): QueryState<ClientSessionResponse> {
        return useQuery<ClientSessionResponse>("/api/client-auth/session");
    },
    useProviders(): QueryState<AuthProvidersResponse> {
        return useQuery<AuthProvidersResponse>("/api/client-auth/providers");
    },
    async signOut() {
        await fetch("/api/auth/sign-out", {
            method: "POST",
            credentials: "include",
        });
    },
};