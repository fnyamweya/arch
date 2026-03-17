export interface CancelOrderCommand {
  readonly orderId: string;
  readonly reason: string;
}

export const cancelOrder = async (
  command: CancelOrderCommand
): Promise<{ readonly cancelled: boolean }> => {
  void command;
  return { cancelled: true };
};
