import { Hono } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { GatewayVariables } from "../types";
import { proxyToService } from "../utils/proxy";

export const storefrontRoutes = new Hono<{ Bindings: GatewayBindings; Variables: GatewayVariables }>();

storefrontRoutes.all("*", async (c) => {
  return proxyToService(c, c.env.CATALOG_WORKER, "/storefront");
});
