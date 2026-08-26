import { serverAxios } from "@/lib/serverAxios";

export type Property = {
  id: string;
  title: string;
  rentPrice: number | string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  address: string;
  city: string;
  images?: string[];
  availabilityStatus?: string;
};

export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const api = await serverAxios();

    const response = await api.get("/api/properties", {
      params: {
        limit: 3,
        featured: true,
        availabilityStatus: "AVAILABLE",
      },
    });

    const data = response.data?.data;

    if (Array.isArray(data)) {
      return data.slice(0, 3);
    }

    if (Array.isArray(data?.data)) {
      return data.data.slice(0, 3);
    }

    return [];
  } catch (error) {
    console.error("Failed to load featured properties:", error);

    return [];
  }
}
