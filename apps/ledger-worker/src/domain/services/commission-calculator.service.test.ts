import { describe, expect, it } from "vitest";
import { calculateCommissionCents } from "./commission-calculator.service";

describe("calculateCommissionCents", () => {
  it("calculates basis-point commission in integer cents", () => {
    const commission = calculateCommissionCents(10_000, 1200);
    expect(commission).toBe(1200);
  });
});
