import { describe, expect, it } from "vitest";
import app from "./index";

const createFetcher = (
  handler: (request: Request) => Promise<Response> | Response
): Fetcher => {
  return {
    fetch: (request: Request) => Promise.resolve(handler(request))
  } as Fetcher;
};

const createGatewayEnv = () => {
  const tenantResponseBody = {
    success: true,
    data: {
      tenantId: "tenant-a",
      tenantSlug: "tenant-a",
      tenantDomain: "tenant-a.africasokoni.co.ke",
      sentryDsn: null
    }
  };
  const authVerifyBody = {
    success: true,
    data: {
      subject: "user-1",
      payload: {
        sub: "user-1",
        sid: "sid-1",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        orgId: null,
        tenantId: "tenant-a",
        platformRole: null,
        tenantRole: "TENANT_ADMIN",
        permissions: []
      }
    }
  };
  const okService = createFetcher(() =>
    new Response(JSON.stringify({ success: true, data: { proxied: true } }), {
      headers: { "content-type": "application/json" }
    })
  );
  return {
    PLATFORM_DB: {} as D1Database,
    PLATFORM_CONFIG_KV: {
      get: async () => null
    } as unknown as KVNamespace,
    RATE_LIMITER_WORKER: createFetcher(() =>
      new Response(JSON.stringify({ success: true, data: { allowed: true, remaining: 100, resetInMs: 1000 } }), {
        headers: { "content-type": "application/json" }
      })
    ),
    AUTH_WORKER: createFetcher((request) => {
      if (request.url.includes("/internal/verify-token")) {
        return new Response(JSON.stringify(authVerifyBody), {
          headers: { "content-type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ success: true, data: { service: "auth" } }), {
        headers: { "content-type": "application/json" }
      });
    }),
    CATALOG_WORKER: okService,
    ORDER_WORKER: okService,
    VENDOR_WORKER: okService,
    TENANT_WORKER: createFetcher((request) => {
      if (request.url.includes("/internal/resolve-tenant")) {
        return new Response(JSON.stringify(tenantResponseBody), {
          headers: { "content-type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { "content-type": "application/json" }
      });
    }),
    LEDGER_WORKER: okService,
    PLATFORM_BASE_DOMAIN: "africasokoni.co.ke",
    PLATFORM_SENTRY_DSN: "https://example@sentry.io/1"
  };
};

describe("gateway integration", () => {
  it("proxies authenticated catalog request", async () => {
    const response = await app.request("https://tenant-a.africasokoni.co.ke/catalog/products", {
      method: "GET",
      headers: {
        authorization: "Bearer header.payload.signature"
      }
    }, createGatewayEnv());
    expect(response.status).toBe(200);
    const body = (await response.json()) as { readonly success: boolean };
    expect(body.success).toBe(true);
  });

  it("rejects missing auth for protected route", async () => {
    const response = await app.request(
      "https://tenant-a.africasokoni.co.ke/orders/orders",
      { method: "GET" },
      createGatewayEnv()
    );
    expect(response.status).toBe(401);
  });
});
