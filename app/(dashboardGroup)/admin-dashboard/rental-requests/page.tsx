import { getAdminRentalRequests } from "../../_actions/adminRenterRequest";
import RentalRequestsTable from "../../_components/RentalRequestsTable";

const RentalRequestsPage = async () => {
  const requests = await getAdminRentalRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-tight">
          Rental requests
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Every rental request submitted by tenants.
        </p>
      </div>

      <RentalRequestsTable requests={requests} />
    </div>
  );
};

export default RentalRequestsPage;
