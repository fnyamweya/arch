export interface SuspendVendorCommand {
  readonly vendorId: string;
  readonly reason: string;
}

export const suspendVendor = async (
  command: SuspendVendorCommand
): Promise<{ readonly suspended: boolean }> => {
  void command;
  return { suspended: true };
};
