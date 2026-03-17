export interface AccountingPeriodsSchemaRecord {
  readonly id: string;
  readonly periodKey: string;
  readonly status: string;
  readonly closedAt: string | null;
}
