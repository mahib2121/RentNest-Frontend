import type { TenantRentalRequest } from "../../_actions/tenantRequests";
import PaymentButton from "./PaymentButton";

type Props = {
  requests: TenantRentalRequest[];
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

        <p className="mt-2 text-gray-600">You have no rental requests yet.</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Rental Requests</h2>

      <div className="space-y-6">
        {requests.map((request) => {
          const paymentSuccessful = request.payment?.status === "SUCCESS";

          return (
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

              {/* Details */}
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Monthly Rent</p>

                  <p className="font-semibold">
                    ৳{request.property?.rentPrice ?? "0"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Move-in Date</p>

                  <p className="font-semibold">
                    {formatDate(request.moveInDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Duration</p>

                  <p className="font-semibold">
                    {request.durationMonths} months
                  </p>
                </div>
              </div>

              {/* Message */}
              {request.message && (
                <div className="mt-5">
                  <p className="text-sm text-gray-500">Your Message</p>

                  <p>{request.message}</p>
                </div>
              )}

              {/* ========================= */}
              {/* PAYMENT SUCCESS */}
              {/* ========================= */}

              {paymentSuccessful && (
                <div className="mt-6 border-t pt-5">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="font-semibold text-green-700">
                      ✓ Payment Successful
                    </p>

                    <p className="mt-1 text-sm text-green-600">
                      Your booking has been confirmed.
                    </p>

                    {request.payment?.paidAt && (
                      <p className="mt-2 text-xs text-green-600">
                        Paid on {formatDate(request.payment.paidAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ========================= */}
              {/* PENDING RENTAL REQUEST */}
              {/* ========================= */}

              {!paymentSuccessful && request.status === "PENDING" && (
                <div className="mt-6 border-t pt-5">
                  <p className="text-sm text-yellow-600">
                    Waiting for landlord approval.
                  </p>
                </div>
              )}

              {/* ========================= */}
              {/* APPROVED - PAY NOW */}
              {/* ========================= */}

              {!paymentSuccessful && request.status === "APPROVED" && (
                <div className="mt-6 border-t pt-5">
                  <p className="mb-4 text-sm text-green-600">
                    Your rental request has been approved. Complete payment to
                    confirm your booking.
                  </p>

                  <PaymentButton rentalRequestId={request.id} />
                </div>
              )}

              {/* ========================= */}
              {/* REJECTED */}
              {/* ========================= */}

              {request.status === "REJECTED" && (
                <div className="mt-6 border-t pt-5">
                  <p className="text-sm text-red-600">
                    Your rental request was rejected by the landlord.
                  </p>
                </div>
              )}

              {/* ========================= */}
              {/* CANCELLED */}
              {/* ========================= */}

              {request.status === "CANCELLED" && (
                <div className="mt-6 border-t pt-5">
                  <p className="text-sm text-gray-600">
                    This rental request has been cancelled.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
