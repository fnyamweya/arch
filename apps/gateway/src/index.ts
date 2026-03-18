import { Hono } from "hono";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import { createGatewayRouter } from "./router";
import type { GatewayVariables } from "./types";
import { errorEnvelope, toJson } from "./utils/api-envelope";
import { openApiSpec } from "./openapi/spec";

const app = new Hono<{ Bindings: GatewayBindings; Variables: GatewayVariables }>();

// CORS at app level so all responses (including middleware short-circuits) get headers
app.use("*", cors());

// OpenAPI spec & Swagger UI (before router so they bypass tenant/auth middleware)
app.get("/openapi.json", (c) => c.json(openApiSpec));
app.get("/docs", swaggerUI({ url: "/openapi.json" }));

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
