import Link from "next/link";
type Property = {
  id: string;
  title: string;
  description: string;
  rentPrice: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  address: string;
  city: string;
  division: string;
  postalCode: string;
  availableFrom: string;
  availabilityStatus: string;
  category: {
    id: string;
    name: string;
  };
};

type PropertiesResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: Property[];
};

async function getProperties(): Promise<Property[]> {
  const response = await fetch(`${process.env.APIurl}/api/properties`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  const result: PropertiesResponse = await response.json();

  return result.data;
}

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Available Properties</h1>

      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="rounded-lg border p-5 shadow-sm">
              <h2 className="mb-2 text-xl font-semibold">{property.title}</h2>

              <p className="mb-3 text-sm text-gray-600">
                {property.description}
              </p>

              <div className="space-y-1 text-sm">
                <p>
                  <strong>Rent:</strong> ৳{property.rentPrice}
                </p>

                <p>
                  <strong>Bedrooms:</strong> {property.bedrooms}
                </p>

                <p>
                  <strong>Bathrooms:</strong> {property.bathrooms}
                </p>

                <p>
                  <strong>Area:</strong> {property.areaSqft} sqft
                </p>

                <p>
                  <strong>Location:</strong> {property.address}, {property.city}
                </p>

                <p>
                  <strong>Category:</strong> {property.category.name}
                </p>

                <p>
                  <strong>Status:</strong> {property.availabilityStatus}
                </p>
              </div>

              <Link
                href={`/properties/${property.id}`}
                className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
              >
                View Property
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
