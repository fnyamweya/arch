export interface UpdateShippingCommand {
  readonly orderId: string;
  readonly trackingNumber: string;
  readonly carrier: string;
}

export const updateShipping = async (
  command: UpdateShippingCommand
): Promise<{ readonly updated: boolean }> => {
  void command;
  return { updated: true };
};
