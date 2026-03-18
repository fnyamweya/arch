import { Hono } from "hono";
import type { TenantBindings } from "@arch/cloudflare-bindings";
import { CloudflareClient, DomainManager } from "@arch/infrastructure-sdk";
import { storefrontsTable, tenantDomainsTable, tenantInfrastructureTable, tenantsTable, vendorMembersTable, vendorsTable } from "@arch/db-schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { ulid } from "ulid";
import { configureTenant } from "./application/commands/configure-tenant";
import { provisionTenant } from "./application/commands/provision-tenant";
import { suspendTenant } from "./application/commands/suspend-tenant";
import { getTenantConfig } from "./application/queries/get-tenant-config";
import { D1TenantRepository } from "./infrastructure/persistence/d1-tenant.repository";

type OnboardingUserRole = "PLATFORM_ADMIN" | "TENANT_ADMIN" | "VENDOR_OWNER" | "CUSTOMER";

type OnboardingUserInput = {
  readonly role?: OnboardingUserRole;
  readonly email?: string;
  readonly name?: string;
  readonly password?: string;
};

type OnboardingRequest = {
  readonly tenantId?: string;
  readonly tenantSlug?: string;
  readonly displayName?: string;
  readonly primaryDomain?: string;
  readonly users?: ReadonlyArray<OnboardingUserInput>;
};

type BootstrappedUser = {
  readonly userId: string;
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly temporaryPassword: boolean;
  readonly memberships: ReadonlyArray<{
    readonly tenantId: string;
    readonly role: OnboardingUserRole;
  }>;
};

type SeededTenantUser = {
  readonly role: OnboardingUserRole;
  readonly userId: string;
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly temporaryPassword: boolean;
};

interface TenantResolutionRecord {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly tenantDomain: string;
  readonly sentryDsn?: string | null;
}

const app = new Hono<{ Bindings: TenantBindings }>();

const validOnboardingRoles = new Set<OnboardingUserRole>([
  "PLATFORM_ADMIN",
  "TENANT_ADMIN",
  "VENDOR_OWNER",
  "CUSTOMER"
]);

const normalizeDomain = (domain: string): string => {
  const trimmedDomain = domain.trim().toLowerCase();

  if (trimmedDomain.startsWith("http://") || trimmedDomain.startsWith("https://")) {
    return new URL(trimmedDomain).host.toLowerCase();
  }

  return trimmedDomain.replace(/\/+$/, "");
};

const normalizeSlug = (slug: string): string => slug.trim().toLowerCase();

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const normalizeBaseDomain = (domain: string): string => domain.trim().toLowerCase().replace(/^\.+/, "").replace(/\.+$/, "");

const createTemporaryPassword = () => `Arch!${ulid()}`;

const isOnboardingRole = (role: string): role is OnboardingUserRole => validOnboardingRoles.has(role as OnboardingUserRole);

const isManagedPlatformDomain = (domain: string, baseDomain: string): boolean => {
  const normalizedDomain = normalizeDomain(domain);
  const normalizedBaseDomain = normalizeBaseDomain(baseDomain);
  return normalizedDomain === normalizedBaseDomain || normalizedDomain.endsWith(`.${normalizedBaseDomain}`);
};

const ensureGatewayDomainMapping = async (env: TenantBindings, domain: string): Promise<void> => {
  if (env.CLOUDFLARE_ACCOUNT_ID.trim().length === 0 || env.CLOUDFLARE_API_TOKEN.trim().length === 0) {
    return;
  }

  if (env.GATEWAY_WORKER_SERVICE.trim().length === 0) {
    return;
  }

  if (!isManagedPlatformDomain(domain, env.PLATFORM_BASE_DOMAIN)) {
    return;
  }

  const client = new CloudflareClient({
    accountId: env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: env.CLOUDFLARE_API_TOKEN,
    apiBaseUrl: "https://api.cloudflare.com/client/v4"
  });
  const domainManager = new DomainManager(client, env.CLOUDFLARE_ACCOUNT_ID);

  await domainManager.mapWorkerDomain({
    hostname: normalizeDomain(domain),
    service: env.GATEWAY_WORKER_SERVICE,
    environment: env.GATEWAY_WORKER_ENVIRONMENT
  });
};

