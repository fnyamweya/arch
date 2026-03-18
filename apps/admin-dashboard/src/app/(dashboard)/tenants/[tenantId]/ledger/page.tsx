import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { createTenantLedgerPage } from "../../../../../features/dashboard/page-data";

interface TenantLedgerPageProps {
  readonly params: Promise<{
    readonly tenantId: string;
  }>;
}

export default async function TenantLedgerPage(props: TenantLedgerPageProps) {
  const { tenantId } = await props.params;
  return <DashboardTablePageTemplate {...createTenantLedgerPage(tenantId)} />;
}
