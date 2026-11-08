"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  MapPin,
} from "lucide-react";

import { VirtualTable } from "@/components/ui/virtual-table";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { StatusChip } from "./StatusChip";

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

/**
 * The admin property table.
 *
 * The body is virtualised so a long list of properties does not become a
 * thousand rows of DOM. Only the rows on screen are rendered, plus a small
 * overscan so scrolling does not flash empty rows.
 */
const PropertiesTable = ({
  properties,
  onView,
  onEdit,
  onDelete,
}: PropertiesTableProps) => {
  const [query, setQuery] = useState("");

  /**
   * The search box updates on every keystroke; the table does not need to.
   * Debouncing keeps the input responsive and filters the list once the
   * admin stops typing, then `useDeferredValue` lets React keep the input
   * responsive while the filtered list is recomputed.
   */
  const debouncedQuery = useDebouncedValue(query, 250);
  const deferredQuery = useDeferredValue(debouncedQuery);

  const visibleProperties = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();

    if (!needle) {
      return properties;
    }

    return properties.filter(
      (property) =>
        property.title.toLowerCase().includes(needle) ||
        property.city.toLowerCase().includes(needle) ||
        property.landlord?.name.toLowerCase().includes(needle),
    );
  }, [properties, deferredQuery]);

  const columns = [
    {
      key: "property",
      label: "Property",
      renderCell: (property: Property) => (
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-sm bg-secondary">
            {property.image ? (
              <Image
                src={property.image}
                alt={property.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium">{property.title}</p>

            <p className="font-numeric text-xs text-muted-foreground">
              {property.id.slice(0, 8)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "landlord",
      label: "Landlord",
      renderCell: (property: Property) =>
        property.landlord ? (
          <div>
            <p className="font-medium">{property.landlord.name}</p>

            <p className="text-xs text-muted-foreground">
              {property.landlord.email}
            </p>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Unknown</span>
        ),
    },
    {
      key: "location",
      label: "Location",
      renderCell: (property: Property) => (
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />

          <div>
            <p className="font-medium">{property.city}</p>

            <p className="text-xs text-muted-foreground">
              {property.division}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "bedrooms",
      label: "Beds",
      width: "72px",
      renderCell: (property: Property) => (
        <span className="font-numeric text-sm">{property.bedrooms}</span>
      ),
    },
    {
      key: "bathrooms",
      label: "Baths",
      width: "72px",
      renderCell: (property: Property) => (
        <span className="font-numeric text-sm">{property.bathrooms}</span>
      ),
    },
    {
      key: "areaSqft",
      label: "Area",
      width: "104px",
      renderCell: (property: Property) => (
        <span className="font-numeric text-sm">
          {property.areaSqft.toLocaleString()}
          <span className="ml-1 text-xs text-muted-foreground">sqft</span>
        </span>
      ),
    },
    {
      key: "rentPrice",
      label: "Rent",
      width: "110px",
      renderCell: (property: Property) => (
        <span className="font-numeric text-sm">
          ৳{property.rentPrice.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "110px",
      renderCell: (property: Property) => (
        <StatusChip status={property.availabilityStatus} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "160px",
      align: "right" as const,
      renderCell: (property: Property) => (
        <div className="flex justify-end gap-0.5">
          <button
            type="button"
            onClick={() => onView?.(property)}
            className="rounded-sm p-2 text-muted-foreground transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground"
            title="View property"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onEdit?.(property)}
            className="rounded-sm p-2 text-muted-foreground transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground"
            title="Edit property"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(property)}
            className="rounded-sm p-2 text-muted-foreground transition-colors duration-150 ease-out hover:bg-destructive/10 hover:text-destructive"
            title="Delete property"
          >
            <Trash2 className="h-4 w-4" />
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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="property-search" className="sr-only">
          Search properties
        </label>

        <input
          id="property-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, city or landlord"
          className="h-9 w-full max-w-xs rounded-sm border border-line-strong bg-transparent px-3 text-sm outline-none transition-colors duration-150 ease-out placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />

        <p className="font-numeric text-sm text-muted-foreground">
          {visibleProperties.length}{" "}
          {visibleProperties.length === 1 ? "property" : "properties"}
        </p>
      </div>

      <div className="overflow-hidden rounded-sm border border-line bg-card">
        <VirtualTable
          columns={columns}
          rows={visibleProperties}
          rowKey={(property) => property.id}
          height={560}
          overscan={8}
          className="rounded-none border-0"
          empty={
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              {query.trim()
                ? "No properties match that search."
                : "No properties found."}
            </div>
          }
        />

        {properties.length > 0 && (
          <div className="border-t border-line px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              <span className="font-numeric text-foreground">
                {properties.length}
              </span>{" "}
              {properties.length === 1 ? "property" : "properties"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesTable;
