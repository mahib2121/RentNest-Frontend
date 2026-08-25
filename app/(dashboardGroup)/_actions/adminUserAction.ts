"use server";

import axios from "axios";
import { serverAxios } from "@/lib/serverAxios";

import type { AdminUser } from "@/lib/adminUser";

export const getUserAction = async (): Promise<AdminUser[]> => {
  try {
    const api = await serverAxios();

    const response = await api.get("/api/admin/users");

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }

    throw new Error("Something went wrong while fetching users");
  }
};
export const updateUserAction = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    role?: "TENANT" | "LANDLORD" | "ADMIN";
  },
) => {
  try {
    const api = await serverAxios();

    const response = await api.put(`/api/admin/users/${id}`, data);

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }

    throw new Error("Something went wrong");
  }
};

export const updateUserStatusAction = async (
  id: string,
  status: "ACTIVE" | "BANNED",
) => {
  try {
    const api = await serverAxios();

    const response = await api.patch(`/api/admin/users/${id}/status`, {
      status,
    });

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update user status",
      );
    }

    throw new Error("Something went wrong");
  }
};

export const deleteUserAction = async (id: string) => {
  try {
    const api = await serverAxios();

    const response = await api.delete(`/api/admin/users/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }

    throw new Error("Something went wrong");
  }
};
