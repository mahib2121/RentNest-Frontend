"use server";

import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  if (!refreshToken) {

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
