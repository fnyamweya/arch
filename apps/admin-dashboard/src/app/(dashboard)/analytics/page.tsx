import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { adminAnalyticsPage } from "../../../features/dashboard/page-data";

export default function AnalyticsPage() {
  return <DashboardTablePageTemplate {...adminAnalyticsPage} />;
}
