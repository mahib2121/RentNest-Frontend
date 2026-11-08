import { redirect } from "next/navigation";

import { getMe } from "@/service/getMe";
import { getMyRentalRequests } from "../_actions/tenantRequests";
import RentalRequests from "./_components/RentalRequests";

export default async function TenantDashboardPage() {
  const user = await getMe();

  if (!user?.success) {
    redirect("/login");
  }

  const result = await getMyRentalRequests();

  return (
    <main className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl tracking-tight">
          Your rental requests
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Track the properties you have applied for and complete any pending
          payments.
        </p>
      </div>

      {result.success ? (
        <RentalRequests requests={result.data} />
      ) : (
        <div className="rounded-sm border border-status-rejected/40 bg-status-rejected/10 px-4 py-3 text-sm text-status-rejected">
          {result.message}
        </div>
      )}
    </main>
  );
}
