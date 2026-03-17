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
      clerkPublishableKey: ""
    }
  });
  await c.env.PLATFORM_CONFIG_KV.put(
    `tenant-domain:${body.primaryDomain.toLowerCase()}`,
    JSON.stringify({
      tenantId: body.tenantId,
      tenantSlug: body.tenantSlug,
      tenantDomain: body.primaryDomain,
      sentryDsn: null,
      clerkPublishableKey: null
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
}

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
  const recordRaw: string | null = await c.env.PLATFORM_CONFIG_KV.get(`tenant-domain:${body.domain.toLowerCase()}`);
  if (recordRaw !== null) {
    const record = JSON.parse(recordRaw) as TenantResolutionRecord;
    return c.json({
      success: true,
      data: record
    });
  }
  const repository = new D1TenantRepository(c.env.PLATFORM_DB);
  const tenant = await repository.getById(body.domain.replace(".archcommerce.com", ""));
  if (tenant !== null) {
    return c.json({
      success: true,
      data: {
        tenantId: tenant.tenant.id,
        tenantSlug: tenant.tenant.slug,
        tenantDomain: tenant.configuration.primaryDomain,
        sentryDsn: tenant.configuration.sentryDsn,
        clerkPublishableKey: tenant.configuration.clerkPublishableKey
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

export default app;
