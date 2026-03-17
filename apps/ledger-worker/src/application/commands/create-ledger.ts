export interface CreateLedgerCommand {
  readonly tenantId: string;
  readonly name: string;
}

export const createLedger = async (command: CreateLedgerCommand): Promise<{ readonly ledgerId: string }> => {
  return { ledgerId: `${command.tenantId}:${command.name}` };
};
