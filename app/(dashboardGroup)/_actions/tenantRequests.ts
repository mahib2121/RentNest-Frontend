// "use server";

// import { serverAxios } from "@/lib/serverAxios";

// export type TenantRentalRequest = {
//   id: string;
//   propertyId: string;
//   tenantId: string;

//   moveInDate: string;
//   durationMonths: number;
//   message: string | null;

//   status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "CONFIRMED";

//   createdAt: string;
//   updatedAt: string;

//   property: {
//     id: string;
//     title: string;
//     description: string;
//     rentPrice: string;
//     bedrooms: number;
//     bathrooms: number;
//     areaSqft: number;
//     address: string;
//     city: string;
//     division: string;
//     postalCode: string;
//     availabilityStatus: string;
//   };

//   payment: {
//     id: string;
//     transactionId: string;
//     rentalRequestId: string;
//     amount: string;
//     method: string;
//     provider: string;
//     status: "PENDING" | "SUCCESS" | "FAILED";
//     paidAt: string | null;
//   } | null;
// };

// type TenantRequestsResponse = {
//   success: boolean;
//   message: string;
//   data: TenantRentalRequest[];
// };

// export async function getMyRentalRequests(): Promise<TenantRequestsResponse> {
//   try {
//     const api = await serverAxios();

//     const response = await api.get("/api/rental-requests/my-requests");

//     return response.data;
//   } catch (error: any) {
//     console.error(
//       "Get tenant rental requests error:",
//       error?.response?.data || error,
//     );

//     return {
//       success: false,
//       message:
//         error?.response?.data?.message || "Failed to load rental requests.",
//       data: [],
//     };
//   }
// }
"use server";

import axios from "axios";
import { serverAxios } from "@/lib/serverAxios";

// Consider moving shared types like this property object to a global `types.ts` file later!
export type TenantRentalRequest = {
  id: string;
  propertyId: string;
  tenantId: string;
  moveInDate: string;
  durationMonths: number;
  message: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "CONFIRMED";
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
  payment: {
    id: string;
    transactionId: string;
    rentalRequestId: string;
    amount: string;
    method: string;
    provider: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
    paidAt: string | null;
  } | null;
};

type TenantRequestsResponse = {
  success: boolean;
  message: string;
  data: TenantRentalRequest[];
};

export async function getMyRentalRequests(): Promise<TenantRequestsResponse> {
  try {
    const api = await serverAxios();

    // UPDATED: Added headers to aggressively bypass browser and Next.js caching
    const response = await api.get("/api/rental-requests/my-requests", {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Get tenant rental requests error:", error.response?.data);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to load rental requests.",
        data: [],
      };
    }

    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while loading your requests.",
      data: [],
    };
  }
}
