import { getFeaturedProperties } from "../_actions/property";
import { PropertyCard } from "./PropertyCard";

export default async function PropertySection() {
  const properties = await getFeaturedProperties();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Section head */}
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 className="font-display text-xl tracking-tight">
          Available now
        </h2>

        <span className="font-numeric text-sm text-muted-foreground">
          {properties.length}{" "}
          {properties.length === 1 ? "listing" : "listings"}
        </span>
      </div>

      {/* Listings */}
      {properties.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <div className="border border-line px-6 py-14 text-center">
          <h3 className="font-display text-lg">
            No properties are listed yet
          </h3>

          <p className="mt-1.5 text-sm text-muted-foreground">
            New listings appear here as soon as landlords publish them.
          </p>
        </div>
      )}
    </section>
  );
}
