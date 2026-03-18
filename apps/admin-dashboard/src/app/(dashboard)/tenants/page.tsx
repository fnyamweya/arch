import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { adminTenantsPage } from "../../../features/dashboard/page-data";

export default function TenantsPage() {
  return <DashboardTablePageTemplate {...adminTenantsPage} />;
}
