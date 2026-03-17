import { Hono } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { GatewayVariables } from "../types";
import { proxyToService } from "../utils/proxy";

export const adminRoutes = new Hono<{ Bindings: GatewayBindings; Variables: GatewayVariables }>();

adminRoutes.all("*", async (c) => {
  return proxyToService(c, c.env.TENANT_WORKER, "/admin");
});
