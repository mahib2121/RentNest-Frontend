import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { getFeaturedProperties } from "../_actions/property";

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

export default async function PropertySection() {
  const properties = await getFeaturedProperties();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Available properties
          </h2>

          <p className="mt-2 text-muted-foreground">
            Explore properties currently available for rent on RentNest.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/browse">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Properties */}
      {properties.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group"
            >
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={
                      property.images?.[0] ?? "/images/property-placeholder.jpg"
                    }
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Availability */}
                  <div className="absolute left-3 top-3">
                    <Badge className="bg-white/90 text-foreground hover:bg-white">
                      Available
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{property.title}</h3>

                    <span className="shrink-0 text-lg font-bold text-primary">
                      {formatCurrency(property.rentPrice)}

                      <span className="text-xs font-normal text-muted-foreground">
                        /mo
                      </span>
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {property.address}, {property.city}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{property.bedrooms} bd</span>
                    <span>{property.bathrooms} ba</span>
                    <span>{property.areaSqft} sqft</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Home className="mx-auto h-10 w-10 text-muted-foreground" />

          <h3 className="mt-4 font-semibold">No properties available</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            There are currently no properties available for rent.
          </p>

          <Button className="mt-5" asChild>
            <Link href="/browse">Browse properties</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
