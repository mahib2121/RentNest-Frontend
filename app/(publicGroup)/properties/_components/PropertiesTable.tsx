"use client";

import Link from "next/link";

import { VirtualTable } from "@/components/ui/virtual-table";
import type { Property } from "../../_actions/property";

type SortKey =
  | "title"
  | "rentPrice"
  | "bedrooms"
  | "bathrooms"
  | "areaSqft"
  | "city";

function formatCurrency(value: number | string) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "৳0";
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * The results table for /properties.
 *
 * The body is virtualised — only the rows on screen are in the DOM. With a
 * long result set that is the difference between a handful of `<tr>` nodes
 * and a thousand of them, and it is what keeps the page responsive when the
 * filters are loosened.
 *
 * The sort links are built here rather than in the server page: a function
 * cannot be passed from a server component to a client one, so the current
 * filter values arrive as plain data and the URLs are assembled on this
 * side.
 */
export function PropertiesTable({
  rows,
  sortKey,
  descending,
  filters,
}: {
  rows: Property[];
  sortKey: SortKey;
  descending: boolean;
  filters: {
    city: string;
    category: string;
    beds: string;
    maxRent: string;
    view: string;
  };
}) {
  /**
   * The link for a column header. Clicking the active column flips the
   * direction; the filters and the table view are carried over.
   */
  function sortHref(key: SortKey) {
    const next = new URLSearchParams();

    if (filters.city) next.set("city", filters.city);
    if (filters.category) next.set("category", filters.category);
    if (filters.beds) next.set("beds", filters.beds);
    if (filters.maxRent) next.set("maxRent", filters.maxRent);
    if (filters.view === "table") next.set("view", "table");

    const active = sortKey === key;
    const flip = active && !descending;

    next.set("sort", flip ? `${key}-desc` : key);

    return `/properties?${next.toString()}`;
  }
  const columns = [
    {
      key: "title",
      label: "Property",
      renderHeader: () => (
        <Link
          href={sortHref("title")}
          className="inline-flex items-center gap-1 transition-colors duration-150 ease-out hover:text-foreground"
        >
          Property
          {sortKey === "title" && (
            <span className="text-primary" aria-hidden="true">
              {descending ? "↑" : "↓"}
            </span>
          )}
        </Link>
      ),
      renderCell: (property: Property) => (
        <>
          <Link
            href={`/properties/${property.id}`}
            className="font-medium hover:text-primary"
          >
            {property.title}
          </Link>

          {property.category?.name && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {property.category.name}
            </p>
          )}
        </>
      ),
    },
    {
      key: "city",
      label: "Location",
      renderHeader: () => (
        <Link
          href={sortHref("city")}
          className="inline-flex items-center gap-1 transition-colors duration-150 ease-out hover:text-foreground"
        >
          Location
          {sortKey === "city" && (
            <span className="text-primary" aria-hidden="true">
              {descending ? "↑" : "↓"}
            </span>
          )}
        </Link>
      ),
      renderCell: (property: Property) => (
        <>
          {property.city}
          {property.division ? `, ${property.division}` : ""}
        </>
      ),
    },
    {
      key: "bedrooms",
      label: "Beds",
      width: "72px",
      renderHeader: () => (
        <Link
          href={sortHref("bedrooms")}
          className="inline-flex items-center gap-1 transition-colors duration-150 ease-out hover:text-foreground"
        >
          Beds
          {sortKey === "bedrooms" && (
            <span className="text-primary" aria-hidden="true">
              {descending ? "↑" : "↓"}
            </span>
          )}
        </Link>
      ),
      renderCell: (property: Property) => (
        <span className="font-numeric">{property.bedrooms}</span>
      ),
    },
    {
      key: "bathrooms",
      label: "Baths",
      width: "72px",
      renderHeader: () => (
        <Link
          href={sortHref("bathrooms")}
          className="inline-flex items-center gap-1 transition-colors duration-150 ease-out hover:text-foreground"
        >
          Baths
          {sortKey === "bathrooms" && (
            <span className="text-primary" aria-hidden="true">
              {descending ? "↑" : "↓"}
            </span>
          )}
        </Link>
      ),
      renderCell: (property: Property) => (
        <span className="font-numeric">{property.bathrooms}</span>
      ),
    },
    {
      key: "areaSqft",
      label: "Area",
      width: "104px",
      renderHeader: () => (
        <Link
          href={sortHref("areaSqft")}
          className="inline-flex items-center gap-1 transition-colors duration-150 ease-out hover:text-foreground"
        >
          Area
          {sortKey === "areaSqft" && (
            <span className="text-primary" aria-hidden="true">
              {descending ? "↑" : "↓"}
            </span>
          )}
        </Link>
      ),
      renderCell: (property: Property) => (
        <span className="font-numeric">
          {property.areaSqft}
          <span className="ml-1 text-xs text-muted-foreground">sqft</span>
        </span>
      ),
    },
    {
      key: "rentPrice",
      label: "Rent",
      width: "148px",
      renderHeader: () => (
        <Link
          href={sortHref("rentPrice")}
          className="inline-flex items-center gap-1 transition-colors duration-150 ease-out hover:text-foreground"
        >
          Rent
          {sortKey === "rentPrice" && (
            <span className="text-primary" aria-hidden="true">
              {descending ? "↑" : "↓"}
            </span>
          )}
        </Link>
      ),
      renderCell: (property: Property) => (
        <span className="font-numeric text-primary">
          {formatCurrency(property.rentPrice)}
        </span>
      ),
    },
  ];

  return (
    <VirtualTable
      columns={columns}
      rows={rows}
      rowKey={(property) => property.id}
      height={620}
      overscan={10}
    />
  );
}
