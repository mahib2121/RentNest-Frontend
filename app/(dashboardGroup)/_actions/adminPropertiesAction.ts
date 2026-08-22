import type { AdminProperty } from "@/lib/adminUser";
import { serverAxios } from "@/lib/serverAxios";
import axios from "axios";

export const getAllProperties = async (): Promise<AdminProperty[]> => {
  try {
    const api = await serverAxios();

    const response = await api.get("/api/admin/properties");

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }

    throw new Error("Something went wrong while fetching users");
  }
};
