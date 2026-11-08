import Link from "next/link";
import { connection } from "next/server";

import { getAllProperties } from "../_actions/property";
import { PropertyCard } from "../_components/PropertyCard";
import PropertyFilters from "./_components/PropertyFilters";
import { PropertiesTable } from "./_components/PropertiesTable";
import SortSelect from "./_components/SortSelect";
import ViewToggle from "./_components/ViewToggle";

type SortKey =
  | "title"
  | "rentPrice"
  | "bedrooms"
  | "bathrooms"
  | "areaSqft"
  | "city";

type View = "cards" | "table";

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  /**
   * This page has to render per request: the view (cards or table), the sort
   * order and the filters all live in the query string. Prerendering it
   * would bake one set of those choices into the cached HTML, so every
   * visitor would get the build-time view regardless of what they asked for.
   *
   * The listing data itself is still cached — only the shell is dynamic.
   */
  await connection();

  const params = await searchParams;

  const city = readParam(params, "city") ?? "";
  const category = readParam(params, "category") ?? "";
  const beds = readParam(params, "beds") ?? "";
  const maxRent = readParam(params, "maxRent") ?? "";
  const sort = (readParam(params, "sort") ?? "rentPrice") as SortKey;
  const view = (readParam(params, "view") ?? "cards") as View;

  // Keep the sort selection when switching layout, and drop the sort when the
  // cards are showing — the grid carries its own order.
  const activeQuery = new URLSearchParams();

  if (city) activeQuery.set("city", city);
  if (category) activeQuery.set("category", category);
  if (beds) activeQuery.set("beds", beds);
  if (maxRent) activeQuery.set("maxRent", maxRent);
  if (view === "table") activeQuery.set("sort", sort);

  const all = await getAllProperties();

  const cities = Array.from(
    new Set(all.map((property) => property.city).filter(Boolean)),
  ).sort();

  const categories = Array.from(
    new Set(
      all
        .map((property) => property.category?.name)
        .filter((name): name is string => Boolean(name)),
    ),
  ).sort();

  // Filter
  let rows = all.filter((property) => {
    if (city && property.city !== city) {
      return false;
    }

    if (
      category &&
      property.category?.name !== category
    ) {
      return false;
    }

    if (beds && property.bedrooms < Number(beds)) {
      return false;
    }

    if (maxRent && Number(property.rentPrice) > Number(maxRent)) {
      return false;
    }

    return true;
  });

  // Sort. A `-desc` suffix flips the order.
  const sorters: Record<string, (a: typeof rows[number], b: typeof rows[number]) => number> = {
    title: (a, b) => a.title.localeCompare(b.title),
    rentPrice: (a, b) => Number(a.rentPrice) - Number(b.rentPrice),
    bedrooms: (a, b) => a.bedrooms - b.bedrooms,
    bathrooms: (a, b) => a.bathrooms - b.bathrooms,
    areaSqft: (a, b) => a.areaSqft - b.areaSqft,
    city: (a, b) => (a.city ?? "").localeCompare(b.city ?? ""),
  };

  const descending = sort.endsWith("-desc");
  const sortKey = sort.replace(/-desc$/, "") as SortKey;
  const sorter = sorters[sortKey] ?? sorters.rentPrice;

  rows = [...rows].sort((a, b) =>
    descending ? sorter(b, a) : sorter(a, b),
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-line pb-4">
        <h1 className="font-display text-2xl tracking-tight">
          Properties for rent
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">
          Every listing in Dhaka, with rent, size and location side by side.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filter rail — the inputs read their initial values from the
            query string, so a URL change is enough to keep them in sync.
            Remounting on every change would throw away the user's typing. */}
        <aside className="lg:sticky lg:top-[4.25rem] lg:self-start">
          <PropertyFilters
            cities={cities}
            categories={categories}
            values={{
              city,
              category,
              beds,
              maxRent,
            }}
          />
        </aside>

        {/* Results */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-numeric text-sm text-muted-foreground">
              {rows.length}{" "}
              {rows.length === 1 ? "listing" : "listings"}
            </p>

            <div className="flex items-center gap-3">
              {view === "cards" ? (
                <SortSelect
                  value={sort}
                  query={activeQuery.toString()}
                />
              ) : null}

              <ViewToggle
                view={view}
                query={activeQuery.toString()}
              />

              {(city || category || beds || maxRent) && (
                <Link
                  href={
                    view === "table"
                      ? "/properties?view=table"
                      : "/properties"
                  }
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  Clear filters
                </Link>
              )}
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="border border-line px-6 py-14 text-center">
              <h2 className="font-display text-lg">
                No listings match those filters
              </h2>

              <p className="mt-1.5 text-sm text-muted-foreground">
                Widen the rent range or clear a filter to see more.
              </p>
            </div>
          ) : view === "cards" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {rows.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  priority={index < 3}
                />
              ))}
            </div>
          ) : (
            <PropertiesTable
              rows={rows}
              sortKey={sortKey}
              descending={descending}
              filters={{ city, category, beds, maxRent, view }}
            />
          )}
        </section>
      </div>
    </main>
  );
}
