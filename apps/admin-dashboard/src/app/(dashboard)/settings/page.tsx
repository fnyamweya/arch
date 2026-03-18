import { DashboardFormPageTemplate } from "@arch/ui-kit";
import { adminSettingsPage } from "../../../features/dashboard/page-data";

export default function SettingsPage() {
  return <DashboardFormPageTemplate {...adminSettingsPage} />;
}
