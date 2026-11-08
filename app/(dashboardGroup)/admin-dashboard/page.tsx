import { getAdminDashboard } from "../_actions/adminAction";
import AdminDashboard from "../_components/adminDashboard";

const AdminDashboardPage = async () => {
  const dashboardStats = await getAdminDashboard();

  return (
    <main className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl tracking-tight">Admin dashboard</h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Activity across the RentNest platform.
        </p>
      </div>

      <AdminDashboard stats={dashboardStats} />
    </main>
  );
};

export default AdminDashboardPage;
