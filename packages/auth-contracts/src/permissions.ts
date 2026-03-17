export const PERMISSIONS = {
  MANAGE_TENANTS: "manage:tenants",
  MANAGE_TENANT_CONFIG: "manage:tenant-config",
  MANAGE_VENDORS: "manage:vendors",
  MANAGE_PRODUCTS: "manage:products",
  MANAGE_ORDERS: "manage:orders",
  VIEW_LEDGER: "view:ledger",
  MANAGE_LEDGER: "manage:ledger"
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
