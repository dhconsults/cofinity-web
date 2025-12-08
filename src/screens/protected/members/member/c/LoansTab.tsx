// src/components/member/LoansTab.tsx
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Landmark, Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";

export default function LoansTab({ memberId }: { memberId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["loans", memberId],
    queryFn: async () => apiClient.get(MEMBERS_API.LOANS(memberId)),
  });

  const loans = data?.data || [];

  if (isLoading) return <div className="space-y-6"><div className="h-10 w-48 bg-neutral-200 rounded animate-pulse" /><div className="h-64 bg-neutral-100 rounded-xl animate-pulse" /></div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Loan Portfolio</h2>

      {loans.length === 0 ? (
        <Card className="p-16 text-center bg-gradient-to-br from-neutral-50 to-neutral-100">
          <Landmark className="w-20 h-20 text-neutral-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-neutral-700">No Active Loans</h3>
          <p className="text-neutral-600 mt-2">This member has a clean credit record</p>
        </Card>
      ) : (
        loans.map((loan: any) => {
          const progress = ((loan.amount - loan.outstanding_balance) / loan.amount) * 100;

          return (
            <Card key={loan.id} className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">Loan #{loan.reference}</h3>
                  <p className="text-blue-700">Purpose: {loan.purpose || "General"}</p>
                </div>
                <Badge variant={loan.status === "active" ? "default" : loan.status === "paid" ? "outline" : "secondary"} className="text-lg px-4 py-2">
                  {loan.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-blue-700">Principal</p>
                  <p className="text-2xl font-bold text-blue-900">₦{Number(loan.amount).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-red-700">Outstanding</p>
                  <p className="text-2xl font-bold text-red-900">₦{Number(loan.outstanding_balance).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-neutral-700">Monthly</p>
                  <p className="text-2xl font-bold">₦{Number(loan.monthly_repayment).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-neutral-700">Next Due</p>
                  <p className="text-xl font-bold text-blue-800">
                    {loan.next_payment_due ? format(new Date(loan.next_payment_due), "dd MMM yyyy") : "—"}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-700">Repayment Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-4" />
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}