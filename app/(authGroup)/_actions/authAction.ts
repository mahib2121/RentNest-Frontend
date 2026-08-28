"use server";

import { registerSchema } from "@/service/auth.schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";

// ==================== LOGIN ====================

export type LoginResponse = {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
};

export const loginAction = async (
  prevState: LoginResponse,
  formData: FormData,
): Promise<LoginResponse> => {
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
    // Make sure tokens exist before setting cookies
    if (!result.data?.accessToken || !result.data?.refreshToken) {
      throw new Error("Authentication tokens are missing");
    }

    const cookieStore = await cookies();

    // Access token
    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });

    // Refresh token
    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    // Decode access token to determine user role
    const decodeToken = jwt.decode(
      result.data.accessToken,
    ) as JwtPayload | null;

    if (!decodeToken?.role) {
      throw new Error("Invalid access token");
    }

    // Redirect according to role
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

  // Validate form data with Zod
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the validation errors.",
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Zod-validated data
  const validatedData = result.data;

  // Send validated data to backend
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
