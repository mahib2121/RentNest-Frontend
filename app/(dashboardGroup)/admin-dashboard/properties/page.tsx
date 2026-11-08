import { getAllProperties } from "../../_actions/adminPropertiesAction";
import PropertiesTable from "../../_components/PropertiesTable";

export default async function PropertyManagementPage() {
  const properties = await getAllProperties();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-tight">Properties</h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Every listing on RentNest.
        </p>
      </div>

      <PropertiesTable properties={properties} />
    </div>
  );
}
