import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { createTenantInfrastructurePage } from "../../../../../features/dashboard/page-data";

interface TenantInfrastructurePageProps {
  readonly params: Promise<{
    readonly tenantId: string;
  }>;
}

export default async function TenantInfrastructurePage(props: TenantInfrastructurePageProps) {
  const { tenantId } = await props.params;
  return <DashboardTablePageTemplate {...createTenantInfrastructurePage(tenantId)} />;
}
