import { Hono } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { GatewayVariables } from "../types";
import { proxyToService } from "../utils/proxy";

export const catalogRoutes = new Hono<{ Bindings: GatewayBindings; Variables: GatewayVariables }>();

catalogRoutes.all("*", async (c) => {
  return proxyToService(c, c.env.CATALOG_WORKER, "/catalog");
});
