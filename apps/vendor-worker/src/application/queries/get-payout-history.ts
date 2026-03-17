export interface PayoutHistoryItem {
  readonly payoutId: string;
  readonly amountCents: number;
  readonly paidAt: string;
}

export const getPayoutHistory = async (
  vendorId: string
): Promise<ReadonlyArray<PayoutHistoryItem>> => {
  void vendorId;
  return [];
};