const validateOnboardingBody = (body: OnboardingRequest) => {
  const tenantSlug = typeof body.tenantSlug === "string" ? normalizeSlug(body.tenantSlug) : "";
  const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
  const primaryDomain = typeof body.primaryDomain === "string" ? normalizeDomain(body.primaryDomain) : "";
  const tenantId = typeof body.tenantId === "string" && body.tenantId.trim().length > 0 ? body.tenantId : ulid();

  if (!/^[a-z0-9-]{3,63}$/.test(tenantSlug)) {
    throw new Error("Tenant slug must be 3-63 characters and contain only lowercase letters, numbers, and hyphens.");
  }

  if (displayName.length < 3) {
    throw new Error("Display name must be at least 3 characters.");
  }

  if (!/^[a-z0-9.-]+$/.test(primaryDomain) || !primaryDomain.includes(".")) {
    throw new Error("Primary domain must be a valid hostname.");
  }

  const users = (body.users ?? []).map((user) => {
    const role = typeof user.role === "string" ? user.role : "";
    const email = typeof user.email === "string" ? normalizeEmail(user.email) : "";
    const name = typeof user.name === "string" ? user.name.trim() : "";
    const password = typeof user.password === "string" && user.password.length > 0
      ? user.password
      : createTemporaryPassword();

    if (!isOnboardingRole(role)) {
      throw new Error("Each onboarding user requires a valid role.");
    }

    if (email.length === 0 || name.length === 0) {
      throw new Error(`Role ${role} requires both name and email.`);
    }

    return {
      role,
      email,
      name,
      password,
      temporaryPassword: typeof user.password !== "string" || user.password.length === 0
    };
  });

  if (users.length === 0) {
    throw new Error("At least one onboarding user is required.");
  }

  if (new Set(users.map((user) => user.role)).size !== users.length) {
    throw new Error("Each onboarding role may only be assigned once during bootstrap.");
  }

  if (new Set(users.map((user) => user.email)).size !== users.length) {
    throw new Error("Each onboarding user must have a distinct email address.");
  }

  const roleSet = new Set(users.map((user) => user.role));
  if (!roleSet.has("PLATFORM_ADMIN") || !roleSet.has("TENANT_ADMIN")) {
    throw new Error("Platform admin and tenant admin users are required.");
  }

  return {
    tenantId,
    tenantSlug,
    displayName,
    primaryDomain,
    users
  };
};

const assertTenantAvailability = async (
  env: TenantBindings,
  input: { readonly tenantId: string; readonly tenantSlug: string; readonly primaryDomain: string }
) => {
  const db = drizzle(env.PLATFORM_DB);

  const [tenantById] = await db.select().from(tenantsTable).where(eq(tenantsTable.id, input.tenantId)).limit(1);
  if (tenantById !== undefined) {
    throw new Error("Tenant id already exists.");
  }

  const [tenantBySlug] = await db.select().from(tenantsTable).where(eq(tenantsTable.slug, input.tenantSlug)).limit(1);
  if (tenantBySlug !== undefined) {
    throw new Error("Tenant slug already exists.");
  }

  const [existingDomain] = await db
    .select()
    .from(tenantDomainsTable)
    .where(eq(tenantDomainsTable.domain, input.primaryDomain))
    .limit(1);

  if (existingDomain !== undefined) {
    throw new Error("Primary domain is already assigned to another tenant.");
  }
};

