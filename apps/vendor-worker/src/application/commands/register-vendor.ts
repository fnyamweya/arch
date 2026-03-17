export interface RegisterVendorCommand {
  readonly tenantId: string;
  readonly displayName: string;
  readonly businessName: string;
}

export interface RegisterVendorResult {
  readonly vendorId: string;
}

export const registerVendor = async (
  command: RegisterVendorCommand
): Promise<RegisterVendorResult> => {
  return { vendorId: `${command.tenantId}_${command.displayName.toLowerCase()}` };
};
