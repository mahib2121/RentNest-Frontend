"use client";

import Image from "next/image";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  MapPin,
  BedDouble,
  Bath,
} from "lucide-react";

export type Property = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  rentPrice: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  address: string;
  city: string;
  division: string;
  availabilityStatus: string;
  landlord?: {
    id: string;
    name: string;
    email: string;
  };
};

type PropertiesTableProps = {
  properties: Property[];
  onView?: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
};

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  RENTED: "bg-blue-100 text-blue-700",
  INACTIVE: "bg-red-100 text-red-700",
};

const PropertiesTable = ({
  properties,
  onView,
  onEdit,
  onDelete,
}: PropertiesTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {/* Table Header */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Landlord
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Details
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
            {properties.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-muted-foreground"
                >
                  No properties found.
                </td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr
                  key={property.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {/* Property */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {property.image ? (
                          <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">{property.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {property.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Landlord */}
                  <td className="px-6 py-4">
                    {property.landlord ? (
                      <div>
                        <p className="font-medium">{property.landlord.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {property.landlord.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Unknown
                      </span>
                    )}
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{property.city}</p>
                        <p className="text-xs text-muted-foreground">
                          {property.division}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4 text-muted-foreground" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4 text-muted-foreground" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {property.areaSqft.toLocaleString()} sqft
                      </span>
                    </div>
                  </td>

                  {/* Rent */}
                  <td className="px-6 py-4">
                    <p className="font-semibold">
                      ৳{property.rentPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">/ month</p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusStyles[property.availabilityStatus] ||
                        "bg-gray-100 text-gray-700" // Added a fallback color just in case
                      }`}
                    >
                      {property.availabilityStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView?.(property)}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title="View property"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit?.(property)}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        title="Edit property"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(property)}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="Delete property"
                      >
                        <Trash2 className="h-4 w-4" />
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
      {properties.length > 0 && (
        <div className="border-t px-6 py-3">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {properties.length}
            </span>{" "}
            {properties.length === 1 ? "property" : "properties"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertiesTable;
