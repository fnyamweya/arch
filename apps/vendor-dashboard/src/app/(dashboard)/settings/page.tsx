import { DashboardFormPageTemplate } from "@arch/ui-kit";
import { vendorSettingsPage } from "../../../features/dashboard/page-data";

export default function VendorSettingsPage() {
  return <DashboardFormPageTemplate {...vendorSettingsPage} />;
}
