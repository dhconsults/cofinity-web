// src/hooks/useTransactions.ts
import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "@/services";
import type { Transaction } from "@/types";

export const useTransactions = (params?: { member_id?: string }) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionsService.getAll(params),
  });
};