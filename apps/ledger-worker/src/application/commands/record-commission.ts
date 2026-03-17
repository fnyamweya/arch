export interface RecordCommissionCommand {
  readonly ledgerId: string;
  readonly tenantId: string;
  readonly amountCents: number;
  readonly currencyCode: string;
}

export const recordCommission = async (
  command: RecordCommissionCommand
): Promise<{ readonly journalEntryId: string }> => {
  return { journalEntryId: `commission:${command.ledgerId}:${command.tenantId}` };
};
