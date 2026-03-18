import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { vendorAnalyticsPage } from "../../../features/dashboard/page-data";

export default function VendorAnalyticsPage() {
  return <DashboardTablePageTemplate {...vendorAnalyticsPage} />;
}
