/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/member/LoansTab.tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Landmark,
  AlertCircle,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  Ban,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";
import { cn, formatCurrency } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface Loan {
  id: number;
  reference: string;
  purpose?: string;
  amount: number;
  amount_paid: number;
  outstanding_balance: number;
  interest_amount: number;
  principal_amount: number | string;
  total_payable: number | string;
  loan_id: string;
  next_payment_date?: string;
  monthly_repayment?: number;
  next_payment_due?: string;
  notes: string;
  term: string;
  term_period: string;
  status:
    | "active"
    | "paid"
    | "overdue"
    | "defaulted"
    | "pending"
    | "disbursed"
    | string;
  created_at?: string;
}

export default function LoansTab({ memberId }: { memberId: number }) {
  const { data, isLoading, isError } = useQuery<Loan[]>({
    queryKey: ["member-loans", memberId],
    queryFn: async () => {
      const res = await apiClient.get(MEMBERS_API.LOANS(memberId));
      return res.data?.loans || res.data || [];
    },
  });

  const loans = data || [];
  const navigate = useNavigate();

  // Quick summary stats
  const activeLoans = loans.filter((l) => l.status === "disbursed").length;
  const totalOutstanding = loans.reduce(
    (sum, l) => sum + Number(l.outstanding_balance || 0),
    0
  );

  if (isLoading) {
    return <LoansTabSkeleton />;
  }

  if (isError) {
    return (
      <Card className="p-10 text-center border-destructive/30">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-destructive">
          Failed to load loans
        </h3>
        <p className="text-muted-foreground mt-2">Please try again later</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Loan Portfolio
          </h2>
          <p className="text-muted-foreground mt-1">
            {activeLoans} active loan{activeLoans !== 1 ? "s" : ""}
            {activeLoans > 0 &&
              ` • ₦${totalOutstanding.toLocaleString()} outstanding`}
          </p>
        </div>

        {/* Optional: Add new loan button (if your system allows admins to initiate loans from here) */}
        <Button onClick={() => navigate("/loans/create")}>
          <Plus className="w-4 h-4 mr-2" />
          New Loan
        </Button>
      </div>

      {loans.length === 0 ? (
        <EmptyLoansState />
      ) : (
        <div className="grid gap-6">
          {loans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}
    </div>
  );
}

function LoanCard({ loan }: { loan: Loan }) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState("");
  const [selectedInstallment, setSelectedInstallment] = useState("");

  const [formData, setFormData] = useState({
    payment_date: new Date().toISOString().split("T")[0],
    amount_paid: "",
    debit_account: "Cash",
    remarks: "",
  });

  const REPAID_API = "/api/loan-repayments";
  const LOANS_API = "/api/loans/select-options";
  const PAYABLE_API = (loanId: string) =>
    `/api/loans/${loanId}/payable-installments`;

  interface Repayment {
    id: number;
    loan_id: string;
    member_name: string;
    formatted_payment_date: string;
    principal_amount: number;
    interest_amount: number;
    late_penalties: number;
    total_amount: number;
    debit_account: string;
    remarks?: string;
  }

  interface LoanOption {
    id: string;
    label: string;
  }

  interface Installment {
    id: number;
    formatted_date: string;
    balance_due: number;
    is_overdue: boolean;
    days_overdue: number;
  }

  const { data: installments = [], isFetching: loadingInst } = useQuery<
    Installment[]
  >({
    queryKey: ["payable-installments", loan.id],
    queryFn: () =>
      apiClient
        .get(`/api/loans/${loan.id}/payable-installments`)
        .then((res) => res.data),
    enabled: isDialogOpen, // only fetch when dialog is actually open
  });

  const selectedInstallmentData = installments.find(
    (i) => i.id.toString() === selectedInstallment
  );

  const amountPaid = parseFloat(formData.amount_paid) || 0;
  const isOverpaying =
    selectedInstallmentData && amountPaid > selectedInstallmentData.balance_due;

  const recordMutation = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/loan-repayments/${selectedInstallment}/pay`, {
        payment_date: formData.payment_date,
        amount_paid: parseFloat(formData.amount_paid),
        debit_account: formData.debit_account,
        remarks: formData.remarks,
      }),
    onSuccess: () => {
      toast.success("Repayment recorded successfully");
      queryClient.invalidateQueries({
        queryKey: ["member-loans", loan.member_id],
      }); // optional: refresh parent list
      queryClient.invalidateQueries({
        queryKey: ["payable-installments", loan.id],
      });
      setIsDialogOpen(false);
      setSelectedInstallment("");
      setFormData({
        payment_date: new Date().toISOString().split("T")[0],
        amount_paid: "",
        debit_account: "Cash",
        remarks: "",
      });
    },
    onError: (error: any) =>
      toast.error("Failed to record repayment", { description: error.message }),
  });

  const repaidAmount =
    Number(loan.total_payable) - Number(loan.outstanding_balance);
  const progress =
    Number(loan.total_payable) > 0
      ? (repaidAmount / Number(loan.total_payable)) * 100
      : 0;

  const statusConfig = {
    disbursed: {
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: Clock,
    },
    paid: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: CheckCircle2,
    },
    overdue: {
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: AlertCircle,
    },
    active: { color: "bg-red-100 text-red-800 border-red-200", icon: Ban },
    pending: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Calendar,
    },
  };

  const statusStyle = statusConfig[
    loan.status as keyof typeof statusConfig
  ] || {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: CreditCard,
  };

  const StatusIcon = statusStyle.icon;

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 md:p-7">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Landmark className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Loan #{loan.loan_id}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {loan.notes || "General Purpose"}
                </p>
              </div>
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "text-sm font-medium px-4 py-1.5 border",
              statusStyle.color
            )}
          >
            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
            {loan.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-7">
          <StatItem
            icon={DollarSign}
            label="Principal"
            value={`₦${Number(loan.principal_amount).toLocaleString()}`}
            valueClass="text-emerald-700"
          />
          <StatItem
            icon={AlertCircle}
            label="Outstanding"
            value={`₦${Number(loan.outstanding_balance).toLocaleString()}`}
            valueClass="text-amber-700 font-semibold"
          />
          <StatItem
            icon={Calendar}
            label="Term Period"
            value={loan.term ? `${loan.term} ${loan.term_period}` : "—"}
          />
          <StatItem
            icon={Clock}
            label="Next Payment Date"
            value={
              loan.next_payment_date
                ? format(new Date(loan.next_payment_date), "dd MMM yyyy")
                : "—"
            }
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Repayment Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress
            value={progress}
            className="h-3"
            indicatorClassName={
              progress === 100 ? "bg-emerald-600" : "bg-primary"
            }
          />
        </div>

        {/* add a button to add repayment and also to view loan details */}
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => navigate(`/loans/${loan.id}`)}
            variant="outline"
          >
            View Details
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Record Repayment
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Record Repayment - Loan #{loan.loan_id}
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (selectedInstallment) recordMutation.mutate();
                }}
                className="space-y-6"
              >
                {/* Installment Selection */}
                <div className="space-y-2">
                  <Label>Installment to Pay</Label>
                  <Select
                    value={selectedInstallment}
                    onValueChange={setSelectedInstallment}
                    disabled={loadingInst || installments.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          loadingInst
                            ? "Loading installments..."
                            : installments.length === 0
                            ? "No pending installments"
                            : "Select installment"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {installments.map((inst) => (
                        <SelectItem key={inst.id} value={inst.id.toString()}>
                          {inst.formatted_date} —{" "}
                          {formatCurrency(inst.balance_due)}
                          {inst.is_overdue &&
                            ` (Overdue ${inst.days_overdue}d)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Date */}
                <div className="space-y-2">
                  <Label>Payment Date</Label>
                  <Input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        payment_date: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Amount Paid */}
                <div className="space-y-2">
                  <Label>Amount Paid</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount_paid}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        amount_paid: e.target.value,
                      }))
                    }
                  />
                  {isOverpaying && selectedInstallmentData && (
                    <p className="text-sm text-amber-600 mt-1 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Exceeds due amount (
                      {formatCurrency(selectedInstallmentData.balance_due)})
                    </p>
                  )}
                </div>

                {/* Debit Account */}
                <div className="space-y-2">
                  <Label>Debit Account</Label>
                  <Select
                    value={formData.debit_account}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, debit_account: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="Savings Deduction">
                        Savings Deduction
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <Label>Remarks (Optional)</Label>
                  <Textarea
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, remarks: e.target.value }))
                    }
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      recordMutation.isPending ||
                      !selectedInstallment ||
                      amountPaid <= 0
                    }
                  >
                    {recordMutation.isPending
                      ? "Recording..."
                      : "Record Payment"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
  valueClass = "",
}: {
  icon: any;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="text-center p-4 bg-muted/40 rounded-lg">
      <Icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-lg font-semibold mt-1", valueClass)}>{value}</p>
    </div>
  );
}

function EmptyLoansState() {
  return (
    <Card className="p-12 md:p-16 text-center border-dashed">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-6">
        <Landmark className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-3">No Loans Yet</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        This member has a clean credit record with no active or previous loans.
      </p>
      {/* <Button variant="outline">
        View Loan Products
      </Button> */}
    </Card>
  );
}

function LoansTabSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-7">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-64" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="text-center space-y-3">
                  <Skeleton className="h-5 w-16 mx-auto" />
                  <Skeleton className="h-8 w-32 mx-auto" />
                </div>
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
