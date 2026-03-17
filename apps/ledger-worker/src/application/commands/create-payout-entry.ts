export interface CreatePayoutEntryCommand {
  readonly ledgerId: string;
  readonly vendorId: string;
  readonly amountCents: number;
  readonly currencyCode: string;
}

export const createPayoutEntry = async (
  command: CreatePayoutEntryCommand
): Promise<{ readonly journalEntryId: string }> => {
  return { journalEntryId: `payout:${command.ledgerId}:${command.vendorId}` };
};
