"use server";

import { serverAxios } from "@/lib/serverAxios";

export type LandlordProperty = {
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

  latitude: string | null;
  longitude: string | null;

  availableFrom: string;
  availabilityStatus: "AVAILABLE" | "RENTED" | "INACTIVE";

  createdAt: string;
  updatedAt: string;

  category: {
    id: string;
    name: string;
    slug?: string;
    description?: string | null;
  };

  _count: {
    rentalRequests: number;
    reviews: number;
  };
};

type PropertiesResponse = {
  success: boolean;
  statusCode?: number;
  message: string;
  data: LandlordProperty[];
};

// ========================================
// GET MY PROPERTIES
// ========================================

export async function getMyProperties(): Promise<PropertiesResponse> {
  try {
    const api = await serverAxios();

    const response = await api.get("/api/properties/my-properties");

    return response.data;
  } catch (error: any) {
    console.error(
      "Get landlord properties error:",
      error?.response?.data || error,
    );

    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load properties.",
      data: [],
    };
  }
}

// ========================================
// DELETE PROPERTY
// ========================================

export async function deleteProperty(propertyId: string) {
  try {
    const api = await serverAxios();

    const response = await api.delete(`/api/properties/${propertyId}`);

    return {
      success: true,
      message: response.data?.message || "Property deleted successfully.",
    };
  } catch (error: any) {
    console.error("Delete property error:", error?.response?.data || error);

    return {
      success: false,
      message: error?.response?.data?.message || "Failed to delete property.",
    };
  }
}

// ========================================
// UPDATE PROPERTY
// ========================================

export async function updateProperty(
  propertyId: string,
  data: {
    categoryId?: string;

    title?: string;
    description?: string;

    rentPrice?: number;

    bedrooms?: number;
    bathrooms?: number;
    areaSqft?: number;

    address?: string;
    city?: string;
    division?: string;
    postalCode?: string;

    latitude?: number;
    longitude?: number;

    availableFrom?: string;
  },
) {
  try {
    const api = await serverAxios();

    const response = await api.patch(`/api/properties/${propertyId}`, data);

    return {
      success: true,
      message: response.data?.message || "Property updated successfully.",
      data: response.data?.data,
    };
  } catch (error: any) {
    console.error("Update property error:", error?.response?.data || error);

    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update property.",
    };
  }
}
// ========================================
// CREATE PROPERTY
// ========================================

export async function createProperty(data: {
  categoryId: string;

  title: string;
  description: string;

  rentPrice: number;

  bedrooms: number;
  bathrooms: number;
  areaSqft: number;

  address: string;
  city: string;
  division: string;
  postalCode?: string;

  latitude?: number;
  longitude?: number;

  availableFrom: string;
}) {
  try {
    const api = await serverAxios();

    const response = await api.post("/api/properties", data);

    return {
      success: true,
      message: response.data?.message || "Property created successfully.",
      data: response.data?.data,
    };
  } catch (error: any) {
    console.error("Create property error:", error?.response?.data || error);

    return {
      success: false,
      message: error?.response?.data?.message || "Failed to create property.",
    };
  }
}
