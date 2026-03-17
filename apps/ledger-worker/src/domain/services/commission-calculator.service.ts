export const calculateCommissionCents = (
  grossAmountCents: number,
  commissionRateBasisPoints: number
): number => {
  return Math.floor((grossAmountCents * commissionRateBasisPoints) / 10_000);
};
