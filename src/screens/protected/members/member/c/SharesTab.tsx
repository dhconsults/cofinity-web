// src/components/member/SharesTab.tsx
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Coins, Calendar, DollarSign, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

interface ShareAccount {
  id: number;
  tenant_id: number;
  member_id: number;
  shares_plan_id: number;
  savings_account_id?: number;
  total_units: string; // decimal string
  total_value: string; // decimal string
  is_active: boolean;
  meta: any | null;
  created_at: string;
  updated_at: string;
  // Optional: we can fetch plan name if needed in future
  plan?: {
    id: number;
    name: string;
    unit_price?: string;
    description?: string;
  };
}

type Member = {
  id: string;
  first_name: string;
  last_name: string;
  share_accounts?: ShareAccount[];
};

interface SharesTabProps {
  member?: Member;
}

export default function SharesTab({ member }: SharesTabProps) {
  const shareAccounts = member?.share_accounts || [];

  //   if (isError || !data) {
  //     return (
  //       <Card className="p-10 text-center border-destructive/30">
  //         <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
  //         <h3 className="text-lg font-semibold text-destructive">
  //           Failed to load share accounts
  //         </h3>
  //         <p className="text-sm text-muted-foreground mt-2">
  //           Please try again later
  //         </p>
  //       </Card>
  //     );
  //   }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <Coins className="w-6 h-6 text-muted-foreground" />
            Shareholdings
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {shareAccounts.length} active share account
            {shareAccounts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Optional: Add new share account button */}
        {/* <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Buy More Shares
        </Button> */}
      </div>

      {shareAccounts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6">
          {shareAccounts.map((account) => (
            <ShareAccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}

function ShareAccountCard({ account }: { account: ShareAccount }) {
  const units = Number(account.total_units);
  const value = Number(account.total_value);
  const unitPrice = units > 0 ? (value / units).toFixed(2) : "0.00";

  const createdDate = format(new Date(account.created_at), "dd MMM yyyy");
  const lastUpdated = format(new Date(account.updated_at), "dd MMM yyyy");

  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Share Account #{account.id}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={account.is_active ? "default" : "secondary"}
                  className={cn(
                    "text-xs",
                    account.is_active
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {account.is_active ? "ACTIVE" : "INACTIVE"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created: {createdDate}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-700">
              ₦{value.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {units.toLocaleString()} units
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <StatItem
            label="Total Units"
            value={units.toLocaleString()}
            icon={Coins}
          />
          <StatItem
            label="Unit Value"
            value={`₦${unitPrice}`}
            icon={DollarSign}
          />
          <StatItem
            label="Total Value"
            value={`₦${value.toLocaleString()}`}
            icon={DollarSign}
            valueClass="text-emerald-700 font-semibold"
          />
          <StatItem label="Last Updated" value={lastUpdated} icon={Calendar} />
        </div>

        {/* Optional: Link to savings account if linked */}
        {account.savings_account_id && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Linked to Savings Account #{account.savings_account_id}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function StatItem({
  label,
  value,
  icon: Icon,
  valueClass = "",
}: {
  label: string;
  value: string;
  icon: any;
  valueClass?: string;
}) {
  return (
    <div className="p-4 bg-muted/40 rounded-lg text-center">
      <Icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-lg font-semibold mt-1", valueClass)}>{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="p-12 text-center border-dashed">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Coins className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Share Accounts Yet</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        This member does not currently hold any shares in the cooperative.
      </p>
      {/* <Button variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Purchase Shares
      </Button> */}
    </Card>
  );
}

function SharesTabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-5 w-64" />
                </div>
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="text-center space-y-2">
                  <Skeleton className="h-5 w-16 mx-auto" />
                  <Skeleton className="h-8 w-32 mx-auto" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
