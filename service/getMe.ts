"use server";

import { cookies } from "next/headers";

export const getMe = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  try {
    const res = await fetch(`${process.env.APIurl}/api/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to get user information.",
      };
    }

    return result;
  } catch (error) {
    console.error("Failed to get current user:", error);

    return {
      success: false,
      message: "Failed to get user information.",
    };
  }
};
