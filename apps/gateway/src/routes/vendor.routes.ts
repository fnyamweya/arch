import { Hono } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { GatewayVariables } from "../types";
import { proxyToService } from "../utils/proxy";

export const vendorRoutes = new Hono<{ Bindings: GatewayBindings; Variables: GatewayVariables }>();

vendorRoutes.all("*", async (c) => {
  return proxyToService(c, c.env.VENDOR_WORKER, "/vendors");
});
