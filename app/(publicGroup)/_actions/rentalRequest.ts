"use server";

import { serverAxios } from "@/lib/serverAxios";

export type RentalRequestState = {
  success: boolean;
  message: string;
};

export async function createRentalRequest(
  propertyId: string,
  moveInDate: string,
  durationMonths: number,
): Promise<RentalRequestState> {
  try {
    const api = await serverAxios();

    const response = await api.post("/api/rental-requests", {
      propertyId,
      moveInDate,
      durationMonths,
    });

    return {
      success: true,
      message:
        response.data?.message || "Rental request submitted successfully.",
    };
  } catch (error: any) {
    console.error(
      "Create rental request error:",
      error?.response?.data || error,
    );

    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to create rental request.",
    };
  }
}
