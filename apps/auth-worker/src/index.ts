import { Hono } from "hono";
import type { AuthBindings } from "@arch/cloudflare-bindings";
import type { AuthTokenPayload } from "@arch/auth-contracts";
import { configureTenantClerkKeys } from "./application/commands/configure-tenant-clerk-keys";
import { verifyClerkJwt } from "./infrastructure/clerk/clerk-jwt-verifier";
import { D1ClerkConfigRepository } from "./infrastructure/persistence/d1-clerk-config.repository";
import { D1IdentityRepository } from "./infrastructure/persistence/d1-identity.repository";
import { parseClerkWebhook } from "./infrastructure/clerk/clerk-webhook-handler";

const app = new Hono<{ Bindings: AuthBindings }>();

app.get("/health", (c) => c.json({ success: true, data: { service: "auth-worker", status: "ok" } }));

const decodeBase64Url = (input: string): string => {
  const normalized: string = input.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength: number = (4 - (normalized.length % 4)) % 4;
  const padded: string = normalized + "=".repeat(paddingLength);
  const bytes: Uint8Array = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const decodeTokenPayload = (token: string): AuthTokenPayload | null => {
  const segments: string[] = token.split(".");
  if (segments.length !== 3 || segments[1] === undefined) {
    return null;
  }
  try {
    const payloadJson: string = decodeBase64Url(segments[1]);
    const payload = JSON.parse(payloadJson) as Partial<AuthTokenPayload>;
    if (
      typeof payload.sub !== "string" ||
      typeof payload.sid !== "string" ||
      typeof payload.exp !== "number" ||
      typeof payload.iat !== "number"
    ) {
      return null;
    }
    const normalizedPayload: AuthTokenPayload = {
      sub: payload.sub,
      sid: payload.sid,
      exp: payload.exp,
      iat: payload.iat,
      orgId: payload.orgId ?? null,
      tenantId: payload.tenantId ?? null,
      platformRole: payload.platformRole ?? null,
      tenantRole: payload.tenantRole ?? null,
      permissions: Array.isArray(payload.permissions) ? payload.permissions : []
    };
    return normalizedPayload;
  } catch {
    return null;
  }
};

const normalizeOptionalUrl = (value: string | null | undefined): string | null => {
  if (value === undefined || value === null) {
    return null;
  }
  const normalizedValue = value.trim();
  if (normalizedValue.length === 0) {
    return null;
  }
  return normalizedValue.endsWith("/") ? normalizedValue.slice(0, -1) : normalizedValue;
};

const resolveJwksUrl = (authDomain: string | null, explicitJwksUrl: string | null): string | null => {
  const normalizedJwksUrl = normalizeOptionalUrl(explicitJwksUrl);
  if (normalizedJwksUrl !== null) {
    return normalizedJwksUrl;
  }
  const normalizedAuthDomain = normalizeOptionalUrl(authDomain);
  if (normalizedAuthDomain === null) {
    return null;
  }
  return `${normalizedAuthDomain}/.well-known/jwks.json`;
};

app.post("/internal/verify-token", async (c) => {
  const body = (await c.req.json()) as {
    readonly token?: string;
    readonly tenantId?: string | null;
  };
  if (body.token === undefined || body.token.length === 0) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Missing token"
        }
      },
      400
    );
  }
  const payload: AuthTokenPayload | null = decodeTokenPayload(body.token);
  if (payload === null && body.tenantId === null) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Token payload could not be decoded"
        }
      },
      401
    );
  }
  let verifiedPayload: AuthTokenPayload | null = payload;
  if (body.tenantId !== undefined && body.tenantId !== null) {
    const configRepository = new D1ClerkConfigRepository(c.env.PLATFORM_DB);
    const config = await configRepository.getByTenantId(body.tenantId);
    if (config === null) {
      return c.json(
        {
          success: false,
          error: {
            code: "TENANT_CONFIG_NOT_FOUND",
            message: "Tenant Clerk configuration is missing"
          }
        },
        404
      );
    }
    const verified = await verifyClerkJwt(body.token, config.jwksUrl);
    if (!verified.isValid || verified.subject === null || verified.payload === null) {
      return c.json(
        {
          success: false,
          error: {
            code: "INVALID_TOKEN",
            message: verified.reason ?? "Token could not be verified"
          }
        },
        401
      );
    }
    verifiedPayload = {
      sub: verified.subject,
      sid: (verified.payload.sid as string | undefined) ?? "sid",
      exp: (verified.payload.exp as number | undefined) ?? Math.floor(Date.now() / 1000) + 300,
      iat: (verified.payload.iat as number | undefined) ?? Math.floor(Date.now() / 1000),
      orgId: (verified.payload.org_id as string | undefined) ?? null,
      tenantId: body.tenantId,
      platformRole: null,
      tenantRole: null,
      permissions: []
    };
  }
  if (verifiedPayload === null) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Token payload could not be normalized"
        }
      },
      401
    );
  }
  const nowEpochSeconds: number = Math.floor(Date.now() / 1000);
  if (verifiedPayload.exp <= nowEpochSeconds) {
    return c.json(
      {
        success: false,
        error: {
          code: "TOKEN_EXPIRED",
          message: "Token has expired"
        }
      },
      401
    );
  }
  if (
    body.tenantId !== undefined &&
    body.tenantId !== null &&
    verifiedPayload.tenantId !== null &&
    verifiedPayload.tenantId !== body.tenantId
  ) {
    return c.json(
      {
        success: false,
        error: {
          code: "TOKEN_TENANT_MISMATCH",
          message: "Token tenant does not match request tenant"
        }
      },
      403
    );
  }
  return c.json({
    success: true,
    data: {
      subject: verifiedPayload.sub,
      payload: verifiedPayload
    }
  });
});

