export interface ManageVariantCommand {
  readonly productId: string;
  readonly variantId: string | null;
  readonly sku: string;
  readonly priceAmountCents: number;
  readonly inventoryQuantity: number;
}

export const manageVariant = async (command: ManageVariantCommand): Promise<{ readonly variantId: string }> => {
  return { variantId: command.variantId ?? `${command.productId}:${command.sku}` };
};
