"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeftRight,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Download,
  Search,
  Calendar as CalendarIcon,
  Printer,
  Eye,
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { apiClient } from "@/lib/api-client";
import { TRANSACTION_API } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface TransactionSummary {
  total_transactions_amount: number;
  total_inflows: number;
  total_outflows: number;
  pending_approvals: number;
}

interface TransactionItem {
  id: number;
  reference: string;
  type: string;
  amount: number;
  status: string;
  recorded_at: string;
  member: { name: string; membership_id?: string } | null;
  description?: string;
}

interface TransactionsResponse {
  data: TransactionItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

const getDateRangeParams = (range: string): Record<string, string> => {
  const now = new Date();
  switch (range) {
    case "last10":
      return { start_date: format(subDays(now, 10), "yyyy-MM-dd") };
    case "last30":
      return { start_date: format(subDays(now, 30), "yyyy-MM-dd") };
    case "1month":
      return { start_date: format(subMonths(now, 1), "yyyy-MM-dd") };
    case "3months":
      return { start_date: format(subMonths(now, 3), "yyyy-MM-dd") };
    default:
      return {};
  }
};

const fetchTransactions = async (page: number, filters: Record<string, string>) => {
  const params = new URLSearchParams({ page: page.toString(), ...filters });
  const response = await apiClient.get(`${TRANSACTION_API.LIST}?${params}`);
  return response as TransactionsResponse;
};

const fetchTransactionSummary = async (filters: Record<string, string>) => {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`${TRANSACTION_API.SUMMARY}?${params}`);
  return response.data as TransactionSummary;
};

