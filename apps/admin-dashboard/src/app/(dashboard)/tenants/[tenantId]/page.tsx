import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { createTenantDetailPage } from "../../../../features/dashboard/page-data";

interface TenantPageProps {
  readonly params: Promise<{
    readonly tenantId: string;
  }>;
}

export default async function TenantDetailPage(props: TenantPageProps) {
  const { tenantId } = await props.params;
  return <DashboardTablePageTemplate {...createTenantDetailPage(tenantId)} />;
}
