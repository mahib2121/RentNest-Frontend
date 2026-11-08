"use server";

import { serverAxios } from "@/lib/serverAxios";
import { errorMessage, toApiError } from "@/lib/apiError";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type CategoriesResponse = {
  success: boolean;
  statusCode?: number;
  message: string;
  data: Category[];
};

export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const api = await serverAxios();

    const response = await api.get("/api/categories");

    return response.data;
  } catch (error) {
    console.error(
      "Get categories error:",
      toApiError(error).response?.data || error,
    );

    return {
      success: false,
      message: errorMessage(error, "Failed to load categories."),
      data: [],
    };
  }
}
