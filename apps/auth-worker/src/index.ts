import { Hono } from "hono";
import type { AuthBindings } from "@arch/cloudflare-bindings";
import type { AuthTokenPayload, Permission, PlatformRole, TenantRole } from "@arch/auth-contracts";
import { PERMISSIONS, PLATFORM_ROLE, TENANT_ROLE } from "@arch/auth-contracts";
import { ulid } from "ulid";
import { D1IdentityRepository } from "./infrastructure/persistence/d1-identity.repository";
import { createAuth, getAuthConfigurationSummary } from "./better-auth";

const app = new Hono<{ Bindings: AuthBindings }>();

type SessionRow = {
  readonly id: string;
  readonly token?: string;
  readonly userId: string;
  readonly expiresAt: string | number;
  readonly createdAt: string | number;
};

type UserRow = {
  readonly id: string;
  readonly email: string | null;
  readonly name: string | null;
  readonly image: string | null;
};

type BootstrapUserRequest = {
  readonly email?: string;
  readonly name?: string;
  readonly password?: string;
  readonly memberships?: ReadonlyArray<{
    readonly tenantId?: string;
    readonly role?: PlatformRole | TenantRole;
  }>;
};

type BootstrapRequestBody = {
  readonly users?: ReadonlyArray<BootstrapUserRequest>;
};

type BootstrapUserResult = {
  readonly userId: string;
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly temporaryPassword: boolean;
  readonly memberships: ReadonlyArray<{
    readonly tenantId: string;
    readonly role: PlatformRole | TenantRole;
  }>;
};

const SECURE_COOKIE_PREFIX = "__Secure-";

const ROLE_PERMISSIONS: Record<PlatformRole | TenantRole, readonly Permission[]> = {
  [PLATFORM_ROLE.PLATFORM_ADMIN]: Object.values(PERMISSIONS),
  [TENANT_ROLE.TENANT_ADMIN]: [
    PERMISSIONS.MANAGE_TENANTS,
    PERMISSIONS.MANAGE_TENANT_CONFIG,
    PERMISSIONS.MANAGE_VENDORS,
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.VIEW_LEDGER,
    PERMISSIONS.MANAGE_LEDGER,
  ],
  [TENANT_ROLE.VENDOR_OWNER]: [
    PERMISSIONS.MANAGE_VENDORS,
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.MANAGE_ORDERS,
  ],
  [TENANT_ROLE.VENDOR_STAFF]: [PERMISSIONS.MANAGE_PRODUCTS, PERMISSIONS.MANAGE_ORDERS],
  [TENANT_ROLE.CUSTOMER]: [],
};

const toEpochSeconds = (value: string | number) => {
  if (typeof value === "number") {
    return Math.floor(value / 1000);
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Math.floor(Date.now() / 1000) : Math.floor(parsed / 1000);
};

const mergePermissions = (roles: ReadonlyArray<PlatformRole | TenantRole>) => {
  const permissions = new Set<Permission>();

  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role] ?? []) {
      permissions.add(permission);
    }
  }

  return Array.from(permissions);
};

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

const parseCookies = (cookieHeader: string) => {
  const cookieMap = new Map<string, string>();

  for (const cookie of cookieHeader.split("; ")) {
    const [name, value] = cookie.split(/=(.*)/s);
    if (name && value) {
      cookieMap.set(name, value);
    }
  }

  return cookieMap;
};

const getSessionCookie = (headers: Headers) => {
  const cookies = headers.get("cookie");

  if (!cookies) {
    return null;
  }

  const parsedCookie = parseCookies(cookies);
  const getCookie = (name: string) =>
    parsedCookie.get(name) ?? parsedCookie.get(`${SECURE_COOKIE_PREFIX}${name}`) ?? null;

  return getCookie("better-auth.session_token") ?? getCookie("better-auth-session_token");
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const getUserByEmail = async (env: AuthBindings, email: string) => {
  return env.PLATFORM_DB.prepare(
    'SELECT id, email, name, image FROM "user" WHERE lower(email) = ? LIMIT 1'
  )
    .bind(normalizeEmail(email))
    .first<UserRow>();
};

const deleteSessionByToken = async (env: AuthBindings, token: string | undefined) => {
  if (token === undefined || token.length === 0) {
    return;
  }

  await env.PLATFORM_DB.prepare('DELETE FROM "session" WHERE token = ?').bind(token).run();
};

const createAuthUser = async (
  env: AuthBindings,
  request: { readonly email: string; readonly name: string; readonly password: string }
) => {
  const auth = createAuth(env);
  const response = await auth.handler(
    new Request("http://localhost/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost:3000"
      },
      body: JSON.stringify(request)
    })
  );

  const payload = (await response.json().catch(() => null)) as
    | {
      readonly user?: { readonly id?: string };
      readonly token?: string;
      readonly message?: string;
    }
    | null;

  if (!response.ok) {
    throw new Error(payload?.message ?? `Unable to bootstrap auth user (${response.status}).`);
  }

  await deleteSessionByToken(env, payload?.token);

  const userId = payload?.user?.id;
  if (typeof userId === "string" && userId.length > 0) {
    return userId;
  }

  const createdUser = await getUserByEmail(env, request.email);
  if (createdUser?.id) {
    return createdUser.id;
  }

  throw new Error("Auth signup completed without returning a user record.");
};

