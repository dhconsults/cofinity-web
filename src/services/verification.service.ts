// src/services/verification.service.ts
import api from "@/lib/axios";
import { VERIFICATION_API } from "@/constants/api";

export const verificationService = {
  async verifyBVN(bvn: string, memberId: number | string) {
    const res = await api.post(VERIFICATION_API.BVN, {
      bvn,
      member_id: memberId,
    });
    return res.data; // { verified: true, data: {...} }
  },

  async verifyNIN(nin: string, memberId: number | string) {
    const res = await api.post(VERIFICATION_API.NIN, {
      nin,
      member_id: memberId,
    });
    return res.data;
  },
};