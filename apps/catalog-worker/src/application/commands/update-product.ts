export interface UpdateProductCommand {
  readonly productId: string;
  readonly title: string;
  readonly description: string | null;
}

export const updateProduct = async (command: UpdateProductCommand): Promise<{ readonly updated: boolean }> => {
  void command;
  return { updated: true };
};
