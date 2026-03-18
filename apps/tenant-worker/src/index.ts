import { Hono } from "hono";
import type { TenantBindings } from "@arch/cloudflare-bindings";
import { configureTenant } from "./application/commands/configure-tenant";
import { provisionTenant } from "./application/commands/provision-tenant";
import { suspendTenant } from "./application/commands/suspend-tenant";
import { getTenantConfig } from "./application/queries/get-tenant-config";
import { D1TenantRepository } from "./infrastructure/persistence/d1-tenant.repository";

const app = new Hono<{ Bindings: TenantBindings }>();

app.get("/health", (c) => c.json({ success: true, data: { service: "tenant-worker", status: "ok" } }));
app.post("/tenants", async (c) => {
  const body = (await c.req.json()) as {
    readonly tenantId: string;
    readonly tenantSlug: string;
    readonly displayName: string;
    readonly primaryDomain: string;
  };
  const provisionResult = await provisionTenant({
    tenantId: body.tenantId,
    tenantSlug: body.tenantSlug
  });
  await configureTenant({
    tenantId: body.tenantId,
    displayName: body.displayName,
    primaryDomain: body.primaryDomain
  });
  const repository = new D1TenantRepository(c.env.PLATFORM_DB);
  await repository.save({
    tenant: {
      id: body.tenantId,
      slug: body.tenantSlug,
      displayName: body.displayName,
      status: "ACTIVE"
    },
    configuration: {
      tenantId: body.tenantId,
      primaryDomain: body.primaryDomain,
      sentryDsn: null,
      clerkPublishableKey: "",
      clerkAuthDomain: null,
      clerkProxyUrl: null,
      clerkJwksUrl: null
    }
  });
  await c.env.PLATFORM_CONFIG_KV.put(
    `tenant-domain:${body.primaryDomain.toLowerCase()}`,
    JSON.stringify({
      tenantId: body.tenantId,
      tenantSlug: body.tenantSlug,
      tenantDomain: body.primaryDomain,
      sentryDsn: null,
      clerkPublishableKey: null,
      clerkAuthDomain: null,
      clerkProxyUrl: null
    })
  );
  return c.json(
    {
      success: true,
      data: provisionResult
    },
    201
  );
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

interface TenantResolutionRecord {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly tenantDomain: string;
  readonly sentryDsn?: string | null;
  readonly clerkPublishableKey?: string | null;
  readonly clerkAuthDomain?: string | null;
  readonly clerkProxyUrl?: string | null;
}

const normalizeDomain = (domain: string): string => domain.trim().toLowerCase();

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
    sentryDsn: tenant.configuration.sentryDsn,
    clerkPublishableKey: tenant.configuration.clerkPublishableKey || null,
    clerkAuthDomain: tenant.configuration.clerkAuthDomain,
    clerkProxyUrl: tenant.configuration.clerkProxyUrl
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
      sentryDsn: tenant.configuration.sentryDsn,
      clerkPublishableKey: tenant.configuration.clerkPublishableKey || null,
      clerkAuthDomain: tenant.configuration.clerkAuthDomain,
      clerkProxyUrl: tenant.configuration.clerkProxyUrl
    } satisfies TenantResolutionRecord)
  );
};

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
  const tenant = await repository.getById(body.domain.replace(".archcommerce.com", ""));
  if (tenant !== null) {
    return c.json({
      success: true,
      data: {
        tenantId: tenant.tenant.id,
        tenantSlug: tenant.tenant.slug,
        tenantDomain: tenant.configuration.primaryDomain,
        sentryDsn: tenant.configuration.sentryDsn,
        clerkPublishableKey: tenant.configuration.clerkPublishableKey,
        clerkAuthDomain: tenant.configuration.clerkAuthDomain,
        clerkProxyUrl: tenant.configuration.clerkProxyUrl
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
