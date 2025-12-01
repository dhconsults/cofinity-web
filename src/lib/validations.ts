// src/lib/validations.ts
import { z } from "zod";

// Login form
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Create/Edit Member
export const memberSchema = z.object({
  first_name: z.string().min(2, "First name too short"),
  last_name: z.string().min(2, "Last name too short"),
  phone: z.string().regex(/^(\+234|0)[789]\d{9}$/, "Invalid Nigerian phone number"),
  email: z.string().email().optional().or(z.literal("")),
  bvn: z
    .string()
    .length(11, "BVN must be 11 digits")
    .optional()
    .or(z.literal("")),
  nin: z
    .string()
    .length(11, "NIN must be 11 digits")
    .optional()
    .or(z.literal("")),
});

export type MemberFormData = z.infer<typeof memberSchema>;

// Fund / Withdraw
export const transactionSchema = z.object({
  member_id: z.string().min(1, "Select a member"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  reference: z.string().optional(),
  narration: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;