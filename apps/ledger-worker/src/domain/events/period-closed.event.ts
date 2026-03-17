export interface PeriodClosedEvent {
  readonly eventName: "ledger.period.closed";
  readonly ledgerId: string;
  readonly periodKey: string;
  readonly occurredAt: string;
}
