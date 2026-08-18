import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),

  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(15, "Phone number must not exceed 15 digits"),

  role: z.enum(["TENANT", "LANDLORD"], {
    message: "Please select a valid role",
  }),
});
