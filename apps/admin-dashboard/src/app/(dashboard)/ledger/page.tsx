import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { adminLedgerPage } from "../../../features/dashboard/page-data";

export default function LedgerPage() {
  return <DashboardTablePageTemplate {...adminLedgerPage} />;
}
