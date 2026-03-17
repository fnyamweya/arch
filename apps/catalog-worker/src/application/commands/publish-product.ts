export interface PublishProductCommand {
  readonly productId: string;
}

export const publishProduct = async (command: PublishProductCommand): Promise<{ readonly published: boolean }> => {
  void command;
  return { published: true };
};
