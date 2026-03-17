import { describe, expect, it } from "vitest";
import { validateDoubleEntry } from "./double-entry-validator.service";

describe("validateDoubleEntry", () => {
  it("returns true for balanced entries", () => {
    const valid = validateDoubleEntry([
      {
        id: "l1",
        journalEntryId: "j1",
        accountId: "a1",
        debitAmountCents: 1000,
        creditAmountCents: 0
      },
      {
        id: "l2",
        journalEntryId: "j1",
        accountId: "a2",
        debitAmountCents: 0,
        creditAmountCents: 1000
      }
    ]);
    expect(valid).toBe(true);
  });

  it("returns false for unbalanced entries", () => {
    const valid = validateDoubleEntry([
      {
        id: "l1",
        journalEntryId: "j1",
        accountId: "a1",
        debitAmountCents: 1000,
        creditAmountCents: 0
      },
      {
        id: "l2",
        journalEntryId: "j1",
        accountId: "a2",
        debitAmountCents: 0,
        creditAmountCents: 900
      }
    ]);
    expect(valid).toBe(false);
  });
});