const formatCurrency = (amount: number) =>
  `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);

  // Clean filters — no undefined values
  const filters = useMemo(() => {
    const f: Record<string, string> = {};
    if (search) f.search = search;
    if (statusFilter !== "all") f.status = statusFilter;
    if (typeFilter !== "all") f.type = typeFilter;
    Object.assign(f, getDateRangeParams(dateRange));
    return f;
  }, [search, statusFilter, typeFilter, dateRange]);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["transaction-summary", filters],
    queryFn: () => fetchTransactionSummary(filters),
  });

  const { data: transactionsData, isLoading: tableLoading } = useQuery({
    queryKey: ["transactions", page, filters],
    queryFn: () => fetchTransactions(page, filters),
  });

  const transactions = transactionsData?.data ?? [];
  const meta = transactionsData?.meta ?? {
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; label: string }> = {
      completed: { bg: "bg-green-500/20", text: "text-green-700", label: "Completed" },
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-700", label: "Pending" },
      failed: { bg: "bg-red-500/20", text: "text-red-700", label: "Failed" },
    };
    const v = variants[status] || { bg: "bg-gray-500/20", text: "text-gray-700", label: status };
    return <Badge className={`${v.bg} ${v.text}`}>{v.label}</Badge>;
  };

  const getTypeDisplay = (type: string) =>
    type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ["S/N", "Reference", "Member", "Type", "Amount", "Status", "Date"];
    const rows = transactions.map((t, i) => [
      meta.from + i,
      t.reference,
      t.member?.name || "—",
      getTypeDisplay(t.type),
      t.amount,
      t.status,
      format(new Date(t.recorded_at), "dd-MM-yyyy"),
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  // Reset page when filters change
  const resetPageAndUpdate = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };


  const [isExportingPdf, setIsExportingPdf] = useState(false);
const [isExportingCsv, setIsExportingCsv] = useState(false);

// Export functions
const handleExportPdf = async (params: any) => {
  setIsExportingPdf(true);
  try {
    const response = await apiClient.get(`${TRANSACTION_API.EXPORT_PDF}`, {
      responseType: "blob", // Critical for binary files like PDF/CSV
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-report-${format(new Date(), "yyyy-MM-dd")}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("PDF report downloaded successfully");
  } catch (error: any) {
    toast.error("Failed to generate PDF", {
      description: error.response?.data?.message || "Please try again",
    });
  } finally {
    setIsExportingPdf(false);
  }
};

const handleExportCsv = async (params: string) => {
  setIsExportingCsv(true);
  try {
    const response = await apiClient.get(`${TRANSACTION_API.EXPORT_CSV}?${params}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  } catch (error: any) {

    console.log(error)
    toast.error("Failed to export CSV", {
      description: error?.message || "Please try again",
    });
  } finally {
    setIsExportingCsv(false);
  }
};



  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Filters + Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={dateRange} onValueChange={resetPageAndUpdate(setDateRange)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="last10">Last 10 Days</SelectItem>
              <SelectItem value="last30">Last 30 Days</SelectItem>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={resetPageAndUpdate(setStatusFilter)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={resetPageAndUpdate(setTypeFilter)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="savings_deposit">Deposit</SelectItem>
              <SelectItem value="savings_withdrawal">Withdrawal</SelectItem>
              <SelectItem value="loan_disbursement">Loan Disbursement</SelectItem>
              <SelectItem value="share_purchase">Share Purchase</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* <div className="flex gap-3">
         <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button> 

          <Button onClick={() => {
  const params = new URLSearchParams(filters);
  window.location.href = `/api/transactions/export-pdf?${params}`;
}}>
  <Download className="mr-2 h-4 w-4" />
  Export PDF
</Button>



          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>  */}


        <div className="flex gap-3">
  <Button
    onClick={handleExportPdf}
    disabled={isExportingPdf || tableLoading}
    variant="default"
  >
    <Download className="mr-2 h-4 w-4" />
    {isExportingPdf ? "Generating PDF..." : "Export PDF (Full Report)"}
  </Button>

  <Button
    onClick={handleExportCsv}
    disabled={isExportingCsv || tableLoading}
    variant="outline"
  >
    <Download className="mr-2 h-4 w-4" />
    {isExportingCsv ? "Generating CSV..." : "Export CSV (All Data)"}
  </Button>
</div>


      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-40" />
                </CardContent>
              </Card>
            ))
          : [
              { icon: ArrowLeftRight, label: "Total Transactions", value: summary?.total_transactions_amount ?? 0 },
              { icon: ArrowDownCircle, label: "Total Inflows", value: summary?.total_inflows ?? 0 },
              { icon: ArrowUpCircle, label: "Total Outflows", value: summary?.total_outflows ?? 0 },
              { icon: Clock, label: "Pending Approvals", value: summary?.pending_approvals ?? 0 },
            ].map((card, i) => (
              <Card key={i} className="hover:scale-105 transition-transform">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                  <card.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(card.value)}</div>
                  <p className="text-xs text-muted-foreground">Live update</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by member or reference..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tableLoading ? (
            <div className="space-y-3">
              {Array(10).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">S/N</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((txn, idx) => (
                        <TableRow key={txn.id}>
                          <TableCell>{meta.from + idx}</TableCell>
                          <TableCell className="font-medium">{txn.reference}</TableCell>
                          <TableCell>{txn.member?.name ?? "—"}</TableCell>
                          <TableCell>{getTypeDisplay(txn.type)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(txn.amount)}</TableCell>
                          <TableCell>{getStatusBadge(txn.status)}</TableCell>
                          <TableCell>{format(new Date(txn.recorded_at), "dd MMM yyyy")}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTransaction(txn)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Always show pagination */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing {meta.from} to {meta.to} of {meta.total ? meta.total[0] : 0} transactions
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(Math.max(1, page - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                      const pageNum = meta.last_page <= 5 ? i + 1 : Math.max(1, page - 2) + i;
                      if (pageNum > meta.last_page) return null;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={page === pageNum}
                            onClick={() => setPage(pageNum)}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {meta.last_page > 5 && <PaginationEllipsis />}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(Math.min(meta.last_page[0], page + 1))}
                        className={page === meta.last_page[0] ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Dialog - Instant open */}
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-semibold text-lg">{selectedTransaction.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">{format(new Date(selectedTransaction.recorded_at), "dd MMMM yyyy, hh:mm a")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member</p>
                  <p className="font-semibold">{selectedTransaction.member?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold">{getTypeDisplay(selectedTransaction.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>
              </div>
              {selectedTransaction.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="bg-muted p-4 rounded-md">{selectedTransaction.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}