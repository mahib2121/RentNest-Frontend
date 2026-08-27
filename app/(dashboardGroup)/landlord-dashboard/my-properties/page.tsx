import { redirect } from "next/navigation";

import { getMe } from "@/service/getMe";

import { getMyProperties } from "../_actions.ts/landlordProperties";
import { getCategories } from "../_actions.ts/categories";

import PropertiesTable from "../_components/PropertiesTable";

export default async function LandlordDashboardPage() {
  const user = await getMe();

  if (!user?.success) {
    redirect("/login");
  }

  const propertiesResult = await getMyProperties();
  const categoriesResult = await getCategories();

  // Handle property API failure
  if (!propertiesResult.success) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Landlord Dashboard</h1>

          <p className="mt-2 text-muted-foreground">
            Manage your properties and rental requests.
          </p>
        </div>

        <div className="rounded-lg border p-6 text-red-600">
          {propertiesResult.message}
        </div>
      </main>
    );
  }

  // Categories are needed for Add Property
  // If category API fails, use an empty array.
  const properties = propertiesResult.data;

  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Landlord Dashboard</h1>

        <p className="mt-2 text-muted-foreground">
          Manage your properties and rental requests.
        </p>
      </div>

      <PropertiesTable properties={properties} categories={categories} />
    </main>
  );
}
