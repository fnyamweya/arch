export interface AdminDashboardStore {
  readonly selectedTenantId: string | null;
}

export const initialAdminDashboardStore: AdminDashboardStore = {
  selectedTenantId: null
};
