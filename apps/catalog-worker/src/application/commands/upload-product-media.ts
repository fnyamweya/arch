export interface UploadProductMediaCommand {
  readonly productId: string;
  readonly mediaKey: string;
}

export const uploadProductMedia = async (
  command: UploadProductMediaCommand
): Promise<{ readonly uploaded: boolean }> => {
  void command;
  return { uploaded: true };
};
