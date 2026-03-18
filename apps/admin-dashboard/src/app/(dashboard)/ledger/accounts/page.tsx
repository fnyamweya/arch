import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { adminLedgerAccountsPage } from "../../../../features/dashboard/page-data";

export default function LedgerAccountsPage() {
  return <DashboardTablePageTemplate {...adminLedgerAccountsPage} />;
}
