export interface VendorDashboardStore {
  readonly selectedVendorId: string | null;
}

export const initialVendorDashboardStore: VendorDashboardStore = {
  selectedVendorId: null
};
