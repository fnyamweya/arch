import { DashboardTablePageTemplate } from "@arch/ui-kit";
import { adminUsersPage } from "../../../features/dashboard/page-data";

export default function UsersPage() {
  return <DashboardTablePageTemplate {...adminUsersPage} />;
}
