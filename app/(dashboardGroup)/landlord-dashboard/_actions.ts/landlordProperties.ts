"use server";

import { updateTag } from "next/cache";

import { serverAxios } from "@/lib/serverAxios";
import { errorMessage, toApiError } from "@/lib/apiError";
import {
  normalizeImages,
  type PropertyImage,
  type RawPropertyImage,
} from "@/lib/propertyImages";
import {
  PROPERTIES_TAG,
  propertyTag,
} from "@/app/(publicGroup)/_actions/property";

/**
 * Expire the cached public listings after a successful write, so the home
 * page, /properties and the detail page show the change on the next request.
 * Called only after the backend accepted the change.
 */
function invalidateListing(propertyId?: string) {
  updateTag(PROPERTIES_TAG);

  if (propertyId) {
    updateTag(propertyTag(propertyId));
  }
}

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

  images?: RawPropertyImage[];

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
  } catch (error) {
    console.error(
      "Get landlord properties error:",
      toApiError(error).response?.data || error,
    );

    return {
      success: false,
      message: errorMessage(error, "Failed to load properties."),
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

    invalidateListing(propertyId);

    return {
      success: true,
      message: response.data?.message || "Property deleted successfully.",
    };
  } catch (error) {
    console.error(
      "Delete property error:",
      toApiError(error).response?.data || error,
    );

    return {
      success: false,
      message: errorMessage(error, "Failed to delete property."),
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

    invalidateListing(propertyId);

    return {
      success: true,
      message: response.data?.message || "Property updated successfully.",
      data: response.data?.data,
    };
  } catch (error) {
    console.error(
      "Update property error:",
      toApiError(error).response?.data || error,
    );

    return {
      success: false,
      message: errorMessage(error, "Failed to update property."),
    };
  }
}
// ========================================
// CREATE PROPERTY
// ========================================

/**
 * Creates a listing. Takes form-data so images can travel with it:
 * `data` is the property fields as a JSON string and `images` are the files.
 * Without images the fields are sent as a plain JSON body, as before.
 */
export async function createProperty(formData: FormData) {
  try {
    const api = await serverAxios();

    const images = getImageFiles(formData);
    const data = JSON.parse(String(formData.get("data") ?? "{}"));

    let body: FormData | Record<string, unknown> = data;

    if (images.length > 0) {
      body = new FormData();
      body.append("data", JSON.stringify(data));
      images.forEach((file) => (body as FormData).append("images", file));
    }

    const response = await api.post("/api/properties", body);

    invalidateListing();

    return {
      success: true,
      message: response.data?.message || "Property created successfully.",
      data: response.data?.data,
    };
  } catch (error) {
    console.error(
      "Create property error:",
      toApiError(error).response?.data || error,
    );

    return {
      success: false,
      message: errorMessage(error, "Failed to create property."),
    };
  }
}

// ========================================
// PROPERTY IMAGES
// ========================================

function getImageFiles(formData: FormData): File[] {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

type ImageActionResult = {
  success: boolean;
  message: string;
  images?: PropertyImage[];
};

/** Reads the image list out of whatever the image endpoints return. */
function imagesFrom(payload: unknown): PropertyImage[] | undefined {
  const data = (payload as { data?: unknown } | undefined)?.data;

  if (Array.isArray(data)) return normalizeImages(data);

  const images = (data as { images?: unknown } | undefined)?.images;

  return Array.isArray(images) ? normalizeImages(images) : undefined;
}

export async function uploadPropertyImages(
  propertyId: string,
  formData: FormData,
): Promise<ImageActionResult> {
  try {
    const files = getImageFiles(formData);

    if (files.length === 0) {
      return { success: false, message: "Choose at least one image." };
    }

    const body = new FormData();
    files.forEach((file) => body.append("images", file));

    const api = await serverAxios();
    const response = await api.post(
      `/api/properties/${propertyId}/images`,
      body,
    );

    invalidateListing(propertyId);

    return {
      success: true,
      message: response.data?.message || "Images uploaded.",
      images: imagesFrom(response.data),
    };
  } catch (error) {
    console.error(
      "Upload property images error:",
      toApiError(error).response?.data || error,
    );

    return {
      success: false,
      message: errorMessage(error, "Failed to upload images."),
    };
  }
}

export async function setPropertyCoverImage(
  propertyId: string,
  imageId: string,
): Promise<ImageActionResult> {
  try {
    const api = await serverAxios();
    const response = await api.patch(
      `/api/properties/${propertyId}/images/${imageId}/cover`,
    );

    invalidateListing(propertyId);

    return {
      success: true,
      message: response.data?.message || "Cover image updated.",
      images: imagesFrom(response.data),
    };
  } catch (error) {
    console.error(
      "Set cover image error:",
      toApiError(error).response?.data || error,
    );

    return {
      success: false,
      message: errorMessage(error, "Failed to set the cover image."),
    };
  }
}

export async function deletePropertyImage(
  propertyId: string,
  imageId: string,
): Promise<ImageActionResult> {
  try {
    const api = await serverAxios();
    const response = await api.delete(
      `/api/properties/${propertyId}/images/${imageId}`,
    );

    invalidateListing(propertyId);

    return {
      success: true,
      message: response.data?.message || "Image deleted.",
      images: imagesFrom(response.data),
    };
  } catch (error) {
    console.error(
      "Delete property image error:",
      toApiError(error).response?.data || error,
    );

    return {
      success: false,
      message: errorMessage(error, "Failed to delete the image."),
    };
  }
}
