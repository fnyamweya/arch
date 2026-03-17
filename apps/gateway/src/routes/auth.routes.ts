import { Hono } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { GatewayVariables } from "../types";
import { proxyToService } from "../utils/proxy";

export const authRoutes = new Hono<{ Bindings: GatewayBindings; Variables: GatewayVariables }>();

authRoutes.all("*", async (c) => {
  return proxyToService(c, c.env.AUTH_WORKER, "/auth");
});
