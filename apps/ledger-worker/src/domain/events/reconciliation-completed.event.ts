export interface ReconciliationCompletedEvent {
  readonly eventName: "ledger.reconciliation.completed";
  readonly reconciliationId: string;
  readonly accountId: string;
  readonly periodKey: string;
  readonly occurredAt: string;
}
