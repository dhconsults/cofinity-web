// src/hooks/useMembers.ts
import { useQuery } from "@tanstack/react-query";
import { membersService } from "@/services";
import type { MemberWithFullName } from "@/types";

export const useMembers = () => {
  return useQuery<MemberWithFullName[]>({
    queryKey: ["members"],
    queryFn: () => membersService.getAll(),
  });
};