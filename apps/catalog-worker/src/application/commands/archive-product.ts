export interface ArchiveProductCommand {
  readonly productId: string;
  readonly reason: string;
}

export const archiveProduct = async (command: ArchiveProductCommand): Promise<{ readonly archived: boolean }> => {
  void command;
  return { archived: true };
};
