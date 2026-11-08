import RentalRequestActions from "./RentalRequestActions";
import { StatusChip } from "./StatusChip";

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
      <div className="rounded-lg border border-line bg-card p-6">
        <h2 className="font-display text-xl">Rental requests</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          No rental requests yet. Requests from tenants will appear here.
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
        {requests.map((request) => (
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

            {/* Request details — a ruled fact grid */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 px-5 py-4 md:grid-cols-4">
              <div>
                <dt className="font-label text-xs text-muted-foreground">
                  Tenant
                </dt>

                <dd className="mt-1 font-medium">
                  {request.tenant?.name ?? "Unknown tenant"}
                </dd>

                <dd className="text-xs text-muted-foreground">
                  {request.tenant?.email ?? "No email available"}
                </dd>
              </div>

              <div>
                <dt className="font-label text-xs text-muted-foreground">
                  Move-in
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

              <div>
                <dt className="font-label text-xs text-muted-foreground">
                  Monthly rent
                </dt>

                <dd className="mt-1 font-numeric text-sm">
                  ৳{request.property?.rentPrice ?? "0"}
                </dd>
              </div>
            </dl>

            {/* Tenant message */}
            {request.message && (
              <div className="border-t border-line px-5 py-4">
                <p className="font-label text-xs text-muted-foreground">
                  Message from the tenant
                </p>

                <p className="mt-1.5 text-sm leading-relaxed">
                  {request.message}
                </p>
              </div>
            )}

            {/* Actions / outcome */}
            {request.status === "PENDING" && (
              <div className="border-t border-line px-5 py-4">
                <RentalRequestActions requestId={request.id} />
              </div>
            )}

            {request.status === "APPROVED" && (
              <div className="border-t border-line px-5 py-4">
                <p className="text-sm text-status-approved">
                  You approved this request. The tenant can now pay to confirm
                  the booking.
                </p>
              </div>
            )}

            {request.status === "REJECTED" && (
              <div className="border-t border-line px-5 py-4">
                <p className="text-sm text-status-rejected">
                  You rejected this request.
                </p>
              </div>
            )}

            {request.status === "CANCELLED" && (
              <div className="border-t border-line px-5 py-4">
                <p className="text-sm text-muted-foreground">
                  The tenant cancelled this request.
                </p>
              </div>
            )}

            {request.status === "CONFIRMED" && (
              <div className="border-t border-line px-5 py-4">
                <p className="text-sm text-status-approved">
                  This booking is confirmed and paid.
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
