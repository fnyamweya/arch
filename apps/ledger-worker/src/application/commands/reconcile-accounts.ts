export interface ReconcileAccountsCommand {
  readonly ledgerId: string;
  readonly accountId: string;
  readonly periodKey: string;
}

export const reconcileAccounts = async (
  command: ReconcileAccountsCommand
): Promise<{ readonly reconciliationId: string }> => {
  return { reconciliationId: `${command.accountId}:${command.periodKey}` };
};
