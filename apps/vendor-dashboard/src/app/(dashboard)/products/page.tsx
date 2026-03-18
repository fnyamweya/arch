import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { vendorProductsPage } from "../../../features/dashboard/page-data";

export default function VendorProductsPage() {
  return <DashboardTablePageTemplate {...vendorProductsPage} />;
}
