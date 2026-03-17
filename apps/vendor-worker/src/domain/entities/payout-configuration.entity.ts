export interface PayoutConfigurationEntity {
  readonly id: string;
  readonly vendorId: string;
  readonly payoutSchedule: string;
  readonly minimumPayoutAmountCents: number;
}
