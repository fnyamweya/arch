import { DashboardFormPageTemplate } from "@arch/ui-kit";
import { adminCreateTenantPage } from "../../../../features/dashboard/page-data";

export default function CreateTenantPage() {
  return <DashboardFormPageTemplate {...adminCreateTenantPage} />;
}
