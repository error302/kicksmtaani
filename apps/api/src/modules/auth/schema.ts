import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^\+254[7-9]\d{8}$/,
      "Invalid Kenyan phone number (e.g., +254712345678)",
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
