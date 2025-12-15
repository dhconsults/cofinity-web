// src/pages/loans/repayments.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Download,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Added for delete confirmation
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

const REPAID_API = "/api/loan-repayments";
const LOANS_API = "/api/loans/select-options";
const PAYABLE_API = (loanId: string) => `/api/loans/${loanId}/payable-installments`;

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

export default function LoanRepaymentsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRepayment, setSelectedRepayment] = useState<Repayment | null>(null);
  const [selectedLoan, setSelectedLoan] = useState("");
  const [selectedInstallment, setSelectedInstallment] = useState("");
  const [formData, setFormData] = useState({
    payment_date: new Date().toISOString().split("T")[0],
    amount_paid: "",
    debit_account: "Cash",
    remarks: "",
  });

  const { data: repayments = [], isLoading } = useQuery<Repayment[]>({
    queryKey: ["paid-repayments"],
    queryFn: () => apiClient.get(REPAID_API).then(res => res.data),
  });

  const { data: loanOptions = [] } = useQuery<LoanOption[]>({
    queryKey: ["loan-options"],
    queryFn: () => apiClient.get(LOANS_API).then(res => res.data),
  });

  const { data: installments = [], isFetching: loadingInst } = useQuery<Installment[]>({
    queryKey: ["payable", selectedLoan],
    queryFn: () => apiClient.get(PAYABLE_API(selectedLoan)).then(res => res.data),
    enabled: !!selectedLoan,
  });

  const recordMutation = useMutation({
    mutationFn: () => apiClient.post(`/api/loan-repayments/${selectedInstallment}/pay`, {
      payment_date: formData.payment_date,
      amount_paid: parseFloat(formData.amount_paid),
      debit_account: formData.debit_account,
      remarks: formData.remarks,
    }),
    onSuccess: () => {
      toast.success("Repayment recorded");
      queryClient.invalidateQueries({ queryKey: ["paid-repayments"] });
      setIsDialogOpen(false);
      setSelectedLoan("");
      setSelectedInstallment("");
      setFormData({ payment_date: new Date().toISOString().split("T")[0], amount_paid: "", debit_account: "Cash", remarks: "" });
    },
    onError: (error: any) => toast.error("Failed to record repayment", { description: error.message }),
  });

  // New: Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`${REPAID_API}/${id}`),
    onSuccess: () => {
      toast.success("Repayment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["paid-repayments"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete repayment", { description: error.message || "Unknown error" });
    },
  });

  const filtered = repayments.filter(r =>
    r.loan_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.member_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);

  const selectedInstallmentData = installments.find(i => i.id.toString() === selectedInstallment);
  const amountPaid = parseFloat(formData.amount_paid) || 0;
  const isOverpaying = selectedInstallmentData && amountPaid > selectedInstallmentData.balance_due;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Repayments</h1>
          <p className="text-gray-600 mt-1">Manage and track all recorded loan repayments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
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
                <DialogTitle>Record Loan Repayment</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); recordMutation.mutate(); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Loan</Label>
                    <Select value={selectedLoan} onValueChange={(v) => { setSelectedLoan(v); setSelectedInstallment(""); }}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select loan" /></SelectTrigger>
                      <SelectContent>
                        {loanOptions.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Installment</Label>
                    <Select value={selectedInstallment} onValueChange={setSelectedInstallment} disabled={loadingInst || !selectedLoan}>
                      <SelectTrigger className="w-full"><SelectValue placeholder={loadingInst ? "Loading..." : "Select installment"} /></SelectTrigger>
                      <SelectContent>
                        {installments.map(i => (
                          <SelectItem key={i.id} value={i.id.toString()}>
                            Due {i.formatted_date} – {formatCurrency(i.balance_due)}
                            {i.is_overdue && ` (Overdue ${i.days_overdue}d)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Date</Label>
                    <Input type="date" value={formData.payment_date} onChange={e => setFormData(p => ({ ...p, payment_date: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount Paid</Label>
                    <Input type="number" step="0.01" value={formData.amount_paid} onChange={e => setFormData(p => ({ ...p, amount_paid: e.target.value }))} />
                    {isOverpaying && (
                      <div className="flex items-center gap-2 text-amber-600 text-sm mt-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Amount paid exceeds the balance due ({formatCurrency(selectedInstallmentData!.balance_due)})</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Debit Account</Label>
                    <Select value={formData.debit_account} onValueChange={v => setFormData(p => ({ ...p, debit_account: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Savings Deduction">Savings Deduction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Textarea value={formData.remarks} onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))} />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={recordMutation.isPending || !selectedInstallment}>
                    Save Repayment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Loan ID</TableHead>
                  <TableHead className="font-semibold">Member</TableHead>
                  <TableHead className="font-semibold">Payment Date</TableHead>
                  <TableHead className="font-semibold text-right">Principal Amount</TableHead>
                  <TableHead className="font-semibold text-right">Interest</TableHead>
                  <TableHead className="font-semibold text-right">Late Penalties</TableHead>
                  <TableHead className="font-semibold text-right">Total Amount</TableHead>
                  <TableHead className="font-semibold text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">No repayments recorded</TableCell></TableRow>
                ) : (
                  filtered.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-blue-600">{r.loan_id}</TableCell>
                      <TableCell>{r.member_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {r.formatted_payment_date}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(r.principal_amount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(r.interest_amount)}</TableCell>
                      <TableCell className="text-right">{r.late_penalties > 0 ? formatCurrency(r.late_penalties) : "—"}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">{formatCurrency(r.total_amount)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          {/* View Dialog */}
                          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedRepayment(r)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Repayment Details</DialogTitle>
                              </DialogHeader>
                              {selectedRepayment && (
                                <div className="space-y-4 py-4">
                                  <div><Label className="text-base font-semibold">Loan ID</Label><p className="text-lg">{selectedRepayment.loan_id}</p></div>
                                  <div><Label className="text-base font-semibold">Member</Label><p className="text-lg">{selectedRepayment.member_name}</p></div>
                                  <div><Label className="text-base font-semibold">Payment Date</Label><p className="text-lg">{selectedRepayment.formatted_payment_date}</p></div>
                                  <div><Label className="text-base font-semibold">Principal Amount</Label><p className="text-lg">{formatCurrency(selectedRepayment.principal_amount)}</p></div>
                                  <div><Label className="text-base font-semibold">Interest Amount</Label><p className="text-lg">{formatCurrency(selectedRepayment.interest_amount)}</p></div>
                                  <div><Label className="text-base font-semibold">Late Penalties</Label><p className="text-lg">{selectedRepayment.late_penalties > 0 ? formatCurrency(selectedRepayment.late_penalties) : "—"}</p></div>
                                  <div><Label className="text-base font-semibold">Total Amount Paid</Label><p className="text-lg font-bold text-green-600">{formatCurrency(selectedRepayment.total_amount)}</p></div>
                                  <div><Label className="text-base font-semibold">Debit Account</Label><p className="text-lg">{selectedRepayment.debit_account}</p></div>
                                  {selectedRepayment.remarks && (
                                    <div><Label className="text-base font-semibold">Remarks</Label><p className="text-lg">{selectedRepayment.remarks}</p></div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {/* Delete Confirmation */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Repayment?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the repayment of {formatCurrency(r.total_amount)} for loan <strong>{r.loan_id}</strong> on {r.formatted_payment_date}.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => deleteMutation.mutate(r.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
  );
}