const bootstrapAuthUsers = async (
  env: TenantBindings,
  input: {
    readonly tenantId: string;
    readonly users: ReadonlyArray<{
      readonly role: OnboardingUserRole;
      readonly email: string;
      readonly name: string;
      readonly password: string;
      readonly temporaryPassword: boolean;
    }>;
  }
) => {
  const response = await env.AUTH_WORKER.fetch(
    new Request("https://internal/internal/bootstrap-users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-arch-internal-secret": env.INTERNAL_BOOTSTRAP_SECRET
      },
      body: JSON.stringify({
        users: input.users.map((user) => ({
          email: user.email,
          name: user.name,
          password: user.password,
          memberships: [{ tenantId: input.tenantId, role: user.role }]
        }))
      })
    })
  );

  const payload = (await response.json().catch(() => null)) as
    | {
      readonly success?: boolean;
      readonly data?: { readonly users?: ReadonlyArray<BootstrappedUser> };
      readonly error?: { readonly message?: string };
    }
    | null;

  if (!response.ok || payload?.success !== true || payload.data?.users === undefined) {
    throw new Error(payload?.error?.message ?? "Unable to bootstrap auth users.");
  }

  const bootstrappedUsersByRole = new Map<OnboardingUserRole, BootstrappedUser>();
  for (const user of payload.data.users) {
    const membership = user.memberships[0];
    if (membership !== undefined && isOnboardingRole(membership.role)) {
      bootstrappedUsersByRole.set(membership.role, user);
    }
  }

  return input.users.map((user) => {
    const bootstrappedUser = bootstrappedUsersByRole.get(user.role);
    if (bootstrappedUser === undefined) {
      throw new Error(`Missing auth bootstrap result for role ${user.role}.`);
    }

    return {
      role: user.role,
      userId: bootstrappedUser.userId,
      email: bootstrappedUser.email,
      name: bootstrappedUser.name,
      password: bootstrappedUser.password,
      temporaryPassword: user.temporaryPassword
    } satisfies SeededTenantUser;
  });
};

const seedTenantData = async (
  env: TenantBindings,
  input: {
    readonly tenantId: string;
    readonly displayName: string;
    readonly primaryDomain: string;
    readonly provisionedInfrastructure: {
      readonly d1DatabaseId: string;
      readonly kvNamespaceId: string;
      readonly r2BucketName: string;
      readonly queueName: string;
    };
    readonly users: ReadonlyArray<SeededTenantUser>;
  }
) => {
  const db = drizzle(env.PLATFORM_DB);
  const now = new Date();
  const vendorId = ulid();
  const storefrontId = ulid();

  await db
    .insert(tenantInfrastructureTable)
    .values({
      id: ulid(),
      tenantId: input.tenantId,
      d1DatabaseId: input.provisionedInfrastructure.d1DatabaseId,
      kvNamespaceId: input.provisionedInfrastructure.kvNamespaceId,
      r2BucketName: input.provisionedInfrastructure.r2BucketName,
      queueName: input.provisionedInfrastructure.queueName,
      configuredAt: now
    })
    .onConflictDoUpdate({
      target: tenantInfrastructureTable.tenantId,
      set: {
        d1DatabaseId: input.provisionedInfrastructure.d1DatabaseId,
        kvNamespaceId: input.provisionedInfrastructure.kvNamespaceId,
        r2BucketName: input.provisionedInfrastructure.r2BucketName,
        queueName: input.provisionedInfrastructure.queueName,
        configuredAt: now
      }
    });

  await db
    .insert(vendorsTable)
    .values({
      id: vendorId,
      displayName: `${input.displayName} Vendor`,
      businessName: `${input.displayName} Vendor`,
      status: "APPROVED",
      commissionRateBasisPoints: 1200,
      createdAt: now,
      updatedAt: now
    })
    .onConflictDoUpdate({
      target: vendorsTable.id,
      set: {
        displayName: `${input.displayName} Vendor`,
        businessName: `${input.displayName} Vendor`,
        status: "APPROVED",
        commissionRateBasisPoints: 1200,
        updatedAt: now
      }
    });

  await db
    .insert(storefrontsTable)
    .values({
      id: storefrontId,
      tenantId: input.tenantId,
      code: "default",
      name: `${input.displayName} Storefront`,
      status: "ACTIVE",
      defaultLocale: "en-US",
      supportedLocales: JSON.stringify(["en-US"]),
      primaryDomain: input.primaryDomain,
      seoDefaults: JSON.stringify({ title: input.displayName, description: `${input.displayName} storefront` }),
      featureFlags: JSON.stringify({ reviews: true, wishlists: true, recommendations: true }),
      createdAt: now,
      updatedAt: now
    })
    .onConflictDoUpdate({
      target: storefrontsTable.id,
      set: {
        tenantId: input.tenantId,
        code: "default",
        name: `${input.displayName} Storefront`,
        status: "ACTIVE",
        defaultLocale: "en-US",
        supportedLocales: JSON.stringify(["en-US"]),
        primaryDomain: input.primaryDomain,
        seoDefaults: JSON.stringify({ title: input.displayName, description: `${input.displayName} storefront` }),
        featureFlags: JSON.stringify({ reviews: true, wishlists: true, recommendations: true }),
        updatedAt: now
      }
    });

  const vendorOwner = input.users.find((user) => user.role === "VENDOR_OWNER");
  if (vendorOwner !== undefined) {
    await db
      .insert(vendorMembersTable)
      .values({
        id: ulid(),
        vendorId,
        globalUserId: vendorOwner.userId,
        role: "OWNER",
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: [vendorMembersTable.vendorId, vendorMembersTable.globalUserId],
        set: {
          role: "OWNER",
          status: "ACTIVE",
          updatedAt: now
        }
      });
  }

  return {
    vendorId,
    storefrontId,
    infrastructure: input.provisionedInfrastructure
  };
};

