import { Hono } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import { createGatewayRouter } from "./router";
import type { GatewayVariables } from "./types";
import { errorEnvelope, toJson } from "./utils/api-envelope";

const app = new Hono<{ Bindings: GatewayBindings; Variables: GatewayVariables }>();

app.route("/", createGatewayRouter());
app.notFound(() => {
  return toJson(errorEnvelope("NOT_FOUND", "Route not found"), 404);
});
app.onError((error) => {
  return toJson(
    errorEnvelope("INTERNAL_ERROR", "Unhandled gateway error", {
      message: error.message
    }),
    500
  );
});

export default app;
