// src/services/transactions.service.ts
import api from "@/lib/axios";
import { TRANSACTIONS_API } from "@/constants/api";
import type { Transaction, TransactionSummary } from "@/types";

export const transactionsService = {
  async getAll(params?: { member_id?: string; page?: number }) {
    const res = await api.get(TRANSACTIONS_API.LIST, { params });
    return res.data; // { data: Transaction[], meta: {...} }
  },

  async fund(data: { member_id: string; amount: number; narration?: string }) {
    const res = await api.post(TRANSACTIONS_API.FUND, data);
    return res.data.transaction;
  },

  async withdraw(data: { member_id: string; amount: number; narration?: string }) {
    const res = await api.post(TRANSACTIONS_API.WITHDRAW, data);
    return res.data.transaction;
  },

  async summary(): Promise<TransactionSummary> {
    const res = await api.get(`${TRANSACTIONS_API.LIST}/summary`);
    return res.data;
  },
};