const buildTenantResolutionRecord = async (
  repository: D1TenantRepository,
  fallback: TenantResolutionRecord
): Promise<TenantResolutionRecord> => {
  const tenant = await repository.getById(fallback.tenantId);
  if (tenant === null) {
    return fallback;
  }

  return {
    tenantId: tenant.tenant.id,
    tenantSlug: tenant.tenant.slug,
    tenantDomain: tenant.configuration.primaryDomain,
    sentryDsn: tenant.configuration.sentryDsn
  };
};

const writeDomainMapping = async (
  env: TenantBindings,
  repository: D1TenantRepository,
  tenantId: string,
  domain: string
): Promise<void> => {
  const tenant = await repository.getById(tenantId);
  if (tenant === null) {
    return;
  }

  await env.PLATFORM_CONFIG_KV.put(
    `tenant-domain:${normalizeDomain(domain)}`,
    JSON.stringify({
      tenantId: tenant.tenant.id,
      tenantSlug: tenant.tenant.slug,
      tenantDomain: tenant.configuration.primaryDomain,
      sentryDsn: tenant.configuration.sentryDsn
    } satisfies TenantResolutionRecord)
  );
};

app.get("/health", (c) => c.json({ success: true, data: { service: "tenant-worker", status: "ok" } }));

app.post("/tenants", async (c) => {
  const body = (await c.req.json().catch(() => null)) as OnboardingRequest | null;

  if (body === null) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Request body must be valid JSON."
        }
      },
      400
    );
  }

  try {
    const validatedInput = validateOnboardingBody(body);
    await assertTenantAvailability(c.env, validatedInput);

    const provisionResult = await provisionTenant({
      tenantId: validatedInput.tenantId,
      tenantSlug: validatedInput.tenantSlug,
      primaryDomain: validatedInput.primaryDomain,
      cloudflareAccountId: c.env.CLOUDFLARE_ACCOUNT_ID,
      cloudflareApiToken: c.env.CLOUDFLARE_API_TOKEN,
      gatewayWorkerService: c.env.GATEWAY_WORKER_SERVICE,
      gatewayWorkerEnvironment: c.env.GATEWAY_WORKER_ENVIRONMENT
    });

    await configureTenant({
      tenantId: validatedInput.tenantId,
      displayName: validatedInput.displayName,
      primaryDomain: validatedInput.primaryDomain
    });

    const repository = new D1TenantRepository(c.env.PLATFORM_DB);
    await repository.save({
      tenant: {
        id: validatedInput.tenantId,
        slug: validatedInput.tenantSlug,
        displayName: validatedInput.displayName,
        status: "ACTIVE"
      },
      configuration: {
        tenantId: validatedInput.tenantId,
        primaryDomain: validatedInput.primaryDomain,
        sentryDsn: null
      }
    });

    const seededUsers = await bootstrapAuthUsers(c.env, {
      tenantId: validatedInput.tenantId,
      users: validatedInput.users
    });

    const seededResources = await seedTenantData(c.env, {
      tenantId: validatedInput.tenantId,
      displayName: validatedInput.displayName,
      primaryDomain: validatedInput.primaryDomain,
      provisionedInfrastructure: {
        d1DatabaseId: provisionResult.d1DatabaseId,
        kvNamespaceId: provisionResult.kvNamespaceId,
        r2BucketName: provisionResult.r2BucketName,
        queueName: provisionResult.queueName
      },
      users: seededUsers
    });

    await c.env.PLATFORM_CONFIG_KV.put(
      `tenant-domain:${validatedInput.primaryDomain}`,
      JSON.stringify({
        tenantId: validatedInput.tenantId,
        tenantSlug: validatedInput.tenantSlug,
        tenantDomain: validatedInput.primaryDomain,
        sentryDsn: null
      } satisfies TenantResolutionRecord)
    );

    return c.json(
      {
        success: true,
        data: {
          tenantId: validatedInput.tenantId,
          tenantSlug: validatedInput.tenantSlug,
          tenantDomain: validatedInput.primaryDomain,
          displayName: validatedInput.displayName,
          status: "ACTIVE",
          sentryDsn: null,
          infrastructureReady: provisionResult.infrastructureReady,
          seededUsers,
          seededResources: {
            vendorId: seededResources.vendorId,
            storefrontId: seededResources.storefrontId,
            domains: [validatedInput.primaryDomain],
            infrastructure: seededResources.infrastructure
          }
        }
      },
      201
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to onboard tenant.";

    return c.json(
      {
        success: false,
        error: {
          code: "ONBOARDING_FAILED",
          message
        }
      },
      400
    );
  }
});

