import type { MiddlewareHandler } from "hono";
import type { GatewayBindings } from "@arch/cloudflare-bindings";
import type { GatewayVariables } from "../types";
import { errorEnvelope, toJson } from "../utils/api-envelope";

interface RateLimitResponse {
  readonly success: boolean;
  readonly data?: {
    readonly allowed: boolean;
    readonly remaining: number;
    readonly resetInMs: number;
  };
}

export const rateLimiter: MiddlewareHandler<{
  Bindings: GatewayBindings;
  Variables: GatewayVariables;
}> = async (c, next): Promise<void> => {
  const tenantContext = c.get("tenantContext");
  const clientIp: string = c.req.header("cf-connecting-ip") ?? "unknown";
  const limiterKey: string = `${tenantContext?.tenantId ?? "platform"}:${clientIp}`;
  try {
    const response: Response = await c.env.RATE_LIMITER_WORKER.fetch("https://rate-limiter-worker/limit", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        key: limiterKey,
        maxRequests: 120,
        windowMs: 60_000
      })
    });
    if (response.ok) {
      const body = (await response.json()) as RateLimitResponse;
      if (body.success && body.data !== undefined) {
        if (!body.data.allowed) {
          c.res = toJson(errorEnvelope("RATE_LIMITED", "Too many requests"), 429);
          return;
        }
        c.header("x-rate-limit-remaining", String(body.data.remaining));
        c.header("x-rate-limit-reset-ms", String(body.data.resetInMs));
      }
    }
    // Non-ok responses (e.g. service not connected) fall through — fail-open
  } catch {
    // Fail-open: allow request if rate limiter service is unavailable (e.g. local dev)
  }
  await next();
};
