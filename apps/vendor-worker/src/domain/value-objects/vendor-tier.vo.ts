export const VENDOR_TIER = {
  BRONZE: "BRONZE",
  SILVER: "SILVER",
  GOLD: "GOLD",
  PLATINUM: "PLATINUM"
} as const;

export type VendorTier = (typeof VENDOR_TIER)[keyof typeof VENDOR_TIER];