app.get("/tenants/:tenantId", async (c) => {
  const config = await getTenantConfig(c.req.param("tenantId"));
  if (config !== null) {
    return c.json({ success: true, data: config });
  }

  const repository = new D1TenantRepository(c.env.PLATFORM_DB);
  const tenant = await repository.getById(c.req.param("tenantId"));
  if (tenant === null) {
    return c.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Tenant not found"
        }
      },
      404
    );
  }

  return c.json({
    success: true,
    data: {
      tenantId: tenant.tenant.id,
      tenantSlug: tenant.tenant.slug,
      status: tenant.tenant.status
    }
  });
});

app.post("/tenants/:tenantId/suspend", async (c) => {
  const body = (await c.req.json()) as { readonly reason: string };
  const result = await suspendTenant({
    tenantId: c.req.param("tenantId"),
    reason: body.reason
  });

  return c.json({
    success: true,
    data: result
  });
});

app.post("/internal/resolve-tenant", async (c) => {
  const body = (await c.req.json()) as { readonly domain?: string };
  if (body.domain === undefined || body.domain.length === 0) {
    return c.json(
      {
        success: false,
        error: {
          code: "DOMAIN_REQUIRED",
          message: "Domain is required"
        }
      },
      400
    );
  }

  const repository = new D1TenantRepository(c.env.PLATFORM_DB);
  const recordRaw: string | null = await c.env.PLATFORM_CONFIG_KV.get(`tenant-domain:${body.domain.toLowerCase()}`);
  if (recordRaw !== null) {
    const record = JSON.parse(recordRaw) as TenantResolutionRecord;
    return c.json({
      success: true,
      data: await buildTenantResolutionRecord(repository, record)
    });
  }

  const baseDomainSuffix = `.${normalizeBaseDomain(c.env.PLATFORM_BASE_DOMAIN)}`;
  const fallbackTenantId = body.domain.toLowerCase().endsWith(baseDomainSuffix)
    ? body.domain.toLowerCase().slice(0, -baseDomainSuffix.length)
    : body.domain;

  const tenant = await repository.getById(fallbackTenantId);
  if (tenant !== null) {
    return c.json({
      success: true,
      data: {
        tenantId: tenant.tenant.id,
        tenantSlug: tenant.tenant.slug,
        tenantDomain: tenant.configuration.primaryDomain,
        sentryDsn: tenant.configuration.sentryDsn
      }
    });
  }

  return c.json(
    {
      success: false,
      error: {
        code: "TENANT_NOT_FOUND",
        message: "Tenant resolution failed"
      }
    },
    404
  );
});

