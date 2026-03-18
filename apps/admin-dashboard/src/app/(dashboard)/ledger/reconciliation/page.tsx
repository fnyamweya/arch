import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { adminLedgerReconciliationPage } from "../../../../features/dashboard/page-data";

export default function LedgerReconciliationPage() {
  return <DashboardTablePageTemplate {...adminLedgerReconciliationPage} />;
}
