export interface InviteVendorMemberCommand {
  readonly vendorId: string;
  readonly email: string;
  readonly role: string;
}

export const inviteVendorMember = async (
  command: InviteVendorMemberCommand
): Promise<{ readonly invited: boolean }> => {
  void command;
  return { invited: true };
};
