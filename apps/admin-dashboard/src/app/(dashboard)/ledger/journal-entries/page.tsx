import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { adminLedgerJournalEntriesPage } from "../../../../features/dashboard/page-data";

export default function LedgerJournalEntriesPage() {
  return <DashboardTablePageTemplate {...adminLedgerJournalEntriesPage} />;
}
