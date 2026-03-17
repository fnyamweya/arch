export interface ConfigurePayoutCommand {
  readonly vendorId: string;
  readonly payoutSchedule: "daily" | "weekly" | "biweekly" | "monthly";
  readonly minimumPayoutAmountCents: number;
}

export const configurePayout = async (
  command: ConfigurePayoutCommand
): Promise<{ readonly configured: boolean }> => {
  void command;
  return { configured: true };
};
