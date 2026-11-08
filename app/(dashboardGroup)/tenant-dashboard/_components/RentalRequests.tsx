import type { TenantRentalRequest } from "../../_actions/tenantRequests";
import { StatusChip } from "../../_components/StatusChip";
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
      <div className="rounded-lg border border-line bg-card p-6">
        <h2 className="font-display text-xl">Rental requests</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          You have not requested a property yet. Browse the available listings
          to get started.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl">
        Rental requests
        <span className="ml-2 font-numeric text-base text-muted-foreground">
          {requests.length}
        </span>
      </h2>

      <div className="space-y-4">
        {requests.map((request) => {
          const paymentSuccessful = request.payment?.status === "SUCCESS";

          return (
            <article
              key={request.id}
              className="rounded-lg border border-line bg-card"
            >
              {/* Property + Status */}
              <div className="flex flex-col justify-between gap-3 border-b border-line px-5 py-4 md:flex-row md:items-start">
                <div>
                  <h3 className="font-display text-lg tracking-tight">
                    {request.property?.title ?? "Unknown property"}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {request.property?.address ?? "Address unavailable"}
                    {request.property?.city ? `, ${request.property.city}` : ""}
                  </p>
                </div>

                <StatusChip status={request.status} />
              </div>

              {/* Details — a ruled fact grid */}
              <dl className="grid grid-cols-1 gap-x-6 gap-y-4 px-5 py-4 sm:grid-cols-3">
                <div>
                  <dt className="font-label text-xs text-muted-foreground">
                    Monthly rent
                  </dt>

                  <dd className="mt-1 font-numeric text-sm">
                    ৳{request.property?.rentPrice ?? "0"}
                  </dd>
                </div>

                <div>
                  <dt className="font-label text-xs text-muted-foreground">
                    Move-in date
                  </dt>

                  <dd className="mt-1 font-numeric text-sm">
                    {formatDate(request.moveInDate)}
                  </dd>
                </div>

                <div>
                  <dt className="font-label text-xs text-muted-foreground">
                    Duration
                  </dt>

                  <dd className="mt-1 font-numeric text-sm">
                    {request.durationMonths} months
                  </dd>
                </div>
              </dl>

              {/* Message */}
              {request.message && (
                <div className="border-t border-line px-5 py-4">
                  <p className="font-label text-xs text-muted-foreground">
                    Your message
                  </p>

                  <p className="mt-1.5 text-sm leading-relaxed">
                    {request.message}
                  </p>
                </div>
              )}

              {/* Payment successful */}
              {paymentSuccessful && (
                <div className="border-t border-line px-5 py-4">
                  <p className="text-sm text-status-approved">
                    Payment successful. Your booking is confirmed.
                  </p>

                  {request.payment?.paidAt && (
                    <p className="mt-1 font-numeric text-xs text-muted-foreground">
                      Paid on {formatDate(request.payment.paidAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Pending */}
              {!paymentSuccessful && request.status === "PENDING" && (
                <div className="border-t border-line px-5 py-4">
                  <p className="text-sm text-status-pending">
                    Waiting for the landlord to respond.
                  </p>
                </div>
              )}

              {/* Approved — pay now */}
              {!paymentSuccessful && request.status === "APPROVED" && (
                <div className="border-t border-line px-5 py-4">
                  <p className="mb-3 text-sm text-status-approved">
                    Your request was approved. Complete the payment to confirm
                    your booking.
                  </p>

                  <PaymentButton rentalRequestId={request.id} />
                </div>
              )}

              {/* Rejected */}
              {request.status === "REJECTED" && (
                <div className="border-t border-line px-5 py-4">
                  <p className="text-sm text-status-rejected">
                    The landlord declined this request.
                  </p>
                </div>
              )}

              {/* Cancelled */}
              {request.status === "CANCELLED" && (
                <div className="border-t border-line px-5 py-4">
                  <p className="text-sm text-muted-foreground">
                    You cancelled this request.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
