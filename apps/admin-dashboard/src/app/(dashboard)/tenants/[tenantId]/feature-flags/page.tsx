import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { createTenantFeatureFlagsPage } from "../../../../../features/dashboard/page-data";

interface TenantFeatureFlagsPageProps {
  readonly params: Promise<{
    readonly tenantId: string;
  }>;
}

export default async function TenantFeatureFlagsPage(props: TenantFeatureFlagsPageProps) {
  const { tenantId } = await props.params;
  return <DashboardTablePageTemplate {...createTenantFeatureFlagsPage(tenantId)} />;
}
