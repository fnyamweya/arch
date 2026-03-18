import { DashboardFormPageTemplate } from "@arch/ui-kit";
import { createTenantSentrySettingsPage } from "../../../../../features/dashboard/page-data";

interface TenantSentrySettingsPageProps {
  readonly params: Promise<{
    readonly tenantId: string;
  }>;
}

export default async function TenantSentrySettingsPage(props: TenantSentrySettingsPageProps) {
  const { tenantId } = await props.params;
  return <DashboardFormPageTemplate {...createTenantSentrySettingsPage(tenantId)} />;
}
