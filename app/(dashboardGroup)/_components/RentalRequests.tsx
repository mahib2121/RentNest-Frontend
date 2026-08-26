import PaymentButton from "@/app/(publicGroup)/_components/PaymentButton";
import { TenantRentalRequest } from "../_actions/tenantRequests";

type RentalRequestsProps = {
  requests: TenantRentalRequest[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RentalRequests({ requests }: RentalRequestsProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">My Rental Requests</h2>

        <p className="mt-2 text-gray-600">
          You have not submitted any rental requests yet.
        </p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">My Rental Requests</h2>

      <div className="space-y-6">
        {requests.map((request) => (
          <div key={request.id} className="rounded-lg border p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <h3 className="text-xl font-semibold">
                  {request.property.title}
                </h3>

                <p className="mt-1 text-gray-600">
                  {request.property.address}, {request.property.city}
                </p>
              </div>

              <div>
                <span className="rounded border px-3 py-1 text-sm">
                  {request.status}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Monthly Rent</p>

                <p className="font-semibold">৳{request.property.rentPrice}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Move-in Date</p>

                <p className="font-semibold">
                  {formatDate(request.moveInDate)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Duration</p>

                <p className="font-semibold">{request.durationMonths} months</p>
              </div>
            </div>

            {request.message && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Message</p>

                <p>{request.message}</p>
              </div>
            )}

            {request.status === "APPROVED" && (
              <div className="mt-6 border-t pt-5">
                <p className="mb-3 text-sm text-gray-600">
                  Your rental request has been approved. Complete payment to
                  confirm your booking.
                </p>

                <PaymentButton rentalRequestId={request.id} />
              </div>
            )}

            {request.status === "PENDING" && (
              <p className="mt-5 text-sm text-gray-600">
                Waiting for landlord approval.
              </p>
            )}

            {request.status === "REJECTED" && (
              <p className="mt-5 text-sm text-red-600">
                Your rental request was rejected.
              </p>
            )}

            {request.status === "CANCELLED" && (
              <p className="mt-5 text-sm text-gray-600">
                This rental request has been cancelled.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
