// // src/hooks/useBVNVerification.ts
// import { useMutation } from "@tanstack/react-query";
// import { verificationService } from "@/services";
// import { useToast } from "./useToast";

// export const useBVNVerification = () => {
//   const { toast } = useToast();

//   return useMutation({
//     mutationFn: ({ bvn, memberId }: { bvn: string; memberId: string | number }) =>
//       verificationService.verifyBVN(bvn, memberId),
//     onSuccess: () => {
//       toast({ title: "BVN Verified", description: "Member BVN verified successfully" });
//     },
//     onError: () => {
//       toast({ title: "Verification Failed", description: "Invalid BVN", variant: "destructive" });
//     },
//   });
// };