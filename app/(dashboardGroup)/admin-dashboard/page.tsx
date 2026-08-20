import { getAdminDashboard } from "../_actions/adminAction";
import AdminDashboard from "../_components/adminDashboard";

const AdminDashboardPage = async () => {
  const dashboardStats = await getAdminDashboard();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-2xl border border-border/60 bg-background p-5 shadow-sm sm:p-6 lg:p-8">
          <AdminDashboard stats={dashboardStats} />
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
