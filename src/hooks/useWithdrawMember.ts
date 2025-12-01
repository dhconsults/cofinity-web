// src/hooks/useWithdrawMember.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "@/services";
import { useToast } from "./useToast";

export const useWithdrawMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: transactionsService.withdraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
       toast.success("Withdrawal successful!", {
          description: "Your withdrawal was successful",
        });
  
    },
    onError: (error: any) => {

      toast.error( "Withdrawal Failed", 
        error.response?.data?.message || "Withdrawal failed",
       );
    },
  });
};