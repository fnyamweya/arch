import type { MiddlewareHandler } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { GatewayVariables, ResolvedTenantContext } from "../types";
import { errorEnvelope, toJson } from "../utils/api-envelope";

interface TenantResolutionRecord {
  readonly tenantId: string;
  readonly tenantSlug: string;
  readonly tenantDomain: string;
  readonly sentryDsn?: string | null;
}

const normalizeBaseDomain = (domain: string): string => domain.trim().toLowerCase().replace(/^\.+/, "").replace(/\.+$/, "");

const resolveTenantContext = async (host: string, env: GatewayBindings): Promise<ResolvedTenantContext | null> => {
  try {
    const tenantWorkerResponse: Response = await env.TENANT_WORKER.fetch("https://tenant-worker/internal/resolve-tenant", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ domain: host })
    });
    if (tenantWorkerResponse.ok) {
      const responseBody = (await tenantWorkerResponse.json()) as {
        readonly success: boolean;
        readonly data?: TenantResolutionRecord;
      };
      if (responseBody.success && responseBody.data !== undefined) {
        const parsed: TenantResolutionRecord = responseBody.data;
        return {
          tenantId: parsed.tenantId,
          tenantSlug: parsed.tenantSlug,
          tenantDomain: parsed.tenantDomain,
          sentryDsn: parsed.sentryDsn ?? null
        };
      }
    }
  } catch {
    // Service binding unavailable (e.g. local dev) — fall through to other resolution methods
  }
  const serialized: string | null = await env.PLATFORM_CONFIG_KV.get(`tenant-domain:${host}`);
  if (serialized !== null) {
    const parsed: TenantResolutionRecord = JSON.parse(serialized) as TenantResolutionRecord;
    return {
      tenantId: parsed.tenantId,
      tenantSlug: parsed.tenantSlug,
      tenantDomain: parsed.tenantDomain,
      sentryDsn: parsed.sentryDsn ?? null
    };
  }
  const domainSuffix = `.${normalizeBaseDomain(env.PLATFORM_BASE_DOMAIN)}`;
  if (host.endsWith(domainSuffix)) {
    const tenantSlug = host.slice(0, host.length - domainSuffix.length);
    if (tenantSlug.length > 0) {
      return {
        tenantId: tenantSlug,
        tenantSlug,
        tenantDomain: host,
        sentryDsn: null
      };
    }
  }
  // Local development fallback
  const localHosts = ["localhost", "127.0.0.1", "0.0.0.0"];
  const hostWithoutPort = host.split(":")[0] ?? host;
  if (localHosts.includes(hostWithoutPort)) {
    return {
      tenantId: "dev-tenant",
      tenantSlug: "dev",
      tenantDomain: host,
      sentryDsn: null
    };
  }
  return null;
};

export const tenantResolver: MiddlewareHandler<{
  Bindings: GatewayBindings;
  Variables: GatewayVariables;
}> = async (c, next): Promise<void> => {
  const host: string = new URL(c.req.url).host.toLowerCase();
  const isPublicPath: boolean = c.req.path.startsWith("/auth");
  const tenantContext: ResolvedTenantContext | null = await resolveTenantContext(host, c.env);
  c.set("tenantContext", tenantContext);
  if (!isPublicPath && tenantContext === null) {
    c.res = toJson(
      errorEnvelope("TENANT_NOT_RESOLVED", "Unable to resolve tenant from request host", {
        host
      }),
      404
    );
    return;
  }
  await next();
};
