// src/components/loans/LoanKeyInfoCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, Percent, User, HandCoins } from "lucide-react";
import { format } from "date-fns";

interface LoanKeyInfoProps {
  loan: {
    first_repayment_date: string | null;     // renamed from first_payment_date
    disbursed_at: string | null;             // this is your "Release Date"
    principal_amount: number;
    amount_paid: number;
    outstanding_balance: number;
    interest_amount: number;                  // total interest payable
    total_penalties_paid?: number;            // if you have this calculated
    late_payment_penalty_rate?: number;
    disburse_method?: string;
    approved_at?: string | null;
    creator?: { first_name: string; last_name: string } | null;
    approver?: { first_name: string; last_name: string } | null;
    disburser?: { first_name: string; last_name: string } | null;

     total_interest_paid: number;
     total_principal_paid: number; 
     total_interest_payable: number;

  };
}

export function LoanKeyInfoCard({ loan }: LoanKeyInfoProps) {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return format(new Date(date), "dd/MMM/yyyy");
  };

  const fullName = (person: { first_name: string; last_name: string } | null | undefined) => {
    if (!person) return "—";
    return `${person.first_name} ${person.last_name}`.trim();
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <HandCoins className="h-5 w-5" />
          Key Loan Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Payment Date */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">First Payment Date</dt>
              <dd className="text-base">{formatDate(loan.first_repayment_date)}</dd>
            </div>
          </div>

          {/* Release Date (Disbursed At) */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Release Date</dt>
              <dd className="text-base">{formatDate(loan.disbursed_at)}</dd>
            </div>
          </div>

          {/* Applied / Principal Amount */}
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Applied Amount</dt>
              <dd className="text-base font-semibold">{formatCurrency(loan.principal_amount)}</dd>
            </div>
          </div>

          {/* Due / Outstanding Balance */}
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Due Amount</dt>
              <dd className="text-base font-semibold text-red-600">
                {formatCurrency(loan.outstanding_balance)}
              </dd>
            </div>
          </div>

          {/* Total Principal Paid */}
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Principal Paid</dt>
              <dd className="text-base">
                {formatCurrency(loan.amount_paid)} {/* assuming amount_paid = principal paid */}
              </dd>
            </div>
          </div>

          {/* Total Interest Paid */}
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Interest Paid</dt>
              <dd className="text-base">
                {formatCurrency(loan.interest_amount ? loan.interest_amount - (loan.interest_amount /* calculate paid */) : 0)}
                {/* Adjust if you have a separate total_interest_paid field */}
              </dd>
            </div>
          </div>

          {/* Total Penalties Paid */}
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Penalties Paid</dt>
              <dd className="text-base">{formatCurrency(loan.total_penalties_paid ?? 0)}</dd>
            </div>
          </div>

          {/* Late Payment Penalty Rate */}
          <div className="flex items-start gap-3">
            <Percent className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Late Payment Penalties</dt>
              <dd className="text-base">
                {(loan.late_payment_penalty_rate ?? 0).toFixed(2)} %
              </dd>
            </div>
          </div>


          {/* total_interest_paid: number;
     total_principal_paid: number; 
     total_interest_payable: number; */}


          {/* Disburse Method */}
          <div className="flex items-start gap-3">
            <div className="h-5 w-5" /> {/* spacer */}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Interest Paid</dt>
              <dd className="text-base capitalize">{loan.total_interest_paid || "—"}</dd>
            </div>
          </div>


          <div className="flex items-start gap-3">
            <div className="h-5 w-5" /> {/* spacer */}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Principal Paid</dt>
              <dd className="text-base capitalize">{loan.total_principal_paid || "—"}</dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-5 w-5" /> {/* spacer */}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Total Interest Payable</dt>
              <dd className="text-base capitalize">{loan.total_interest_payable || "—"}</dd>
            </div>
          </div>

          {/* Approved Date */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Approved Date</dt>
              <dd className="text-base">{formatDate(loan.disbursed_at)}</dd>
            </div>
          </div>

          {/* Approved By */}
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Approved By</dt>
              <dd className="text-base">{fullName(loan.approver)}</dd>
            </div>
          </div>

          {/* Created By */}
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created By</dt>
              <dd className="text-base">{fullName(loan.creator)}</dd>
            </div>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}