import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  Download, 
  Settings, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  FileText,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import apiClient from "@/lib/api-client";
import { useNavigate } from "react-router-dom";

const LOAN_API = "/api/loans";
const LOAN_USAGE_API = "/api/loans/usage"; // We'll add this endpoint

interface LoanUsage {
  active_loans: number;
  max_active_loans: number | string;
  outstanding_amount: number;
  max_outstanding_amount: number | string;
  can_create_loan: boolean;
}

export default function LoansPage() {


  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

   
  const [sortBy, setSortBy] = useState("recent");

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ["loans"],
    queryFn: () => apiClient.get(LOAN_API).then(res => res.data),
  });

  const { data: usage } = useQuery<LoanUsage>({
    queryKey: ["loan-usage"],
    queryFn: () => apiClient.get(LOAN_USAGE_API).then(res => res.data),
  });

  const filteredLoans = loans.filter((loan: any) => {
    const matchesSearch = 
      `${loan.member.first_name} ${loan.member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.member.phone.includes(searchTerm) ||
      loan.loan_id.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: loans.length,
    active: loans.filter((l: any) => l.status === "disbursed" || "active").length,
    pending: loans.filter((l: any) => l.status === "pending").length,
    defaulted: loans.filter((l: any) => l.status === "defaulted").length,
  };


  const sortedLoans = [...filteredLoans].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "amount-high":
        return b.principal_amount - a.principal_amount;
      case "amount-low":
        return a.principal_amount - b.principal_amount;
      case "name":
        return `${a.member.first_name} ${a.member.last_name}`.localeCompare(
          `${b.member.first_name} ${b.member.last_name}`
        );
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, { variant: any, label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      approved: { variant: "outline", label: "Approved" },
      disbursed: { variant: "default", label: "Active" },
      repaid: { variant: "default", label: "Repaid" },
      defaulted: { variant: "destructive", label: "Defaulted" },
    };
    const config = map[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

  const progress = (paid: number, total: number) => Math.round((paid / total) * 100);

  return (
    <div className="py-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            Loans Management
          </h1>
          <p className="text-sm text-gray-600">Manage member loans, approvals, and repayments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/loan-products")}>
            <Settings className="w-4 h-4 mr-2" />
            Products
          </Button>
          <Button 
            onClick={() => navigate("/loans/create")}
            disabled={!usage?.can_create_loan}
            className="bg-black hover:bg-gray-900 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Loan
          </Button>
        </div>
      </div>

      {/* Loan Quota Warning */}
      {usage && !usage.can_create_loan && (
        <Alert className="border-yellow-300 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-700" />
          <AlertDescription className="text-yellow-700">
            You've reached your loan limit ({usage.active_loans}/{usage.max_active_loans} active loans, 
            ₦{usage.outstanding_amount.toLocaleString()}/₦{usage.max_outstanding_amount === -1 ? 'Unlimited' : usage.max_outstanding_amount.toLocaleString()} outstanding).
            <button onClick={() => navigate("/upgrade")} className="underline font-medium ml-1">
              Upgrade plan
            </button> to create more.
          </AlertDescription>
        </Alert>
      )}

      {/* Quota Summary */}
      {usage && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Active Loans</p>
            <p className="font-bold text-lg">{usage.active_loans} / {usage.max_active_loans}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Outstanding Amount</p>
            <p className="font-bold text-lg">₦{usage.outstanding_amount.toLocaleString()} / {usage.max_outstanding_amount === -1 ? 'Unlimited' : '₦' + usage.max_outstanding_amount.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usage && (usage.active_loans)}</div>
            <p className="text-xs text-muted-foreground">Currently disbursed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Defaulted</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.defaulted}</div>
            <p className="text-xs text-muted-foreground">Overdue loans</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search member, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="disbursed">Disbursed</SelectItem>
                <SelectItem value="repaid">Repaid</SelectItem>
                <SelectItem value="defaulted">Defaulted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="amount-high">Amount (High → Low)</SelectItem>
                <SelectItem value="amount-low">Amount (Low → High)</SelectItem>
                <SelectItem value="name">Member Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-12">Loading...</TableCell></TableRow>
                  ) : sortedLoans.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      No loans found
                    </TableCell></TableRow>
                  ) : (
                    sortedLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-medium">
                              {loan.member.first_name[0]}{loan.member.last_name[0]}
                            </div>
                            <div>
                              <p className="font-medium">{loan.member.first_name} {loan.member.last_name}</p>
                              <p className="text-xs text-gray-500">#{loan.member.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{loan.loan_id}</TableCell>
                        <TableCell>{loan.product.name}</TableCell>
                        <TableCell>{formatCurrency(loan.principal_amount)}</TableCell>
                        <TableCell>{loan.term} {loan.term_period}</TableCell>
                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress(loan.amount_paid, loan.total_payable)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              {progress(loan.amount_paid, loan.total_payable)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>

                        <Button variant="ghost" size="sm" onClick={() => navigate(`/loans/${loan.id}`)}>
                            <FileText className="w-4 h-4" /> View Loan 
                          </Button>

 
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-4">
        {isLoading ? (
          <Card><CardContent className="py-12 text-center">Loading...</CardContent></Card>
        ) : sortedLoans.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-gray-500">No loans found</CardContent></Card>
        ) : (
          sortedLoans.map((loan) => (
            <Card key={loan.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium">
                      {loan.member.first_name[0]}{loan.member.last_name[0]}
                    </div>
                    <div>
                      <p className="font-medium">{loan.member.first_name} {loan.member.last_name}</p>
                      <p className="text-sm text-gray-500">#{loan.member.member_number}</p>
                    </div>
                  </div>
                  {getStatusBadge(loan.status)}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan ID</span>
                    <span className="font-mono">{loan.loan_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product</span>
                    <span>{loan.product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">{formatCurrency(loan.principal_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress</span>
                    <span>{progress(loan.amount_paid, loan.total_payable)}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/loans/${loan.id}`)}>
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

       
    </div>
  );
}