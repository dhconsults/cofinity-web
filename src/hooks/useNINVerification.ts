// // src/hooks/useNINVerification.ts
// import { useMutation } from "@tanstack/react-query";
// import { verificationService } from "@/services";
// import { useToast } from "./useToast";

// export const useNINVerification = () => {
//   const { toast } = useToast();

//   return useMutation({
//     mutationFn: ({ nin, memberId }: { nin: string; memberId: string | number }) =>
//       verificationService.verifyNIN(nin, memberId),
//     onSuccess: () => {
//       toast({ title: "NIN Verified", description: "Member NIN verified successfully" });
//     },
//     onError: () => {
//       toast({ title: "Verification Failed", description: "Invalid NIN", variant: "destructive" });
//     },
//   });
// };