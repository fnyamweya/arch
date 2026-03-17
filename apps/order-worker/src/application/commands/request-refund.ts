export interface RequestRefundCommand {
  readonly orderId: string;
  readonly amountCents: number;
  readonly reason: string;
}

export const requestRefund = async (
  command: RequestRefundCommand
): Promise<{ readonly refundId: string }> => {
  return { refundId: `refund:${command.orderId}` };
};
