import { Hono } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { GatewayVariables } from "../types";
import { proxyToService } from "../utils/proxy";

export const ledgerRoutes = new Hono<{ Bindings: GatewayBindings; Variables: GatewayVariables }>();

ledgerRoutes.all("*", async (c) => {
  return proxyToService(c, c.env.LEDGER_WORKER, "/ledger");
});
