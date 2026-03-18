import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { vendorPayoutsPage } from "../../../features/dashboard/page-data";

export default function VendorPayoutsPage() {
  return <DashboardTablePageTemplate {...vendorPayoutsPage} />;
}
