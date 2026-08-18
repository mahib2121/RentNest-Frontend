"use server";

import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("accessToken")?.value || null;

  if (!refreshToken) {
    // throw new Error("User Not Logged In!");

    return {
      success: false,
      message: " refreshToken not found ",
    };
  }

  const res = await fetch(`${process.env.APIurl}/api/auth/refresh-token`, {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },

    cache: "no-cache",
  });

  const result = res.json();

  return result;
};
