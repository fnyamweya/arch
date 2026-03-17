import { describe, expect, it } from "vitest";
import { calculateOrderTotal } from "./order-pricing.service";

describe("calculateOrderTotal", () => {
  it("returns total as sum of components", () => {
    const total = calculateOrderTotal(10_000, 800, 500);
    expect(total.totalCents).toBe(11_300);
  });

  it("throws for negative amount", () => {
    expect(() => calculateOrderTotal(-1, 0, 0)).toThrowError();
  });
});
