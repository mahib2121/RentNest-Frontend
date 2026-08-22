import type { AdminRentalRequest } from "@/lib/adminUser";
import { serverAxios } from "@/lib/serverAxios";
import axios from "axios";

export const getAdminRentalRequests = async (): Promise<
  AdminRentalRequest[]
> => {
  try {
    const api = await serverAxios();

    const response = await api.get("/api/admin/rentals");

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch rental requests",
      );
    }

    throw new Error("Something went wrong while fetching rental requests");
  }
};
