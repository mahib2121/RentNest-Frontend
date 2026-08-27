import { redirect } from "next/navigation";

import { getMe } from "@/service/getMe";
import RentalRequests from "../_components/RentalRequests";
import { getLandlordRentalRequests } from "../_actions/rentalRequests";



export default async function LandlordDashboardPage() {
  const user = await getMe();

  if (!user?.success) {
    redirect("/login");
  }

  const result = await getLandlordRentalRequests();

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Landlord Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Manage rental requests from tenants.
        </p>
      </div>

      {!result.success ? (
        <div className="rounded border p-6 text-red-600">{result.message}</div>
      ) : (
        <RentalRequests requests={result.data} />
      )}
    </main>
  );
}
