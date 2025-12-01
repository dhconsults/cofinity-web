// src/services/payment.service.ts
import api from "@/lib/axios";

export const paymentService = {
  // Initialize funding via Nomba (returns payment link)
  async initializeFunding(data: {
    member_id: string;
    amount: number;
    email: string;
    phone: string;
    narration?: string;
  }) {
    const res = await api.post("/api/payments/nomba/initialize", data);
    return res.data; // { payment_link: "https://...", reference: "..." }
  },

  // Manual funding (admin only)
  async manualFund(data: {
    member_id: string;
    amount: number;
    narration: string;
  }) {
    const res = await api.post("/api/payments/manual/fund", data);
    return res.data.transaction;
  },
};