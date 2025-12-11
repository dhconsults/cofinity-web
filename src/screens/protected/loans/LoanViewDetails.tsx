// src/pages/loans/[id].tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, X, FileText, DollarSign, User, Calendar, AlertCircle, File, CreditCard, Eye, XCircle  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
 
export default function LoanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const { data: loan, isLoading } = useQuery({
    queryKey: ["loan", id],
    queryFn: () => apiClient.get(`/api/loans/${id}`).then(res => res.data),
  });

  const approveMutation = useMutation({
    mutationFn: () => apiClient.post(`/api/loans/${id}/approve`),
    onSuccess: () => {
      toast.success("Loan approved!");
      queryClient.invalidateQueries({ queryKey: ["loan", id] });
    },
  });

  const declineMutation = useMutation({
    mutationFn: () => apiClient.post(`/api/loans/${id}/decline`),
    onSuccess: () => {
      toast.success("Loan declined");
      queryClient.invalidateQueries({ queryKey: ["loan", id] });
    },
  });

  const exportMutation = useMutation({
    mutationFn: () => apiClient.get(`/api/loans/${id}/export-schedule`, { responseType: 'blob' }),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `loan-schedule-${loan.loan_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Schedule downloaded");
    },
  });

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (!loan) return <div className="text-center py-12 text-gray-500">Loan not found</div>;

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

  const getFileName = (path: string) => path.split('/').pop() || path;

  return (
    <div className="py-5 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/loans")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Loans
      </Button>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Loan #{loan.loan_id}</h1>
          <p className="text-lg text-gray-600 mt-1">{loan.product.name}</p>
        </div>
        <div className="text-right">
          {getStatusBadge(loan.status)}
          {loan.disbursed_at && (
            <p className="text-sm text-gray-500 mt-2">
              Disbursed on {new Date(loan.disbursed_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <User className="w-5 h-5" />
            <CardTitle>Member</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{loan.member.first_name} {loan.member.last_name}</p>
            <p className="text-sm text-gray-500">#{loan.member.phone}</p>
            <p className="text-sm text-gray-600">{loan.member.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <CreditCard className="w-5 h-5" />
            <CardTitle>Savings Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{loan?.savings_account?.account_number}</p>
            <p className="text-sm text-gray-600">
              Balance: {formatCurrency(loan?.savings_account?.balance)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <DollarSign className="w-5 h-5" />
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Principal</span>
              <span>{formatCurrency(loan.principal_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest</span>
              <span>{formatCurrency(loan.interest_amount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total Payable</span>
              <span>{formatCurrency(loan.total_payable)}</span>
            </div>
            <div className="flex justify-between text-red-600 font-bold">
              <span>Outstanding</span>
              <span>{formatCurrency(loan.outstanding_balance)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guarantors */}
      <Card>
        <CardHeader>
          <CardTitle>Guarantors</CardTitle>
        </CardHeader>
        <CardContent>
          {loan.guarantors?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Member ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Accepted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loan.guarantors.map((g: any) => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">
                          {g.member.first_name[0]}{g.member.last_name[0]}
                        </div>
                        <span>{g.member.first_name} {g.member.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>#{g.member.member_number}</TableCell>
                    <TableCell>{getStatusBadge(g.status)}</TableCell>
                    <TableCell>
                      {g.accepted_at ? new Date(g.accepted_at).toLocaleDateString() : "Pending"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-8">No guarantors required or assigned</p>
          )}
        </CardContent>
      </Card>

      {/* Attached Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Supporting Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {loan.documents && loan.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loan.documents.map((path: string, index: number) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="w-8 h-8 text-gray-600" />
                        <div>
                          <p className="font-medium text-sm">{getFileName(path)}</p>
                          <p className="text-xs text-gray-500">Document {index + 1}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/storage/${path}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No documents uploaded</p>
          )}
        </CardContent>
      </Card>

      {/* Repayment Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Repayment Schedule</CardTitle>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setScheduleOpen(true)}>
              <FileText className="w-4 h-4 mr-2" />
              View Full Schedule
            </Button>
            {loan.status === "disbursed" && (
              <Button onClick={() => exportMutation.mutate()}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Mini schedule preview */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Due</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loan.repayments?.slice(0, 5).map((rep: any) => (
                <TableRow key={rep.id}>
                  <TableCell>{rep.id}</TableCell>
                  <TableCell>{new Date(rep.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(rep.total_due)}</TableCell>
                  <TableCell>{getStatusBadge(rep.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {loan.status === "pending" && (
        <div className="flex gap-4">
          <Button onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending} className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-2" />
            Approve Loan
          </Button>
          <Button variant="destructive" onClick={() => declineMutation.mutate()} disabled={declineMutation.isPending}>
            <XCircle className="w-4 h-4 mr-2" />
            Decline Loan
          </Button>
        </div>
      )}

      {/* Full Schedule Modal */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Full Repayment Schedule - {loan.loan_id}</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Installment</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Total Due</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loan.repayments?.map((rep: any) => (
                <TableRow key={rep.id}>
                  <TableCell>{rep.id}</TableCell>
                  <TableCell>{new Date(rep.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(rep.principal_due)}</TableCell>
                  <TableCell>{formatCurrency(rep.interest_due)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(rep.total_due)}</TableCell>
                  <TableCell>{formatCurrency(rep.amount_paid)}</TableCell>
                  <TableCell>{getStatusBadge(rep.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}