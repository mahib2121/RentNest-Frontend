import { redirect } from "next/navigation";

import { getMe } from "@/service/getMe";

import { getMyProperties } from "../_actions.ts/landlordProperties";
import { getCategories } from "../_actions.ts/categories";

import PropertiesTable from "../_components/PropertiesTable";

export default async function MyPropertiesPage() {
  const user = await getMe();

  if (!user?.success) {
    redirect("/login");
  }

  const propertiesResult = await getMyProperties();
  const categoriesResult = await getCategories();

  if (!propertiesResult.success) {
    return (
      <main className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="font-display text-2xl tracking-tight">
            My properties
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage the listings you have published and the requests they
            have attracted.
          </p>
        </div>

        <div className="rounded-sm border border-status-rejected/40 bg-status-rejected/10 px-4 py-3 text-sm text-status-rejected">
          {propertiesResult.message}
        </div>
      </main>
    );
  }

  const properties = propertiesResult.data;

  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <main className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl tracking-tight">
          My properties
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage the listings you have published and the requests they
          have attracted.
        </p>
      </div>

      <PropertiesTable properties={properties} categories={categories} />
    </main>
  );
}
