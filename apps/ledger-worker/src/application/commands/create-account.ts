export interface CreateAccountCommand {
  readonly ledgerId: string;
  readonly code: string;
  readonly name: string;
  readonly accountType: string;
}

export const createAccount = async (
  command: CreateAccountCommand
): Promise<{ readonly accountId: string }> => {
  return { accountId: `${command.ledgerId}:${command.code}` };
};
