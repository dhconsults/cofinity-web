// src/hooks/useMember.ts
import { useQuery } from "@tanstack/react-query";
import { membersService } from "@/services";
import type { Member } from "@/types";

export const useMember = (id: number | string) => {
  return useQuery<Member>({
    queryKey: ["members", id],
    queryFn: () => membersService.getById(id),
    enabled: !!id,
  });
};