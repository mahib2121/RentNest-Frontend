"use server";

import { serverAxios } from "@/lib/serverAxios";

export type TenantRentalRequest = {
  id: string;
  propertyId: string;
  tenantId: string;
  moveInDate: string;
  durationMonths: number;
  message: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;

  property: {
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
    availabilityStatus: string;
  };
};

type TenantRequestsResponse = {
  success: boolean;
  message: string;
  data: TenantRentalRequest[];
};

export async function getMyRentalRequests(): Promise<TenantRequestsResponse> {
  try {
    const api = await serverAxios();

    const response = await api.get("/api/rental-requests/my-requests");

    return response.data;
  } catch (error: any) {
    console.error(
      "Get tenant rental requests error:",
      error?.response?.data || error,
    );

    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to load rental requests.",
      data: [],
    };
  }
}
