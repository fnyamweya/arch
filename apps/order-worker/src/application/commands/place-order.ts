export interface PlaceOrderCommand {
  readonly tenantId: string;
  readonly customerId: string;
  readonly currencyCode: string;
  readonly totalAmountCents: number;
}

export interface PlaceOrderResult {
  readonly orderId: string;
}

export const placeOrder = async (command: PlaceOrderCommand): Promise<PlaceOrderResult> => {
  return { orderId: `${command.tenantId}_${command.customerId}` };
};
