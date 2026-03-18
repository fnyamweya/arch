import { DashboardFormPageTemplate } from "@arch/ui-kit";
import { createTenantConfigurationPage } from "../../../../../features/dashboard/page-data";

interface TenantConfigurationPageProps {
  readonly params: Promise<{
    readonly tenantId: string;
  }>;
}

export default async function TenantConfigurationPage(props: TenantConfigurationPageProps) {
  const { tenantId } = await props.params;
  return <DashboardFormPageTemplate {...createTenantConfigurationPage(tenantId)} />;
}
