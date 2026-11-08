"use client";

import {
  MoreHorizontal,
  Eye,
  MapPin,
} from "lucide-react";

import { VirtualTable } from "@/components/ui/virtual-table";
import { StatusChip } from "./StatusChip";

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

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/**
 * The admin rental requests table.
 *
 * The body is virtualised, so a long queue of requests does not become a
 * thousand rows of DOM.
 */
const RentalRequestsTable = ({
  requests,
  onView,
}: RentalRequestsTableProps) => {
  const columns = [
    {
      key: "tenant",
      label: "Tenant",
      renderCell: (request: AdminRentalRequest) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{request.tenant.name}</p>

          <p className="truncate text-xs text-muted-foreground">
            {request.tenant.email}
          </p>
        </div>
      ),
    },
    {
      key: "property",
      label: "Property",
      renderCell: (request: AdminRentalRequest) => (
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />

          <div className="min-w-0">
            <p className="truncate font-medium">{request.property.title}</p>

            <p className="text-xs text-muted-foreground">
              {request.property.city}, {request.property.division}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "moveInDate",
      label: "Move in",
      width: "130px",
      renderCell: (request: AdminRentalRequest) => (
        <span className="font-numeric text-sm">
          {formatDate(request.moveInDate)}
        </span>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      width: "110px",
      renderCell: (request: AdminRentalRequest) => (
        <span className="font-numeric text-sm">
          {request.durationMonths}{" "}
          <span className="text-xs text-muted-foreground">
            {request.durationMonths === 1 ? "month" : "months"}
          </span>
        </span>
      ),
    },
    {
      key: "rent",
      label: "Rent",
      width: "110px",
      renderCell: (request: AdminRentalRequest) => (
        <span className="font-numeric text-sm">
          ৳{request.property.rentPrice.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "120px",
      renderCell: (request: AdminRentalRequest) => (
        <StatusChip status={request.status} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "100px",
      align: "right" as const,
      renderCell: (request: AdminRentalRequest) => (
        <div className="flex justify-end gap-0.5">
          <button
            type="button"
            onClick={() => onView?.(request)}
            className="rounded-sm p-2 text-muted-foreground transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground"
            title="View request"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="rounded-sm p-2 text-muted-foreground transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground"
            title="More actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-sm border border-line bg-card">
      <VirtualTable
        columns={columns}
        rows={requests}
        rowKey={(request) => request.id}
        height={560}
        overscan={8}
        className="rounded-none border-0"
        empty={
          <div className="px-4 py-12 text-center text-sm text-muted-foreground">
            No rental requests found.
          </div>
        }
      />

      {requests.length > 0 && (
        <div className="border-t border-line px-4 py-2.5">
          <p className="text-xs text-muted-foreground">
            <span className="font-numeric text-foreground">
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
