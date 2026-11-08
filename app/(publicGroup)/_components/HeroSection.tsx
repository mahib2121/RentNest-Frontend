import Link from "next/link";

import { Button } from "@/components/ui/button";

import { getMarketPulse } from "../_actions/property";

function formatCompactCurrency(value: number) {
  if (value >= 100000) {
    return `৳${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  }

  if (value >= 1000) {
    return `৳${Math.round(value / 1000)}K`;
  }

  return `৳${value}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * The hero's one memorable element is a live rent ledger — real figures pulled
 * from the listings, not decoration. It states what the product is (a place
 * where rents are compared) before the visitor ever reaches the grid.
 */
export default async function HeroSection() {
  const pulse = await getMarketPulse();

  return (
    <section className="border-b border-line bg-paper-raised">
      <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
        {/* ------------------------------------------------------
            Copy column
            ------------------------------------------------------ */}
        <div className="flex flex-col justify-center py-14 lg:border-r lg:border-line lg:py-20 lg:pr-12">
          {/* Live marker — a dot and a fact, not an ALL-CAPS eyebrow */}
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-accent"
            />

            <p className="font-label text-sm text-muted-foreground">
              {pulse.listingCount}{" "}
              {pulse.listingCount === 1 ? "home" : "homes"} listed{" "}
              {pulse.cityCount > 1
                ? `across ${pulse.cityCount} cities`
                : pulse.topCity
                  ? `in ${pulse.topCity}`
                  : "and updated daily"}
            </p>
          </div>

          <h1 className="mt-5 max-w-[16ch] font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Rent the place, not the guesswork.
          </h1>

          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every home on RentNest is listed with its rent, size and location
            in plain figures. Compare them side by side, request a viewing, and
            settle the booking without leaving the page.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/properties">Browse listings</Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href="/register?role=landlord">List a property</Link>
            </Button>
          </div>

          {/* Trust line — the concrete promise, in plain words */}
          <p className="mt-8 max-w-[46ch] border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted-foreground">
            No listing fees for tenants. Landlords publish once and manage
            every request from one dashboard.
          </p>
        </div>

        {/* ------------------------------------------------------
            Ledger column — live market figures
            ------------------------------------------------------ */}
        <aside className="py-10 lg:py-20 lg:pl-10">
          <div className="border border-line bg-background">
            <div className="flex items-baseline justify-between border-b border-line px-5 py-3">
              <h2 className="font-label text-sm">Rent index</h2>

              <p className="font-numeric text-xs text-muted-foreground">
                Live
              </p>
            </div>

            {/* Headline figure — the median rent, set large */}
            <div className="border-b border-line px-5 py-5">
              <p className="font-label text-xs text-muted-foreground">
                Median asking rent
              </p>

              <p className="mt-1.5 font-numeric text-3xl tracking-tight text-primary">
                {pulse.medianRent > 0 ? formatCurrency(pulse.medianRent) : "—"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {pulse.sampleSize} of {pulse.totalCount} listings priced
              </p>
            </div>

            {/* The rest of the ledger — label left, figure right */}
            <dl>
              <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-3">
                <dt className="text-sm text-muted-foreground">
                  Rent floor
                </dt>

                <dd className="font-numeric text-sm">
                  {pulse.lowestRent > 0
                    ? formatCompactCurrency(pulse.lowestRent)
                    : "—"}
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-3">
                <dt className="text-sm text-muted-foreground">
                  Rent ceiling
                </dt>

                <dd className="font-numeric text-sm">
                  {pulse.highestRent > 0
                    ? formatCompactCurrency(pulse.highestRent)
                    : "—"}
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-3">
                <dt className="text-sm text-muted-foreground">
                  Median floor area
                </dt>

                <dd className="font-numeric text-sm">
                  {pulse.medianArea > 0 ? `${pulse.medianArea} sqft` : "—"}
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 px-5 py-3">
                <dt className="text-sm text-muted-foreground">
                  Most listed in
                </dt>

                <dd className="text-sm">{pulse.topCity ?? "—"}</dd>
              </div>
            </dl>

            {/* A rent band drawn from the actual spread */}
            {pulse.band.length > 0 ? (
              <div className="border-t border-line px-5 py-4">
                <p className="font-label text-xs text-muted-foreground">
                  Listings by rent band
                </p>

                <ul className="mt-3 space-y-2">
                  {pulse.band.map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center gap-3"
                    >
                      <span className="w-20 shrink-0 font-numeric text-xs text-muted-foreground">
                        {row.label}
                      </span>

                      <span
                        aria-hidden="true"
                        className="h-1.5 flex-1 bg-muted"
                      >
                        <span
                          className="block h-full bg-primary"
                          style={{ width: `${row.percent}%` }}
                        />
                      </span>

                      <span className="w-6 shrink-0 text-right font-numeric text-xs">
                        {row.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Figures are drawn from live listings and update as landlords
            publish. The rent range excludes the highest and lowest asking
            price in the list.
          </p>
        </aside>
      </div>
    </section>
  );
}
