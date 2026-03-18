import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { createTenantBillingPage } from "../../../../../features/dashboard/page-data";

interface TenantBillingPageProps {
  readonly params: Promise<{
    readonly tenantId: string;
  }>;
}

export default async function TenantBillingPage(props: TenantBillingPageProps) {
  const { tenantId } = await props.params;
  return <DashboardTablePageTemplate {...createTenantBillingPage(tenantId)} />;
}