const requireInternalBootstrapSecret = (request: Request, env: AuthBindings) => {
  const providedSecret = request.headers.get("x-arch-internal-secret");
  return providedSecret !== null && providedSecret === env.INTERNAL_BOOTSTRAP_SECRET;
};

const isPlatformOrTenantRole = (role: string): role is PlatformRole | TenantRole => {
  return Object.values(PLATFORM_ROLE).includes(role as PlatformRole)
    || Object.values(TENANT_ROLE).includes(role as TenantRole);
};

const bootstrapUsers = async (env: AuthBindings, users: ReadonlyArray<BootstrapUserRequest>) => {
  const repository = new D1IdentityRepository(env.PLATFORM_DB);
  const results: BootstrapUserResult[] = [];

  for (const user of users) {
    const email = typeof user.email === "string" ? normalizeEmail(user.email) : "";
    const name = typeof user.name === "string" ? user.name.trim() : "";
    const password = typeof user.password === "string" ? user.password : "";
    const memberships = (user.memberships ?? []).flatMap((membership) => {
      if (
        typeof membership.tenantId !== "string"
        || membership.tenantId.trim().length === 0
        || typeof membership.role !== "string"
        || !isPlatformOrTenantRole(membership.role)
      ) {
        return [];
      }

      return [{
        tenantId: membership.tenantId,
        role: membership.role
      }];
    });

    if (email.length === 0 || name.length === 0 || password.length === 0 || memberships.length === 0) {
      throw new Error("Each bootstrap user requires email, name, password, and at least one membership.");
    }

    const existingUser = await getUserByEmail(env, email);
    const userId = existingUser?.id
      ?? await createAuthUser(env, { email, name, password }).catch(async (error: unknown) => {
        const userAfterConflict = await getUserByEmail(env, email);
        if (userAfterConflict?.id) {
          return userAfterConflict.id;
        }
        throw error;
      });

    await repository.save({
      user: {
        id: userId,
        email: email as string & { readonly __brand: "EmailAddress" }
      },
      memberships: memberships.map((membership) => ({
        id: ulid(),
        tenantId: membership.tenantId as string & { readonly __brand: "TenantId" },
        userId,
        role: membership.role
      }))
    });

    results.push({
      userId,
      email,
      name,
      password,
      temporaryPassword: true,
      memberships
    });
  }

  return results;
};

const resolveRequestedTenantId = (request: Request) => {
  const url = new URL(request.url);
  return request.headers.get("x-tenant-id") ?? url.searchParams.get("tenantId");
};

const getRequestSessionToken = (request: Request) => {
  return extractBearerToken(request.headers.get("authorization") ?? undefined) ?? getSessionCookie(request.headers);
};

const getSessionRow = async (env: AuthBindings, token: string) => {
  return env.PLATFORM_DB.prepare(
    'SELECT id, token, userId, expiresAt, createdAt FROM "session" WHERE token = ? LIMIT 1'
  )
    .bind(token)
    .first<SessionRow>();
};

const getUserRow = async (env: AuthBindings, userId: string) => {
  return env.PLATFORM_DB.prepare('SELECT id, email, name, image FROM "user" WHERE id = ? LIMIT 1')
    .bind(userId)
    .first<UserRow>();
};

const buildAuthorizationContext = async (
  env: AuthBindings,
  session: SessionRow,
  tenantId: string | null | undefined
) => {
  const expiresAt = toEpochSeconds(session.expiresAt);
  if (expiresAt <= Math.floor(Date.now() / 1000)) {
    return { error: "TOKEN_EXPIRED" as const };
  }

  const repository = new D1IdentityRepository(env.PLATFORM_DB);
  const identity = await repository.getByUserId(session.userId);
  if (identity === null) {
    return { error: "IDENTITY_NOT_FOUND" as const };
  }

  const tenantMembership = tenantId
    ? identity.memberships.find((membership) => membership.tenantId === tenantId)
    : identity.memberships.find((membership) => membership.role !== PLATFORM_ROLE.PLATFORM_ADMIN) ?? null;

  const platformMembership = identity.memberships.find(
    (membership) => membership.role === PLATFORM_ROLE.PLATFORM_ADMIN
  );

  if (tenantId !== undefined && tenantId !== null && tenantMembership === undefined) {
    return { error: "TOKEN_TENANT_MISMATCH" as const };
  }

  const platformRole = platformMembership?.role === PLATFORM_ROLE.PLATFORM_ADMIN ? PLATFORM_ROLE.PLATFORM_ADMIN : null;
  const tenantRole =
    tenantMembership !== undefined && tenantMembership !== null && tenantMembership.role !== PLATFORM_ROLE.PLATFORM_ADMIN
      ? (tenantMembership.role as TenantRole)
      : null;

  const payload: AuthTokenPayload = {
    sub: session.userId,
    sid: session.id,
    exp: expiresAt,
    iat: toEpochSeconds(session.createdAt),
    orgId: tenantId ?? tenantMembership?.tenantId ?? null,
    tenantId: tenantId ?? tenantMembership?.tenantId ?? null,
    platformRole,
    tenantRole,
    permissions: mergePermissions(
      [platformRole, tenantRole].filter((role): role is PlatformRole | TenantRole => role !== null)
    ),
  };

  return {
    payload,
    identity,
  };
};

