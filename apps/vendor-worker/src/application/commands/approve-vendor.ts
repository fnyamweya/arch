export interface ApproveVendorCommand {
  readonly vendorId: string;
  readonly approvedBy: string;
}

export const approveVendor = async (
  command: ApproveVendorCommand
): Promise<{ readonly approved: boolean }> => {
  void command;
  return { approved: true };
};
