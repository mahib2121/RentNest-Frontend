"use server";

import { serverAxios } from "@/lib/serverAxios";
import { errorMessage, toApiError } from "@/lib/apiError";

export type CheckoutState = {
  success: boolean;
  message: string;
  paymentUrl?: string;
};

export async function createCheckout(
  rentalRequestId: string,
): Promise<CheckoutState> {
  try {
    const api = await serverAxios();

    const response = await api.post("/api/payments/checkout", {
      rentalRequestId,
    });

    return {
      success: true,
      message: response.data?.message || "Checkout created successfully.",
      paymentUrl: response.data?.data?.paymentUrl,
    };
  } catch (error) {
    console.error(
      "Create checkout error:",
      toApiError(error).response?.data || error,
    );

    return {
      success: false,
      message: errorMessage(
        error,
        "Failed to create payment checkout.",
      ),
    };
  }
}
