import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { adminLedgerReportsPage } from "../../../../features/dashboard/page-data";

export default function LedgerReportsPage() {
  return <DashboardTablePageTemplate {...adminLedgerReportsPage} />;
}
