import { getAdminRentalRequests } from "../../_actions/adminRenterRequest";
import RentalRequestsTable from "../../_components/RentalRequestsTable";

const RentalRequestsPage = async () => {
  const requests = await getAdminRentalRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rental Requests</h1>
        <p className="text-muted-foreground">
          Manage all rental requests from tenants.
        </p>
      </div>
      <RentalRequestsTable requests={requests} />
    </div>
  );
};

export default RentalRequestsPage;
