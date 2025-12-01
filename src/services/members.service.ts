// src/services/members.service.ts
import api from "@/lib/axios";
import { MEMBERS_API } from "@/constants/api";
import type { Member, MemberWithFullName } from "@/types";

export const membersService = {
  async getAll(): Promise<MemberWithFullName[]> {
    const res = await api.get(MEMBERS_API.LIST);
    return res.data.members;
  },

  async getById(id: number | string): Promise<Member> {
    const res = await api.get(MEMBERS_API.SHOW(id));
    return res.data.member;
  },

  async create(data: Partial<Member>) {
    const res = await api.post(MEMBERS_API.CREATE, data);
    return res.data.member;
  },

  async update(id: number | string, data: Partial<Member>) {
    const res = await api.put(MEMBERS_API.UPDATE(id), data);
    return res.data.member;
  },

  async delete(id: number | string) {
    await api.delete(MEMBERS_API.DELETE(id));
  },
};