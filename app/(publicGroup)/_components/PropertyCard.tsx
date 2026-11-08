import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { Property } from "../_actions/property";

export function formatCurrency(value: number | string) {
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

function formatDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
}

/**
 * A listing card.
 *
 * Flat surface, hairline rules, no shadow. The photo panel keeps the same
 * 16:10 frame whether or not the listing has photos — a listing without
 * images gets a ruled placeholder rather than a broken image, so every card
 * in the grid keeps the same height and the rows stay aligned.
 */
export function PropertyCard({
  property,
  className,
  priority = false,
}: {
  property: Property;
  className?: string;
  priority?: boolean;
}) {
  const image = property.images?.[0] ?? property.image ?? null;

  const availableFrom = formatDate(property.availableFrom);

  return (
    <Link
      href={`/properties/${property.id}`}
      className={cn(
        "group flex flex-col border border-line bg-paper-raised transition-colors duration-150 ease-out hover:border-line-strong",
        className,
      )}
    >
      {/* Photo panel — same frame with or without a photo */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-secondary">
        {image ? (
          <Image
            src={image}
            alt={property.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-opacity duration-150 ease-out group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
            <span
              aria-hidden="true"
              className="font-display text-2xl tracking-tight text-line-strong"
            >
              {property.category?.name?.slice(0, 1) ?? "R"}
            </span>

            <span className="font-label text-xs text-muted-foreground">
              No photo
            </span>
          </div>
        )}
      </div>

      {/* Fact block */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category + availability */}
        <div className="flex items-start justify-between gap-3">
          <p className="font-label text-xs text-muted-foreground">
            {property.category?.name ?? "Property"}
          </p>

          {property.availabilityStatus === "AVAILABLE" && (
            <span className="shrink-0 font-label text-xs text-status-approved">
              Available
            </span>
          )}
        </div>

        <h3 className="mt-1.5 font-display text-base leading-snug tracking-tight">
          {property.title}
        </h3>

        <p className="mt-1 truncate text-sm text-muted-foreground">
          {property.address ?? property.city}
        </p>

        {/* Ruled fact row */}
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 font-numeric text-sm">
          <span>{property.bedrooms} bd</span>

          <span className="text-line-strong">/</span>

          <span>{property.bathrooms} ba</span>

          <span className="text-line-strong">/</span>

          <span>{property.areaSqft} sqft</span>
        </div>

        {/* Rent — pinned to the bottom so cards line up */}
        <div className="mt-auto flex items-baseline justify-between gap-3 pt-3">
          <p className="font-numeric text-lg text-primary">
            {formatCurrency(property.rentPrice)}

            <span className="ml-1 text-xs text-muted-foreground">/mo</span>
          </p>

          {availableFrom ? (
            <p className="font-numeric text-xs text-muted-foreground">
              From {availableFrom}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
