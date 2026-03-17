export interface ReconciliationEntity {
  readonly id: string;
  readonly accountId: string;
  readonly periodKey: string;
  readonly status: string;
  readonly reconciledAt: string;
}
