import Link from "next/link";
import { notFound } from "next/navigation";

import BookingForm from "../../_components/BookingForm";
type Property = {
  id: string;
  landlordId: string;
  categoryId: string;
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
  latitude: string;
  longitude: string;
  availableFrom: string;
  availabilityStatus: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug?: string;
    description?: string;
  };
  landlord: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  reviews: unknown[];
};

type PropertyResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: Property;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getProperty(id: string): Promise<Property | null> {
  const response = await fetch(`${process.env.APIurl}/api/properties/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch property");
  }

  const result: PropertyResponse = await response.json();

  return result.data;
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/properties" className="mb-6 inline-block text-sm underline">
        ← Back to Properties
      </Link>

      <div className="rounded-lg border p-6">
        <h1 className="mb-4 text-3xl font-bold">{property.title}</h1>

        <p className="mb-6 text-gray-600">{property.description}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <strong>Monthly Rent:</strong>
            <p>৳{property.rentPrice}</p>
          </div>

          <div>
            <strong>Category:</strong>
            <p>{property.category.name}</p>
          </div>

          <div>
            <strong>Bedrooms:</strong>
            <p>{property.bedrooms}</p>
          </div>

          <div>
            <strong>Bathrooms:</strong>
            <p>{property.bathrooms}</p>
          </div>

          <div>
            <strong>Area:</strong>
            <p>{property.areaSqft} sqft</p>
          </div>

          <div>
            <strong>Status:</strong>
            <p>{property.availabilityStatus}</p>
          </div>

          <div>
            <strong>Available From:</strong>
            <p>{new Date(property.availableFrom).toLocaleDateString()}</p>
          </div>

          <div>
            <strong>Postal Code:</strong>
            <p>{property.postalCode}</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="mb-2 text-xl font-semibold">Location</h2>

          <p>
            {property.address}, {property.city}, {property.division}
          </p>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="mb-2 text-xl font-semibold">Landlord</h2>

          <p>
            <strong>Name:</strong> {property.landlord.name}
          </p>

          <p>
            <strong>Email:</strong> {property.landlord.email}
          </p>

          <p>
            <strong>Phone:</strong> {property.landlord.phone}
          </p>
        </div>

        <div className="mt-8">
         <BookingForm propertyId={property.id} />
        </div>
      </div>
    </main>
  );
}
