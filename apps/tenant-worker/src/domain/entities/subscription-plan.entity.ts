export interface SubscriptionPlanEntity {
  readonly id: string;
  readonly tier: string;
  readonly maxProducts: number;
  readonly maxVendors: number;
  readonly maxStorageMb: number;
}
