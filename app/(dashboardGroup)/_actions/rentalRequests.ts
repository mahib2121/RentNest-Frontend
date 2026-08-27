// "use server";

// import { serverAxios } from "@/lib/serverAxios";

// export type RentalRequestStatus =
//   | "PENDING"
//   | "APPROVED"
//   | "REJECTED"
//   | "CANCELLED"
//   | "CONFIRMED";

// export type LandlordRentalRequest = {
//   id: string;
//   propertyId: string;
//   tenantId: string;
//   moveInDate: string;
//   durationMonths: number;
//   message: string | null;
//   status: RentalRequestStatus;
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

//   tenant: {
//     id: string;
//     name: string;
//     email: string;
//   };
// };

// type RentalRequestsResponse = {
//   success: boolean;
//   message: string;
//   data: LandlordRentalRequest[];
// };

// export async function getLandlordRentalRequests(): Promise<RentalRequestsResponse> {
//   try {
//     const api = await serverAxios();

//     const response = await api.get("/api/rental-requests");

//     return response.data;
//   } catch (error: any) {
//     console.error(
//       "Get landlord rental requests error:",
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

// export async function updateRentalRequestStatus(
//   requestId: string,
//   status: "APPROVED" | "REJECTED",
// ) {
//   try {
//     const api = await serverAxios();

//     const response = await api.patch(`/api/rental-requests/${requestId}`, {
//       status,
//     });

//     return {
//       success: true,
//       message:
//         response.data?.message ||
//         `Request ${status.toLowerCase()} successfully.`,
//       data: response.data?.data,
//     };
//   } catch (error: any) {
//     console.error(
//       "Update rental request error:",
//       error?.response?.data || error,
//     );

//     return {
//       success: false,
//       message:
//         error?.response?.data?.message || "Failed to update rental request.",
//     };
//   }
// }
"use server";

import axios from "axios";
import { serverAxios } from "@/lib/serverAxios";

export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "CONFIRMED";

export type LandlordRentalRequest = {
  id: string;
  propertyId: string;
  tenantId: string;
  moveInDate: string;
  durationMonths: number;
  message: string | null;
  status: RentalRequestStatus;
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
  tenant: {
    id: string;
    name: string;
    email: string;
  };
};

type RentalRequestsResponse = {
  success: boolean;
  message: string;
  data: LandlordRentalRequest[];
};

export async function getLandlordRentalRequests(): Promise<RentalRequestsResponse> {
  try {
    const api = await serverAxios();
    const response = await api.get("/api/rental-requests");

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Get landlord rental requests error:",
        error.response?.data,
      );
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
      message: "An unexpected error occurred while loading requests.",
      data: [],
    };
  }
}

export async function updateRentalRequestStatus(
  requestId: string,
  status: "APPROVED" | "REJECTED",
) {
  try {
    const api = await serverAxios();
    const response = await api.patch(`/api/rental-requests/${requestId}`, {
      status,
    });

    return {
      success: true,
      message:
        response.data?.message ||
        `Request ${status.toLowerCase()} successfully.`,
      data: response.data?.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Update rental request error:", error.response?.data);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update rental request.",
      };
    }

    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the request.",
    };
  }
}
