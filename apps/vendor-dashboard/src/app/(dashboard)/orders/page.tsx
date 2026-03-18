import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { vendorOrdersPage } from "../../../features/dashboard/page-data";

export default function VendorOrdersPage() {
  return <DashboardTablePageTemplate {...vendorOrdersPage} />;
}
