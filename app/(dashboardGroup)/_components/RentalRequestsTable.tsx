"use client";

import {
  MoreHorizontal,
  Eye,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";
const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-700",
};

export type AdminRentalRequest = {
  id: string;
  moveInDate: string;
  durationMonths: number;
  message?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    title: string;
    rentPrice: number;
    city: string;
    division: string;
  };
  tenant: {
    id: string;
    name: string;
    email: string;
  };
};

type RentalRequestsTableProps = {
  requests: AdminRentalRequest[];
  onView?: (request: AdminRentalRequest) => void;
};

const RentalRequestsTable = ({
  requests,
  onView,
}: RentalRequestsTableProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Rental Requests</h2>
        <p className="text-sm text-muted-foreground">
          Manage all rental requests
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {/* Fixed Tailwind class: min-w-1100px -> min-w-275 */}
        <table className="w-full min-w-275">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Move In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Rent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  No rental requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {/* Tenant */}
                  <td className="px-6 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {request.tenant.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {request.tenant.email}
                      </p>
                    </div>
                  </td>

                  {/* Property */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {request.property.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.property.city}, {request.property.division}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Move In */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(request.moveInDate)}</span>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock3 className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {request.durationMonths}{" "}
                        {request.durationMonths === 1 ? "month" : "months"}
                      </span>
                    </div>
                  </td>

                  {/* Rent */}
                  <td className="px-6 py-4">
                    <p className="font-semibold">
                      ৳{request.property.rentPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">/ month</p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[request.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView?.(request)}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title="View request"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {requests.length > 0 && (
        <div className="border-t px-6 py-3">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {requests.length}
            </span>{" "}
            {requests.length === 1 ? "request" : "requests"}
          </p>
        </div>
      )}
    </div>
  );
};

export default RentalRequestsTable;
