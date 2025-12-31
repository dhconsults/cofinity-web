import { useQuery } from "@tanstack/react-query";
import { format, formatDate } from "date-fns";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  CreditCard,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";
import { formatCurrency } from "@/lib/utils";

// Helper to export data as CSV
const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = ["Date", "Type", "Amount", "Status", "Description"];
  const rows = data.map((txn) => [
    format(new Date(txn.createdAt || txn.date), "PPP"),
    txn.type.charAt(0).toUpperCase() + txn.type.slice(1),
    txn.amount.toFixed(2),
    txn.status.charAt(0).toUpperCase() + txn.status.slice(1),
    txn.description || txn.notes || "-",
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function TransactionsTab({ memberId }: { memberId: number }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transactions", memberId],
    queryFn: async () => {
      const res = await apiClient.get(MEMBERS_API.TRANSACTIONS(memberId));
      return res.data || []; // assuming res.data.data is the array
    },
  });

  const transactions = data?.data || [];

  const handleExport = () => {
    exportToCSV(
      transactions,
      `transactions_member_${memberId}_${format(new Date(), "yyyy-MM-dd")}`
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  // Empty State
  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed border-2">
        <div className="max-w-md mx-auto">
          <CreditCard className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-neutral-800">
            No transactions yet
          </h3>
          <p className="text-neutral-600 mt-3">
            Financial activities for this member will appear here once they
            begin.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Transaction History
          </h2>
          <p className="text-neutral-600 mt-1">
            All financial activities for this member
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-base px-4 py-2">
            {transactions.length} Transaction
            {transactions.length !== 1 ? "s" : ""}
          </Badge>

          <Button onClick={handleExport} size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table Wrapper for Mobile Horizontal Scroll */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="whitespace-nowrap">
                  Description / Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn: any) => (
                <TableRow
                  key={txn.id}
                  className="hover:bg-neutral-50 transition-colors duration-200"
                >
                  <TableCell className="font-medium">
                    {formatDate(new Date(txn.created_at), "dd MMM yyyy")}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {txn.type?.toLowerCase() === "credit" ? (
                        <>
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 font-medium">
                            Credit
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                          <span className="text-red-700 font-medium">
                            Debit
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold">
                    {/* {txn.type?.toLowerCase() === "credit" ? "cr" : "-"} */}
                    {formatCurrency(txn.amount)}
                  </TableCell>

                  <TableCell>
                    {txn.status?.toLowerCase() === "completed" && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Success
                      </Badge>
                    )}
                    {txn.status?.toLowerCase() === "pending" && (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                    {txn.status?.toLowerCase() === "failed" && (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </TableCell>

                  <TableCell className="max-w-xs truncate">
                    {txn.description || txn.notes || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Optional: Footer note */}
      <p className="text-sm text-neutral-500 text-center">
        Showing all {transactions.length} transactions
      </p>
    </div>
  );
}
