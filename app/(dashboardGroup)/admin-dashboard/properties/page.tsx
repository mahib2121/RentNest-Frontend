import { getAllProperties } from "../../_actions/adminPropertiesAction";
import PropertiesTable from "../../_components/PropertiesTable";

const PropertyManagementPage = async () => {
  const properties = await getAllProperties();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground">Manage all RentNest properties</p>
      </div>

      {/* Changed 'initialProperties' to 'properties' to match your component's props */}
      <PropertiesTable properties={properties} />
    </div>
  );
};

export default PropertyManagementPage;
