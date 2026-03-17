import { describe, expect, it } from "vitest";
import { RateLimiterDurableObject } from "./rate-limiter.durable-object";

class InMemoryStorage {
  private readonly map = new Map<string, unknown>();

  public async get<T>(key: string): Promise<T | undefined> {
    return this.map.get(key) as T | undefined;
  }

  public async put(key: string, value: unknown): Promise<void> {
    this.map.set(key, value);
  }
}

class InMemoryState {
  public readonly storage = new InMemoryStorage();
}

describe("RateLimiterDurableObject", () => {
  it("allows request within limit", async () => {
    const state = new InMemoryState() as unknown as DurableObjectState;
    const durableObject = new RateLimiterDurableObject(state);
    const response = await durableObject.fetch(
      new Request("https://rate/limit", {
        method: "POST",
        body: JSON.stringify({
          key: "tenant:a",
          maxRequests: 2,
          windowMs: 60_000
        })
      })
    );
    expect(response.status).toBe(200);
  });
});
