import type { MiddlewareHandler } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import { StructuredLogger } from "@arch/observability";
import type { GatewayVariables } from "../types";

const logger = new StructuredLogger();

export const requestLogger: MiddlewareHandler<{
  Bindings: GatewayBindings;
  Variables: GatewayVariables;
}> = async (c, next): Promise<void> => {
  const requestId: string = crypto.randomUUID();
  c.set("requestId", requestId);
  c.set("tenantContext", null);
  c.set("authContext", null);
  const startedAtMs: number = Date.now();
  logger.info("gateway.request.started", {
    requestId,
    method: c.req.method,
    path: c.req.path
  });
  await next();
  logger.info("gateway.request.completed", {
    requestId,
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    elapsedMs: Date.now() - startedAtMs
  });
};