app.get("/internal/tenants/:tenantId/domains", async (c) => {
  const repository = new D1TenantRepository(c.env.PLATFORM_DB);
  const tenant = await repository.getById(c.req.param("tenantId"));
  if (tenant === null) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Tenant not found" } }, 404);
  }

  const domains = await repository.listDomains(tenant.tenant.id);
  return c.json({
    success: true,
    data: {
      tenantId: tenant.tenant.id,
      tenantSlug: tenant.tenant.slug,
      primaryDomain: tenant.configuration.primaryDomain,
      domains
    }
  });
});

app.post("/internal/tenants/:tenantId/domains", async (c) => {
  const body = (await c.req.json()) as {
    readonly domain?: string;
    readonly isPrimary?: boolean;
  };
  if (body.domain === undefined || body.domain.trim().length === 0) {
    return c.json({ success: false, error: { code: "DOMAIN_REQUIRED", message: "Domain is required" } }, 400);
  }

  const repository = new D1TenantRepository(c.env.PLATFORM_DB);
  const tenant = await repository.getById(c.req.param("tenantId"));
  if (tenant === null) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Tenant not found" } }, 404);
  }

  const normalizedDomain = normalizeDomain(body.domain);
  await repository.upsertDomain(tenant.tenant.id, normalizedDomain, body.isPrimary === true);
  await ensureGatewayDomainMapping(c.env, normalizedDomain);
  await writeDomainMapping(c.env, repository, tenant.tenant.id, normalizedDomain);
  const domains = await repository.listDomains(tenant.tenant.id);
  return c.json({ success: true, data: { domains } }, 201);
});

app.post("/internal/tenants/:tenantId/domains/set-primary", async (c) => {
  const body = (await c.req.json()) as { readonly domain?: string };
  if (body.domain === undefined || body.domain.trim().length === 0) {
    return c.json({ success: false, error: { code: "DOMAIN_REQUIRED", message: "Domain is required" } }, 400);
  }

  const repository = new D1TenantRepository(c.env.PLATFORM_DB);
  const tenant = await repository.getById(c.req.param("tenantId"));
  if (tenant === null) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Tenant not found" } }, 404);
  }

  const normalizedDomain = normalizeDomain(body.domain);
  await repository.setPrimaryDomain(tenant.tenant.id, normalizedDomain);
  await writeDomainMapping(c.env, repository, tenant.tenant.id, normalizedDomain);
  return c.json({ success: true, data: { primaryDomain: normalizedDomain } });
});

app.post("/internal/tenants/:tenantId/domains/remove", async (c) => {
  const body = (await c.req.json()) as { readonly domain?: string };
  if (body.domain === undefined || body.domain.trim().length === 0) {
    return c.json({ success: false, error: { code: "DOMAIN_REQUIRED", message: "Domain is required" } }, 400);
  }

  const repository = new D1TenantRepository(c.env.PLATFORM_DB);
  const tenant = await repository.getById(c.req.param("tenantId"));
  if (tenant === null) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Tenant not found" } }, 404);
  }

  const normalizedDomain = normalizeDomain(body.domain);
  const domains = await repository.listDomains(tenant.tenant.id);
  const domainToRemove = domains.find((domain) => domain.domain === normalizedDomain);
  if (domainToRemove === undefined) {
    return c.json({ success: false, error: { code: "NOT_FOUND", message: "Domain not found" } }, 404);
  }

  if (domainToRemove.isPrimary && domains.length === 1) {
    return c.json(
      {
        success: false,
        error: {
          code: "PRIMARY_DOMAIN_REQUIRED",
          message: "A tenant must retain one primary domain"
        }
      },
      400
    );
  }

  await repository.removeDomain(tenant.tenant.id, normalizedDomain);
  await c.env.PLATFORM_CONFIG_KV.delete(`tenant-domain:${normalizedDomain}`);
  if (domainToRemove.isPrimary) {
    const remainingDomains = await repository.listDomains(tenant.tenant.id);
    const nextPrimaryDomain = remainingDomains[0];
    if (nextPrimaryDomain !== undefined) {
      await repository.setPrimaryDomain(tenant.tenant.id, nextPrimaryDomain.domain);
      await writeDomainMapping(c.env, repository, tenant.tenant.id, nextPrimaryDomain.domain);
    }
  }

  return c.json({ success: true, data: { removed: true } });
});

export default app;
