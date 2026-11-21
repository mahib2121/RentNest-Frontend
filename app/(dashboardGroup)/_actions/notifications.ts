"use server";

import { serverAxios } from "@/lib/serverAxios";
import { errorMessage } from "@/lib/apiError";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  data?: {
    rentalRequestId?: string;
    propertyId?: string;
    tenantId?: string;
  } | null;
  isRead: boolean;
  createdAt: string;
};

type NotificationsResult = {
  success: boolean;
  message: string;
  data: AppNotification[];
};

/** Earlier notifications for the signed-in user, newest first. */
export async function getNotifications(): Promise<NotificationsResult> {
  try {
    const api = await serverAxios();
    const response = await api.get("/api/notifications");
    const payload = response.data?.data;

    // Accept either a bare array or a `{ notifications }` wrapper.
    const list: AppNotification[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.notifications)
        ? payload.notifications
        : [];

    return {
      success: true,
      message: response.data?.message ?? "",
      data: list,
    };
  } catch (error: unknown) {
    console.error("Get notifications error:", error);

    return {
      success: false,
      message: errorMessage(error, "Failed to load notifications."),
      data: [],
    };
  }
}

type MutationResult = { success: boolean; message: string };

/** Mark one notification as read. */
export async function markNotificationRead(
  id: string,
): Promise<MutationResult> {
  try {
    const api = await serverAxios();
    const response = await api.patch(
      `/api/notifications/${encodeURIComponent(id)}/read`,
    );

    return { success: true, message: response.data?.message ?? "" };
  } catch (error: unknown) {
    console.error("Mark notification read error:", error);

    return {
      success: false,
      message: errorMessage(error, "Failed to mark notification as read."),
    };
  }
}

/** Mark every notification for the signed-in user as read. */
export async function markAllNotificationsRead(): Promise<MutationResult> {
  try {
    const api = await serverAxios();
    const response = await api.patch("/api/notifications/read-all");

    return { success: true, message: response.data?.message ?? "" };
  } catch (error: unknown) {
    console.error("Mark all notifications read error:", error);

    return {
      success: false,
      message: errorMessage(error, "Failed to mark notifications as read."),
    };
  }
}
