export interface PayoutScheduledEvent {
  readonly eventName: "vendor.payout.scheduled";
  readonly vendorId: string;
  readonly payoutId: string;
  readonly occurredAt: string;
}
