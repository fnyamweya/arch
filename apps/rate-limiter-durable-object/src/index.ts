import { Hono } from "hono";
import { RateLimiterDurableObject } from "./rate-limiter.durable-object";

interface RateLimiterWorkerBindings {
  readonly RATE_LIMITER: DurableObjectNamespace;
}

const app = new Hono<{ Bindings: RateLimiterWorkerBindings }>();

app.get("/health", (c) => c.json({ success: true, data: { service: "rate-limiter-durable-object", status: "ok" } }));
app.post("/limit", async (c) => {
  const body = (await c.req.json()) as {
    readonly key: string;
    readonly maxRequests: number;
    readonly windowMs: number;
  };
  const id: DurableObjectId = c.env.RATE_LIMITER.idFromName(body.key);
  const stub: DurableObjectStub = c.env.RATE_LIMITER.get(id);
  return stub.fetch("https://rate-limiter/limit", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });
});

export { RateLimiterDurableObject };
export default app;
