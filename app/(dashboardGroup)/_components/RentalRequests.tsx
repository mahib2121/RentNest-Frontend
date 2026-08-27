import RentalRequestActions from "./RentalRequestActions";

import type { LandlordRentalRequest } from "../_actions/rentalRequests";

type Props = {
  requests: LandlordRentalRequest[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RentalRequests({ requests }: Props) {
  if (requests.length === 0) {
    return (
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Rental Requests</h2>

        <p className="mt-2 text-gray-600">No rental requests found.</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Rental Requests</h2>

      <div className="space-y-6">
        {requests.map((request) => (
          <div key={request.id} className="rounded-lg border p-6 shadow-sm">
            {/* Property + Status */}
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <h3 className="text-xl font-semibold">
                  {request.property?.title ?? "Unknown Property"}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  {request.property?.address ?? "Address unavailable"}
                  {request.property?.city ? `, ${request.property.city}` : ""}
                </p>
              </div>

              <div>
                <span className="rounded border px-3 py-1 text-sm">
                  {request.status}
                </span>
              </div>
            </div>

            {/* Request Details */}
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {/* Tenant */}
              <div>
                <p className="text-sm text-gray-500">Tenant</p>

                <p className="font-semibold">
                  {request.tenant?.name ?? "Unknown tenant"}
                </p>

                <p className="text-sm text-gray-600">
                  {request.tenant?.email ?? "No email available"}
                </p>
              </div>

              {/* Move-in Date */}
              <div>
                <p className="text-sm text-gray-500">Move-in</p>

                <p className="font-semibold">
                  {formatDate(request.moveInDate)}
                </p>
              </div>

              {/* Duration */}
              <div>
                <p className="text-sm text-gray-500">Duration</p>

                <p className="font-semibold">{request.durationMonths} months</p>
              </div>

              {/* Rent */}
              <div>
                <p className="text-sm text-gray-500">Monthly Rent</p>

                <p className="font-semibold">
                  ৳{request.property?.rentPrice ?? "0"}
                </p>
              </div>
            </div>

            {/* Tenant Message */}
            {request.message && (
              <div className="mt-5">
                <p className="text-sm text-gray-500">Tenant Message</p>

                <p>{request.message}</p>
              </div>
            )}

            {/* Approve / Reject */}
            {request.status === "PENDING" && (
              <div className="mt-6 border-t pt-5">
                <RentalRequestActions requestId={request.id} />
              </div>
            )}

            {/* Approved */}
            {request.status === "APPROVED" && (
              <div className="mt-6 border-t pt-5">
                <p className="text-sm text-green-600">
                  This rental request has been approved.
                </p>
              </div>
            )}

            {/* Rejected */}
            {request.status === "REJECTED" && (
              <div className="mt-6 border-t pt-5">
                <p className="text-sm text-red-600">
                  This rental request has been rejected.
                </p>
              </div>
            )}

            {/* Cancelled */}
            {request.status === "CANCELLED" && (
              <div className="mt-6 border-t pt-5">
                <p className="text-sm text-gray-600">
                  This rental request has been cancelled.
                </p>
              </div>
            )}

            {/* Confirmed */}
            {request.status === "CONFIRMED" && (
              <div className="mt-6 border-t pt-5">
                <p className="text-sm text-green-600">
                  This rental request is confirmed.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
