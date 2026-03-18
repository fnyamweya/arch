import { DashboardOverviewTemplate } from "@arch/ui-kit";
import { vendorOverviewPage } from "../../features/dashboard/page-data";

export default function VendorDashboardPage() {
  return <DashboardOverviewTemplate {...vendorOverviewPage} />;
}
