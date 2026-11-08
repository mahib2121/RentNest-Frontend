import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import BookingForm from "../../_components/BookingForm";
import { StatusChip } from "../../../(dashboardGroup)/_components/StatusChip";
import { getProperty } from "../../_actions/property";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

function formatDate(value?: string) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return date.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const images = property.images?.length
    ? property.images
    : property.image
      ? [property.image]
      : [];

  const facts: { label: string; value: string }[] = [
    {
      label: "Monthly rent",
      value: formatCurrency(property.rentPrice),
    },
    {
      label: "Category",
      value: property.category?.name ?? "Not set",
    },
    {
      label: "Bedrooms",
      value: String(property.bedrooms),
    },
    {
      label: "Bathrooms",
      value: String(property.bathrooms),
    },
    {
      label: "Area",
      value: `${property.areaSqft} sqft`,
    },
    {
      label: "Available from",
      value: formatDate(property.availableFrom),
    },
    {
      label: "Postal code",
      value: property.postalCode || "Not set",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/properties"
        className="text-sm text-muted-foreground underline-offset-4 transition-colors duration-150 ease-out hover:text-foreground hover:underline"
      >
        Back to properties
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* Left — gallery + facts */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
            <div>
              <h1 className="font-display text-2xl tracking-tight">
                {property.title}
              </h1>

              <p className="mt-1.5 text-sm text-muted-foreground">
                {property.address}, {property.city}
                {property.division ? `, ${property.division}` : ""}
              </p>
            </div>

            {property.availabilityStatus && (
              <StatusChip status={property.availabilityStatus} />
            )}
          </div>

          {/* Gallery */}
          {images.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {images.slice(0, 4).map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line"
                >
                  <Image
                    src={src}
                    alt={`${property.title} — image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 flex aspect-[16/10] items-center justify-center rounded-sm border border-line bg-paper-raised text-sm text-muted-foreground">
              No photos for this listing
            </div>
          )}

          {/* Description */}
          {property.description && (
            <section className="mt-8">
              <h2 className="border-b border-line pb-2 font-display text-lg tracking-tight">
                Description
              </h2>

              <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-muted-foreground">
                {property.description}
              </p>
            </section>
          )}

          {/* Facts — a definition list, not bold-label/paragraph pairs */}
          <section className="mt-8">
            <h2 className="border-b border-line pb-2 font-display text-lg tracking-tight">
              Property facts
            </h2>

            <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                >
                  <dt className="text-sm text-muted-foreground">
                    {fact.label}
                  </dt>

                  <dd className="font-numeric text-sm">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Landlord */}
          {property.landlord && (
            <section className="mt-8">
              <h2 className="border-b border-line pb-2 font-display text-lg tracking-tight">
                Landlord
              </h2>

              <dl className="mt-1">
                <div className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                  <dt className="text-sm text-muted-foreground">
                    Name
                  </dt>

                  <dd className="text-sm">{property.landlord.name}</dd>
                </div>

                {property.landlord.email && (
                  <div className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                    <dt className="text-sm text-muted-foreground">
                      Email
                    </dt>

                    <dd className="text-sm">
                      {property.landlord.email}
                    </dd>
                  </div>
                )}

                {property.landlord.phone && (
                  <div className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                    <dt className="text-sm text-muted-foreground">
                      Phone
                    </dt>

                    <dd className="font-numeric text-sm">
                      {property.landlord.phone}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          )}
        </div>

        {/* Right — sticky booking form */}
        <aside className="lg:sticky lg:top-[4.25rem] lg:self-start">
          <div className="rounded-sm border border-line bg-paper-raised p-5">
            <p className="font-numeric text-2xl text-primary">
              {formatCurrency(property.rentPrice)}
            </p>

            <p className="mt-0.5 text-sm text-muted-foreground">
              per month
            </p>

            <BookingForm propertyId={property.id} />
          </div>
        </aside>
      </div>
    </main>
  );
}
