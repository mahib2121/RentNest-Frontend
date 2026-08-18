"use server";

import { registerSchema } from "@/service/auth.schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


type LoginState = {
  success: true;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export const loginAction = async (
  prevState: LoginState,
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

  const result = await res.json();

  if (result.success) {
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    redirect("/dashboard");
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
