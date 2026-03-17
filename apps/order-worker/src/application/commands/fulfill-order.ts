export interface FulfillOrderCommand {
  readonly orderId: string;
  readonly trackingNumber: string;
}

export const fulfillOrder = async (
  command: FulfillOrderCommand
): Promise<{ readonly fulfilled: boolean }> => {
  void command;
  return { fulfilled: true };
};
