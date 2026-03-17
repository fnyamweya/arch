export interface RateLimitState {
  readonly count: number;
  readonly windowStartedAt: number;
}

interface RateLimitRequestBody {
  readonly key: string;
  readonly maxRequests: number;
  readonly windowMs: number;
}

export class RateLimiterDurableObject {
  private readonly state: DurableObjectState;

  public constructor(state: DurableObjectState) {
    this.state = state;
  }

  public async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const body = (await request.json()) as Partial<RateLimitRequestBody>;
    if (
      typeof body.key !== "string" ||
      !Number.isInteger(body.maxRequests) ||
      !Number.isInteger(body.windowMs) ||
      body.maxRequests <= 0 ||
      body.windowMs <= 0
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "INVALID_RATE_LIMIT_REQUEST",
            message: "Invalid rate limit payload"
          }
        }),
        {
          status: 400,
          headers: { "content-type": "application/json" }
        }
      );
    }
    const now: number = Date.now();
    const storageKey: string = `state:${body.key}`;
    const existing: RateLimitState | undefined = await this.state.storage.get<RateLimitState>(storageKey);
    const current: RateLimitState =
      existing === undefined || now - existing.windowStartedAt >= body.windowMs
        ? { count: 0, windowStartedAt: now }
        : existing;
    const updated: RateLimitState = {
      count: current.count + 1,
      windowStartedAt: current.windowStartedAt
    };
    await this.state.storage.put(storageKey, updated);
    if (updated.count > body.maxRequests) {
      return new Response(JSON.stringify({ success: false, error: { code: "RATE_LIMITED", message: "Rate limit exceeded" } }), {
        status: 429,
        headers: { "content-type": "application/json" }
      });
    }
    const resetInMs: number = Math.max(0, body.windowMs - (now - updated.windowStartedAt));
    return new Response(JSON.stringify({ success: true, data: { allowed: true, remaining: body.maxRequests - updated.count, resetInMs } }), {
      headers: { "content-type": "application/json" }
    });
  }
}
