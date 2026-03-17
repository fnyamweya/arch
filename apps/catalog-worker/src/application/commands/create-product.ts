export interface CreateProductCommand {
  readonly tenantId: string;
  readonly vendorId: string;
  readonly title: string;
  readonly slug: string;
}

export interface CreateProductResult {
  readonly productId: string;
}

export const createProduct = async (command: CreateProductCommand): Promise<CreateProductResult> => {
  return { productId: `${command.tenantId}_${command.slug}` };
};
