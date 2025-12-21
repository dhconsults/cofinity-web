// src/pages/loans/[id].tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, X, FileText, DollarSign, User, Calendar, AlertCircle, File, CreditCard, Eye, XCircle, Image, Download, Plus  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MemberSearchSelect } from "@/screens/Components/MemberSearchSelect";
import { LoanKeyInfoCard } from "./LoanKeyInfoCard";
 
export default function LoanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const [docModalOpen, setDocModalOpen] = useState(false);
const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
const [addGuarantorOpen, setAddGuarantorOpen] = useState(false);

const openDocument = (path: string) => {
  setSelectedDoc(path);
  setDocModalOpen(true);
};

const getFileTypeIcon = (path: string) => {
  const ext = path.split('.').pop()?.toLowerCase();
  return ext === 'pdf' ? <FileText className="w-12 h-12" /> : <Image className="w-12 h-12" />;
};

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
    onError: (err: any) => toast.error(err.message || "Loan Approval Failed"),
  });

  const declineMutation = useMutation({
    mutationFn: () => apiClient.post(`/api/loans/${id}/decline`),
    onSuccess: () => {
      toast.success("Loan declined");
      queryClient.invalidateQueries({ queryKey: ["loan", id] });
    },
  });



  const addGuarantorMutation = useMutation({
    mutationFn: (data: { loan_id: number; member_id: number }) =>
      apiClient.post(`/api/loans/${data.loan_id}/add-guarantor`, data),
    onSuccess: () => {
      toast.success("Guarantor added");
      queryClient.invalidateQueries({ queryKey: ["loan", id] });
    },
  });
  
  const acceptGuarantorMutation = useMutation({
    mutationFn: (guarantorId: number) =>
      apiClient.post(`/api/loan-guarantors/${guarantorId}/accept`),
    onSuccess: () => {
      toast.success("Guarantor accepted");
      queryClient.invalidateQueries({ queryKey: ["loan", id] });
    },
  });
  
  const rejectGuarantorMutation = useMutation({
    mutationFn: (guarantorId: number) =>
      apiClient.post(`/api/loan-guarantors/${guarantorId}/reject`),
    onSuccess: () => {
      toast.success("Guarantor rejected");
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
    <div className="py-5 lg:p-8 mx-auto space-y-8">
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
  {/* Guarantors Section */}
<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <div className="flex items-center gap-3">
      <CardTitle>Guarantors</CardTitle>
      {loan.product.guarantor_required && (
        <Badge variant="destructive">Required</Badge>
      )}
    </div>

    {/* Add Guarantor Button */}
    {loan.status === "pending" && (
      <Button size="sm" onClick={() => setAddGuarantorOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Guarantor
      </Button>
    )}
  </CardHeader>

  <CardContent>
    {loan.guarantors?.length > 0 ? (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guarantor</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loan.guarantors.map((g: any) => {
            const isPending = g.status === "pending";
            const isAccepted = g.status === "accepted";
            const isRejected = g.status === "rejected";

            return (
              <TableRow key={g.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                      {g.member.first_name[0]}{g.member.last_name[0]}
                    </div>
                    <div>
                      <p className="font-medium">{g.member.first_name} {g.member.last_name}</p>
                      <p className="text-xs text-gray-500">#{g.member.member_number}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{g.member.phone || "—"}</TableCell>
                <TableCell>
                  {isAccepted && <Badge className="bg-green-600">Accepted</Badge>}
                  {isRejected && <Badge variant="destructive">Rejected</Badge>}
                  {isPending && <Badge variant="secondary">Pending</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  {isPending && loan.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => acceptGuarantorMutation.mutate(g.id)}
                        disabled={acceptGuarantorMutation.isPending}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectGuarantorMutation.mutate(g.id)}
                        disabled={rejectGuarantorMutation.isPending}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {isAccepted && <span className="text-green-600 text-sm font-medium">Confirmed</span>}
                  {isRejected && <span className="text-red-600 text-sm font-medium">Declined</span>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    ) : (
      <div className="text-center py-8 text-gray-500">
        No guarantors assigned yet
      </div>
    )}
  </CardContent>
</Card>

{/* Add Guarantor Modal */}
<Dialog open={addGuarantorOpen} onOpenChange={setAddGuarantorOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Add Guarantor</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <MemberSearchSelect
        value={null}
        onChange={(member) => {
          if (member) {
            addGuarantorMutation.mutate({ loan_id: loan.id, member_id: member.id });
            setAddGuarantorOpen(false);
          }
        }}
        placeholder="Search member to add as guarantor..."
      />
    </div>
  </DialogContent>
</Dialog>



      {/* Attached Documents */}
      <Card>
  <CardHeader>
    <CardTitle>Supporting Documents</CardTitle>
  </CardHeader>
  <CardContent>
    {loan.documents && loan.documents.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap- gap-6">
        {loan.documents.map((path: string, index: number) => {
          const fileName = path.split('/').pop() || `Document ${index + 1}`;
          const isPdf = path.toLowerCase().endsWith('.pdf');
          const previewUrl = `http://10.28.212.236:8000/storage/${path}`;

          return (
            <div
              key={index}
              className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 transition-all duration-300 cursor-pointer"
              onClick={() => openDocument(previewUrl)}
            >
              {/* Document Preview */}
              <div className="aspect-video bg-white flex items-center justify-center">
                {isPdf ? (
                  <FileText className="w-16 h-16 text-red-600" />
                ) : (
                  <img
                    src={previewUrl}
                    alt={fileName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                )}
                <div className="hidden">
                  <Image className="w-16 h-16 text-gray-400" />
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* File Info */}
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                <p className="text-xs text-gray-500 mt-1">Click to view</p>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No documents uploaded</p>
      </div>
    )}
  </CardContent>
</Card>


<div className="space-y-8">
      {/* Place it near the top, after breadcrumbs or page title */}
      <LoanKeyInfoCard loan={loan} />

      {/* Existing sections: Repayment Schedule Table, Transactions, etc. */}
      {/* ... */}
    </div>






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
              {loan.repayments?.slice(0, 5).map((rep: any, sn) => (
                <TableRow key={rep.id}>
                  <TableCell>{sn+1}</TableCell>
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
            Approve & Disburse Loan
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
              {loan.repayments?.map((rep: any, sn) => (
                <TableRow key={rep.id}>
                  <TableCell>{sn+1}</TableCell>
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


      <Dialog open={docModalOpen} onOpenChange={setDocModalOpen}>
  <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden">
    {selectedDoc && (
      <>
        <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
          <DialogTitle>Document Viewer</DialogTitle>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const link = document.createElement('a');
                link.href = selectedDoc;
                link.download = selectedDoc.split('/').pop() || 'document';
                link.click();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDocModalOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-16 h-[80vh]">
          {selectedDoc.toLowerCase().endsWith('.pdf') ? (
            <iframe
              src={selectedDoc}
              className="w-full h-full border-0"
              title="PDF Viewer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <img
                src={selectedDoc}
                alt="Document"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>
      </>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
}