import type { Context } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { GatewayVariables } from "../types";
import { errorEnvelope, toJson } from "./api-envelope";

export const proxyToService = async (
  c: Context<{ Bindings: GatewayBindings; Variables: GatewayVariables }>,
  target: Fetcher,
  prefixToStrip: string
): Promise<Response> => {
  const currentUrl: URL = new URL(c.req.url);
  const normalizedPrefix: string = prefixToStrip.endsWith("/") ? prefixToStrip.slice(0, -1) : prefixToStrip;
  const proxiedPath: string = currentUrl.pathname.startsWith(normalizedPrefix)
    ? currentUrl.pathname.slice(normalizedPrefix.length) || "/"
    : currentUrl.pathname;
  const targetUrl: URL = new URL(`https://internal${proxiedPath}${currentUrl.search}`);
  const headers: Headers = new Headers(c.req.raw.headers);
  const tenantContext = c.get("tenantContext");
  const authContext = c.get("authContext");
  if (tenantContext !== null) {
    headers.set("x-tenant-id", tenantContext.tenantId);
    headers.set("x-tenant-slug", tenantContext.tenantSlug);
    headers.set("x-tenant-domain", tenantContext.tenantDomain);
  }
  if (authContext !== null) {
    headers.set("x-auth-subject", authContext.subject);
  }
  const proxiedRequest = new Request(targetUrl.toString(), {
    method: c.req.method,
    headers,
    body: c.req.method === "GET" || c.req.method === "HEAD" ? undefined : await c.req.raw.arrayBuffer()
  });
  try {
    return await target.fetch(proxiedRequest);
  } catch {
    return toJson(errorEnvelope("SERVICE_UNAVAILABLE", "Upstream service is not available"), 503);
  }
};
