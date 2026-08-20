import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";
import DashboardSidebar from "../(dashboardGroup)/_components/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();
  const profile = user.data?.profile;
  if (!profile) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar user={user} />

      <div className="flex">
        <DashboardSidebar role={profile.role} />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
