import type { MiddlewareHandler } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import { createSentryClient, resolveSentryDsn } from "@arch/observability";
import type { GatewayVariables } from "../types";
import { errorEnvelope, toJson } from "../utils/api-envelope";

export const sentryMiddleware: MiddlewareHandler<{
  Bindings: GatewayBindings;
  Variables: GatewayVariables;
}> = async (c, next): Promise<void> => {
  const tenantContext = c.get("tenantContext");
  const sentryDsn: string = resolveSentryDsn(tenantContext?.sentryDsn ?? null, c.env.PLATFORM_SENTRY_DSN);
  const sentryClient = createSentryClient({
    dsn: sentryDsn,
    environment: "gateway",
    tracesSampleRate: 0.1
  });
  if (tenantContext !== null) {
    sentryClient.setTag("tenant_id", tenantContext.tenantId);
    sentryClient.setTag("tenant_slug", tenantContext.tenantSlug);
  }
  try {
    await next();
  } catch (error: unknown) {
    sentryClient.captureException(error);
    c.res = toJson(errorEnvelope("INTERNAL_ERROR", "Unhandled request error"), 500);
  }
};
