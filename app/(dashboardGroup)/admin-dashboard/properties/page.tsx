import { getAllProperties } from "../../_actions/adminPropertiesAction";
import PropertiesTable from "../../_components/PropertiesTable";

export default async function PropertyManagementPage() {
  const properties = await getAllProperties();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground">Manage all RentNest properties.</p>
      </div>

      <PropertiesTable properties={properties} />
    </div>
  );
}
