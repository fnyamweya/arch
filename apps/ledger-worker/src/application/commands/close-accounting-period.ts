export interface CloseAccountingPeriodCommand {
  readonly ledgerId: string;
  readonly periodKey: string;
}

export const closeAccountingPeriod = async (
  command: CloseAccountingPeriodCommand
): Promise<{ readonly periodKey: string; readonly closed: boolean }> => {
  return { periodKey: command.periodKey, closed: true };
};
