"use server";

import { serverAxios } from "@/lib/serverAxios";
import { errorMessage, toApiError } from "@/lib/apiError";

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
  } catch (error) {
    console.error(
      "Create rental request error:",
      toApiError(error).response?.data || error,
    );

    return {
      success: false,
      message: errorMessage(
        error,
        "Failed to create rental request.",
      ),
    };
  }
}
