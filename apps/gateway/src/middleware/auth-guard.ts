import type { MiddlewareHandler } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { AuthTokenPayload } from "@arch/auth-contracts";
import type { GatewayVariables } from "../types";
import { errorEnvelope, toJson } from "../utils/api-envelope";

interface VerifyTokenResponse {
    readonly success: boolean;
    readonly data?: {
        readonly subject: string;
        readonly payload: AuthTokenPayload;
    };
}

const extractBearerToken = (headerValue: string | undefined): string | null => {
    if (headerValue === undefined || headerValue.length === 0) {
        return null;
    }
    const match: RegExpMatchArray | null = headerValue.match(/^Bearer\s+(.+)$/i);
    if (match === null || match[1] === undefined || match[1].length === 0) {
        return null;
    }
    return match[1];
};

export const authGuard: MiddlewareHandler<{
    Bindings: GatewayBindings;
    Variables: GatewayVariables;
}> = async (c, next): Promise<void> => {
    const token: string | null = extractBearerToken(c.req.header("authorization"));
    if (token === null) {
        c.res = toJson(errorEnvelope("UNAUTHORIZED", "Missing or invalid bearer token"), 401);
        return;
    }

    const tenantContext = c.get("tenantContext");
    const verificationRequest = new Request("https://auth-worker/internal/verify-token", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            token,
            tenantId: tenantContext?.tenantId ?? null,
        }),
    });

    let verificationResponse: Response;
    try {
        verificationResponse = await c.env.AUTH_WORKER.fetch(verificationRequest);
    } catch {
        c.res = toJson(errorEnvelope("SERVICE_UNAVAILABLE", "Auth service is not available"), 503);
        return;
    }

    if (!verificationResponse.ok) {
        c.res = toJson(errorEnvelope("UNAUTHORIZED", "Token verification request failed"), 401);
        return;
    }

    const verificationBody = (await verificationResponse.json()) as VerifyTokenResponse;
    if (!verificationBody.success || verificationBody.data === undefined) {
        c.res = toJson(errorEnvelope("UNAUTHORIZED", "Token verification failed"), 401);
        return;
    }

    if (tenantContext !== null && verificationBody.data.payload.tenantId !== tenantContext.tenantId) {
        c.res = toJson(errorEnvelope("FORBIDDEN", "Token tenant mismatch"), 403);
        return;
    }

    c.set("authContext", {
        subject: verificationBody.data.subject,
        tokenPayload: verificationBody.data.payload,
    });
    await next();
};