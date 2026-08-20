"use server";

import axios from "axios";

import type { DashboardStats } from "../../../lib/dashboard";
import { serverAxios } from "@/lib/serverAxios";

export const getAdminDashboard = async (): Promise<DashboardStats> => {
  try {
    const api = await serverAxios();

    const response = await api.get("/api/admin/dashboard");

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Dashboard API error:", {
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard data",
      );
    }

    throw new Error("Something went wrong while fetching dashboard data");
  }
};
