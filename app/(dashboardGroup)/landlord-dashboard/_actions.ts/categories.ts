"use server";

import { serverAxios } from "@/lib/serverAxios";

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
  } catch (error: any) {
    console.error("Get categories error:", error?.response?.data || error);

    return {
      success: false,
      message: error?.response?.data?.message || "Failed to load categories.",
      data: [],
    };
  }
}
