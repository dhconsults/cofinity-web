// // src/hooks/useFundMember.ts
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { transactionsService } from "@/services";
// import { useToast } from "./useToast";

// export const useFundMember = () => {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();

//   return useMutation({
//     mutationFn: transactionsService.fund,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["members"] });
//       queryClient.invalidateQueries({ queryKey: ["transactions"] });
//       toast({ title: "Success", description: "Member funded successfully" });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to fund member",
//         variant: "destructive",
//       });
//     },
//   });
// };