"use server";

import { registerSchema } from "@/service/auth.schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";

type LoginResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
};

export const loginAction = async (
  prevState: LoginResponse,
  formData: FormData,
) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const payload = {
    email,
    password,
  };

  const res = await fetch(`${process.env.APIurl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: LoginResponse = await res.json();

  if (result.success) {
    if (!result.data?.accessToken || !result.data?.refreshToken) {
      throw new Error("Authentication tokens are missing");
    }

    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    const decodeToken = jwt.decode(
      result.data.accessToken,
    ) as JwtPayload | null;

    if (!decodeToken?.role) {
      throw new Error("Invalid access token");
    }

    if (decodeToken.role === "ADMIN") {
      redirect("/admin-dashboard");
    }

    if (decodeToken.role === "LANDLORD") {
      redirect("/landlord-dashboard");
    }

    if (decodeToken.role === "TENANT") {
      redirect("/tenant-dashboard");
    }
  }

  return result;
};

// ==================== REGISTER ====================

export type RegisterState = {
  success: boolean;
  statusCode?: number;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    phone?: string[];
    role?: string[];
  };
};

export const registerAction = async (
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> => {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    role: formData.get("role"),
  };

  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the validation errors.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  const validatedData = result.data;

  const res = await fetch(`${process.env.APIurl}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData),
  });

  const response = await res.json();

  if (!res.ok || !response.success) {
    return {
      success: false,
      statusCode: res.status,
      message: response.message || "Registration failed.",
    };
  }

  return {
    success: true,
    statusCode: res.status,
    message: response.message || "Registration successful.",
  };
};
