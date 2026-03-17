export interface UpdateVendorProfileCommand {
  readonly vendorId: string;
  readonly displayName: string;
  readonly businessName: string;
}

export const updateVendorProfile = async (
  command: UpdateVendorProfileCommand
): Promise<{ readonly updated: boolean }> => {
  void command;
  return { updated: true };
};
