export interface ConfirmPaymentCommand {
  readonly orderId: string;
  readonly paymentReference: string;
}

export const confirmPayment = async (
  command: ConfirmPaymentCommand
): Promise<{ readonly confirmed: boolean }> => {
  void command;
  return { confirmed: true };
};