const resolveSessionContext = async (env: AuthBindings, request: Request) => {
  const token = getRequestSessionToken(request);
  if (token === null) {
    return { authenticated: false as const };
  }

  const session = await getSessionRow(env, token);
  if (session === null) {
    return { authenticated: false as const };
  }

  const tenantId = resolveRequestedTenantId(request);
  const authorization = await buildAuthorizationContext(env, session, tenantId);
  if ("error" in authorization) {
    return {
      authenticated: false as const,
      error: authorization.error,
    };
  }

  const user = await getUserRow(env, session.userId);
  return {
    authenticated: true as const,
    session,
    user,
    identity: authorization.identity,
    payload: authorization.payload,
  };
};

app.get("/health", (c) => c.json({ success: true, data: { service: "auth-worker", status: "ok" } }));

app.all("/api/auth/*", async (c) => {
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});

app.get("/api/client/providers", (c) => {
  const configuration = getAuthConfigurationSummary(c.env);
  return c.json({
    success: true,
    data: {
      credentialStrategies: configuration.credentialStrategies,
      socialProviders: configuration.socialProviders,
      sessionTransports: ["cookie", "bearer"],
      organizationEnabled: true,
      adminEnabled: true,
    },
  });
});

app.get("/internal/tenants/:tenantId/auth-configuration", (c) => {
  return c.json({
    success: true,
    data: getAuthConfigurationSummary(c.env, c.req.param("tenantId")),
  });
});

app.post("/internal/bootstrap-users", async (c) => {
  if (!requireInternalBootstrapSecret(c.req.raw, c.env)) {
    return c.json(
      {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Missing or invalid internal bootstrap secret"
        }
      },
      403
    );
  }

  const body = (await c.req.json().catch(() => null)) as BootstrapRequestBody | null;
  if (body?.users === undefined || body.users.length === 0) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "At least one bootstrap user is required"
        }
      },
      400
    );
  }

  try {
    const results = await bootstrapUsers(c.env, body.users);
    return c.json({
      success: true,
      data: {
        users: results
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to bootstrap users";
    return c.json(
      {
        success: false,
        error: {
          code: "BOOTSTRAP_FAILED",
          message
        }
      },
      400
    );
  }
});

app.get("/api/client/session", async (c) => {
  const context = await resolveSessionContext(c.env, c.req.raw);
  if (!context.authenticated) {
    return c.json({
      success: true,
      data: {
        authenticated: false,
        session: null,
        user: null,
        memberships: [],
        authorization: null,
      },
    });
  }

  return c.json({
    success: true,
    data: {
      authenticated: true,
      session: {
        sessionId: context.session.id,
        userId: context.session.userId,
        expiresAt: toEpochSeconds(context.session.expiresAt),
        issuedAt: toEpochSeconds(context.session.createdAt),
      },
      user: {
        id: context.session.userId,
        email: context.user?.email ?? context.identity.user.email ?? null,
        name: context.user?.name ?? null,
        image: context.user?.image ?? null,
      },
      memberships: context.identity.memberships,
      authorization: context.payload,
    },
  });
});

app.get("/api/client/me", async (c) => {
  const context = await resolveSessionContext(c.env, c.req.raw);
  if (!context.authenticated) {
    return c.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication is required",
        },
      },
      401
    );
  }

  return c.json({
    success: true,
    data: {
      user: {
        id: context.session.userId,
        email: context.user?.email ?? context.identity.user.email ?? null,
        name: context.user?.name ?? null,
        image: context.user?.image ?? null,
      },
      memberships: context.identity.memberships,
      authorization: context.payload,
    },
  });
});

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
          message: "Missing token",
        },
      },
      400
    );
  }

  const session = await getSessionRow(c.env, body.token);

  if (session === null) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message: "Session token was not found",
        },
      },
      401
    );
  }

  const authorization = await buildAuthorizationContext(c.env, session, body.tenantId);
  if ("error" in authorization) {
    if (authorization.error === "TOKEN_EXPIRED") {
      return c.json(
        {
          success: false,
          error: {
            code: "TOKEN_EXPIRED",
            message: "Session token has expired",
          },
        },
        401
      );
    }

    if (authorization.error === "TOKEN_TENANT_MISMATCH") {
      return c.json(
        {
          success: false,
          error: {
            code: "TOKEN_TENANT_MISMATCH",
            message: "Session token is not authorized for the requested tenant",
          },
        },
        403
      );
    }

    return c.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Identity was not found",
        },
      },
      404
    );
  }

  return c.json({
    success: true,
    data: {
      subject: authorization.payload.sub,
      payload: authorization.payload,
    },
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
      memberships: identity.memberships,
    },
  });
});

export default app;
