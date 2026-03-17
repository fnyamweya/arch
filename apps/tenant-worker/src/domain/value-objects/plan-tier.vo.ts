export const PLAN_TIER = {
  STARTER: "STARTER",
  GROWTH: "GROWTH",
  SCALE: "SCALE",
  ENTERPRISE: "ENTERPRISE"
} as const;

export type PlanTier = (typeof PLAN_TIER)[keyof typeof PLAN_TIER];
