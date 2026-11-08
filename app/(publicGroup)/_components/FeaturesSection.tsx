import Link from "next/link";

const features = [
  {
    title: "Every listing in one ledger",
    body: "Rent, size, and location side by side, so you can compare instead of scrolling.",
  },
  {
    title: "One request, one thread",
    body: "Apply to a home and follow the landlord's answer from the same screen.",
  },
  {
    title: "Pay and confirm",
    body: "Settle the booking online and keep the receipt with the request.",
  },
  {
    title: "Landlords keep control",
    body: "Publish a property, review applicants, and track interest per listing.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="how-it-works"
      className="border-t border-line bg-paper-raised"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 border-b border-line pb-3">
          <h2 className="font-display text-xl tracking-tight">
            How RentNest works
          </h2>
        </div>

        {/* Ruled strip — one row per capability, no cards */}
        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title}>
              <dt className="font-label text-sm">{feature.title}</dt>

              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.body}
              </dd>
            </div>
          ))}
        </dl>

        {/* Role entry points */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
          <p className="font-label text-sm text-muted-foreground">
            Renting in Dhaka?
          </p>

          <Link
            href="/properties"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Browse listings
          </Link>

          <span className="text-line-strong">/</span>

          <p className="font-label text-sm text-muted-foreground">
            Own a property?
          </p>

          <Link
            href="/register?role=landlord"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Publish a listing
          </Link>
        </div>
      </div>
    </section>
  );
}
