import type { Member } from "./member.types";

// src/types/transaction.types.ts
export type Transaction = {
  id: number;
  tenant_id: number;
  member_id: number;
  member?: Pick<Member, "id" | "first_name" | "last_name" | "phone">;
  type: "credit" | "debit"; // credit = fund, debit = withdraw
  amount: number; // in kobo
  balance_before: number;
  balance_after: number;
  reference: string;
  narration?: string | null;
  channel: "nomba" | "manual" | "adjustment";
  status: "pending" | "successful" | "failed" | "reversed";
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type TransactionSummary = {
  total_credited: number;
  total_debited: number;
  net_balance: number;
};