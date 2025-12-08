// src/components/member/AccountOverview.tsx
import { Card } from "@/components/ui/card";
import { PiggyBank, Landmark, CreditCard, TrendingUp, Target } from "lucide-react";

export default function AccountOverview({ member }: { member: any }) {
  const savings = Number(member.total_savings || 0);
  const shares = Number(member.total_shares || 0);
  const loan = Number(member.outstanding_loan || 0);
  const target = Number(member.monthly_savings_target || 0);
  const savingsProgress = target > 0 ? Math.min((savings / target) * 100, 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Account Overview</h2>
          <p className="text-neutral-600 mt-1">Financial summary and performance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-600">Member Since</p>
          <p className="font-semibold text-neutral-900">
            {member.date_joined ? new Date(member.date_joined).toLocaleDateString("en-NG", { year: "numeric", month: "long" }) : "—"}
          </p>
        </div>
      </div>

      {/* Main Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Savings */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <PiggyBank className="w-10 h-10 opacity-90" />
              <span className="text-emerald-100 text-sm font-medium">Savings</span>
            </div>
            <p className="text-emerald-50 text-sm">Total Savings</p>
            <p className="text-3xl font-bold mt-1">₦{savings.toLocaleString()}</p>
            {target > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-emerald-100 text-xs mb-1">
                  <span>vs Target</span>
                  <span>{Math.round(savingsProgress)}%</span>
                </div>
                <div className="w-full bg-emerald-700/50 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${savingsProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Total Shares */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-none">
          <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mt-12" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-10 h-10 opacity-90" />
              <span className="text-blue-100 text-sm font-medium">Investment</span>
            </div>
            <p className="text-blue-50 text-sm">Total Shares</p>
            <p className="text-3xl font-bold mt-1">₦{shares.toLocaleString()}</p>
            {shares > 0 && (
              <p className="text-blue-100 text-xs mt-2">
                {shares >= 100000 ? "Platinum Investor" : shares >= 50000 ? "Gold Investor" : "Active Investor"}
              </p>
            )}
          </div>
        </Card>

        {/* Outstanding Loan */}
        <Card className={`relative overflow-hidden border-0 shadow-none ${loan > 0 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' : 'bg-gradient-to-br from-gray-100 to-gray-200 text-neutral-700'}`}>
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Landmark className={`w-10 h-10 ${loan > 0 ? 'opacity-90' : 'text-neutral-400'}`} />
              <span className={`text-sm font-medium ${loan > 0 ? 'text-red-100' : 'text-neutral-500'}`}>
                {loan > 0 ? "Active Loan" : "No Loan"}
              </span>
            </div>
            <p className={`text-sm ${loan > 0 ? 'text-red-50' : 'text-neutral-500'}`}>Outstanding Loan</p>
            <p className="text-3xl font-bold mt-1">₦{loan.toLocaleString()}</p>
            {loan > 0 && (
              <p className="text-red-100 text-xs mt-2 bg-red-700/30 px-3 py-1 rounded-full inline-block">
                Repayment in progress
              </p>
            )}
          </div>
        </Card>

        {/* Monthly Target */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-none">
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mb-14" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-10 h-10 opacity-90" />
              <span className="text-purple-100 text-sm font-medium">Goal</span>
            </div>
            <p className="text-purple-50 text-sm">Monthly Target</p>
            <p className="text-3xl font-bold mt-1">₦{target.toLocaleString()}</p>
            {target > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-200" />
                <span className="text-purple-100 text-xs">
                  {savings >= target ? "Target achieved!" : `${Math.round(savingsProgress)}% complete`}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="p-6 bg-gradient-to-r from-neutral-50 to-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Net Worth</p>
              <p className="text-2xl font-bold text-neutral-900">
                ₦{(savings + shares - loan).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500">Savings + Shares - Loan</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-700">Savings Rate</p>
              <p className="text-2xl font-bold text-amber-900">
                {target > 0 ? `${Math.round((savings / target) * 100)}%` : "N/A"}
              </p>
            </div>
            {savings >= target ? (
              <span className="text-3xl">Top performer</span>
            ) : (
              <span className="text-3xl">Keep going</span>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-700">Member Status</p>
              <p className="text-2xl font-bold text-indigo-900 capitalize">
                {loan > 100000 ? "Premium" : shares > 50000 ? "Gold" : "Standard"} Member
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">Crown</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}