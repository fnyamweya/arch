export interface SyncClerkUserCommand {
  readonly clerkUserId: string;
}

export const syncClerkUser = async (command: SyncClerkUserCommand): Promise<void> => {
  void command;
};
