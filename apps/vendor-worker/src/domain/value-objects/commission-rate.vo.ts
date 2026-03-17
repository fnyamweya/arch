export type CommissionRateBasisPoints = number & {
  readonly __brand: "CommissionRateBasisPoints";
};

export const toCommissionRateBasisPoints = (value: number): CommissionRateBasisPoints => {
  if (!Number.isInteger(value) || value < 0 || value > 10_000) {
    throw new Error("commission rate must be integer basis points between 0 and 10000");
  }
  return value as CommissionRateBasisPoints;
};