app.get("/internal/users/:userId/profile", async (c) => {
  const repository = new D1IdentityRepository(c.env.PLATFORM_DB);
  const identity = await repository.getByUserId(c.req.param("userId"));
  if (identity === null) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } }, 404);
  }
  return c.json({
    success: true,
    data: {
      userId: identity.user.id,
      email: identity.user.email,
      memberships: identity.memberships
    }
  });
});

app.get("/internal/tenants/:tenantId/clerk-config", async (c) => {
  const repository = new D1ClerkConfigRepository(c.env.PLATFORM_DB);
  const config = await repository.getByTenantId(c.req.param("tenantId"));
  if (config === null) {
    return c.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Clerk configuration not found"
        }
      },
      404
    );
  }
  return c.json({
    success: true,
    data: config
  });
});

app.post("/internal/tenants/:tenantId/configure-clerk-keys", async (c) => {
  const tenantId = c.req.param("tenantId");
  const body = (await c.req.json()) as {
    readonly clerkPublishableKey: string;
    readonly clerkSecretKey?: string;
    readonly clerkWebhookSecret?: string;
    readonly clerkAuthDomain?: string | null;
    readonly clerkProxyUrl?: string | null;
    readonly clerkJwksUrl?: string | null;
  };
  const repository = new D1ClerkConfigRepository(c.env.PLATFORM_DB);
  const existingConfig = await repository.getByTenantId(tenantId);
  const normalizedSecretKey = body.clerkSecretKey?.trim() ?? "";
  const normalizedWebhookSecret = body.clerkWebhookSecret?.trim() ?? "";
  const encryptedSecretKey =
    normalizedSecretKey.length > 0
      ? (
        await configureTenantClerkKeys({
          tenantId,
          clerkPublishableKey: body.clerkPublishableKey,
          clerkSecretKey: normalizedSecretKey,
          clerkWebhookSecret: normalizedWebhookSecret.length > 0 ? normalizedWebhookSecret : existingConfig?.webhookSecret ?? "",
          encryptionSecret: c.env.CLERK_KEY_ENCRYPTION_SECRET
        })
      ).encryptedSecretKey
      : existingConfig?.encryptedSecretKey;
  const webhookSecret =
    normalizedWebhookSecret.length > 0 ? normalizedWebhookSecret : (existingConfig?.webhookSecret ?? null);
  if (encryptedSecretKey === undefined || webhookSecret === null) {
    return c.json(
      {
        success: false,
        error: {
          code: "MISSING_SECRET_CONFIGURATION",
          message: "Clerk secret key and webhook secret are required for initial configuration"
        }
      },
      400
    );
  }
  const authDomain = normalizeOptionalUrl(body.clerkAuthDomain ?? existingConfig?.authDomain ?? null);
  const proxyUrl = normalizeOptionalUrl(body.clerkProxyUrl ?? existingConfig?.proxyUrl ?? null);
  const jwksUrl = resolveJwksUrl(authDomain, body.clerkJwksUrl ?? existingConfig?.jwksUrl ?? null);
  if (jwksUrl === null) {
    return c.json(
      {
        success: false,
        error: {
          code: "JWKS_URL_REQUIRED",
          message: "Provide either a Clerk auth domain or an explicit JWKS URL"
        }
      },
      400
    );
  }
  await repository.save({
    id: `${tenantId}:clerk-config`,
    tenantId: tenantId as string & { readonly __brand: "TenantId" },
    publishableKey: body.clerkPublishableKey,
    encryptedSecretKey,
    webhookSecret,
    authDomain,
    proxyUrl,
    jwksUrl
  });
  return c.json({
    success: true,
    data: {
      configured: true,
      encryptedSecretKey,
      authDomain,
      proxyUrl,
      jwksUrl
    }
  });
});

app.post("/api/webhooks/clerk", async (c) => {
  const tenantId: string | undefined = c.req.header("x-tenant-id") ?? c.req.query("tenantId") ?? undefined;
  if (tenantId === undefined || tenantId.length === 0) {
    return c.json(
      {
        success: false,
        error: {
          code: "TENANT_ID_REQUIRED",
          message: "Tenant id is required in x-tenant-id header or tenantId query"
        }
      },
      400
    );
  }
  const configRepository = new D1ClerkConfigRepository(c.env.PLATFORM_DB);
  const config = await configRepository.getByTenantId(tenantId);
  if (config === null) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Tenant Clerk config not found" } }, 404);
  }
  const event = await parseClerkWebhook(c.req.raw.clone(), config.webhookSecret);
  return c.json({
    success: true,
    data: {
      type: event.type
    }
  });
});

export default app;
