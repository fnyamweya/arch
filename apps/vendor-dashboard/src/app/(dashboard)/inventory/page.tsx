import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { vendorInventoryPage } from "../../../features/dashboard/page-data";

export default function VendorInventoryPage() {
  return <DashboardTablePageTemplate {...vendorInventoryPage} />;
}
