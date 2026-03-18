import { DashboardOverviewTemplate } from "@arch/ui-kit";
import { adminOverviewPage } from "../../features/dashboard/page-data";

export default function AdminDashboardPage() {
  return <DashboardOverviewTemplate {...adminOverviewPage} />;
}
