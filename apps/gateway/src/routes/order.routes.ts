import { Hono } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { GatewayVariables } from "../types";
import { proxyToService } from "../utils/proxy";

export const orderRoutes = new Hono<{ Bindings: GatewayBindings; Variables: GatewayVariables }>();

orderRoutes.all("*", async (c) => {
  return proxyToService(c, c.env.ORDER_WORKER, "/orders");
});
