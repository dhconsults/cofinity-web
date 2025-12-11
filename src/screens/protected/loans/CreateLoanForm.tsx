// src/pages/loans/CreateLoanForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, X, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { MemberSearchSelect } from "@/screens/Components/MemberSearchSelect";
import { LOAN_API } from "@/constants";

interface LoanProduct {
  id: number;
  name: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  interest_type: "flat" | "reducing_balance";
  max_term: number;
  term_period: "days" | "weeks" | "months";
  application_fee: number;
  application_fee_type: "fixed" | "percentage";
  processing_fee: number;
  processing_fee_type: "fixed" | "percentage";
  guarantor_required: boolean;
  is_active: boolean;
}

const formSchema = z.object({
  member_id: z.number().int().positive("Please select a member"),
  loan_product_id: z.number().int().positive("Please select a loan product"),
  savings_account_id: z.number().int().positive("Please select a savings account"),
  principal_amount: z.coerce.number().positive("Amount is required"),
  term: z.coerce.number().int().min(1, "Term must be at least 1"),
  notes: z.string().optional(),
  guarantors: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateLoanFormProps {
  onSuccess: () => void;
}

export default function CreateLoanForm({ onSuccess }: CreateLoanFormProps) {
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedGuarantors, setSelectedGuarantors] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [calculations, setCalculations] = useState<{
    interest: number;
    totalPayable: number;
    applicationFee: number;
    processingFee: number;
    netDisbursement: number;
  }>({
    interest: 0,
    totalPayable: 0,
    applicationFee: 0,
    processingFee: 0,
    netDisbursement: 0,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member_id: undefined,
      loan_product_id: undefined,
      savings_account_id: undefined,
      principal_amount: 0,
      term: 12,
      notes: "",
      guarantors: [],
    },
  });

  // Fetch active loan products
  const { data: products = [] } = useQuery<LoanProduct[]>({
    queryKey: ["loan-products"],
    queryFn: () => apiClient.get("/api/loan-products").then(res => res.data.products.filter((p: any) => p.is_active)),
  });

  // Fetch member's savings accounts
  const { data: savingsAccounts = [] } = useQuery({
    queryKey: ["member-savings-accounts", selectedMember?.id],
    queryFn: () => selectedMember
      ? apiClient.get(`/api/members/${selectedMember.id}/savings-accounts`).then(res => res.data)
      : Promise.resolve([]),
    enabled: !!selectedMember,
  });

  // Real-time calculations
  useEffect(() => {
    const amount = form.watch("principal_amount");
    const term = form.watch("term");

    if (selectedProduct && amount > 0 && term > 0 && amount >= selectedProduct.min_amount && amount <= selectedProduct.max_amount && term <= selectedProduct.max_term) {
      const rate = selectedProduct.interest_rate / 100;
      let interest = 0;

      if (selectedProduct.interest_type === "flat") {
        interest = amount * rate * term;
      } else if (selectedProduct.interest_type === "reducing_balance") {
        const monthlyRate = rate / 12;
        const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
        interest = emi * term - amount;
      }

      const totalPayable = amount + interest;

      const appFee = selectedProduct.application_fee_type === "fixed" 
        ? selectedProduct.application_fee 
        : amount * (selectedProduct.application_fee / 100);

      const procFee = selectedProduct.processing_fee_type === "fixed" 
        ? selectedProduct.processing_fee 
        : amount * (selectedProduct.processing_fee / 100);

      const net = amount - appFee - procFee;

      setCalculations({
        interest,
        totalPayable,
        applicationFee: appFee,
        processingFee: procFee,
        netDisbursement: net > 0 ? net : 0,
      });

      // Schedule
      const installment = totalPayable / term;
      const newSchedule = [];
      let date = new Date();
      for (let i = 1; i <= term; i++) {
        date = new Date(date);
        if (selectedProduct.term_period === "days") date.setDate(date.getDate() + 1);
        else if (selectedProduct.term_period === "weeks") date.setDate(date.getDate() + 7);
        else date.setMonth(date.getMonth() + 1);

        newSchedule.push({
          installment: i,
          due_date: date.toISOString().split("T")[0],
          amount: installment.toFixed(2),
        });
      }
      setSchedule(newSchedule);
    } else {
      setSchedule([]);
      setCalculations(prev => ({ ...prev, interest: 0, totalPayable: 0, netDisbursement: 0 }));
    }
  }, [form.watch("principal_amount"), form.watch("term"), selectedProduct]);

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "guarantors" && Array.isArray(value)) {
          value.forEach(id => formData.append("guarantors[]", id.toString()));
        } else if (value !== undefined && key !== "documents") {
          formData.append(key, value.toString());
        }
      });

      uploadedFiles.forEach(file => formData.append("documents[]", file));

      return apiClient.post(LOAN_API.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Loan application submitted successfully");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit application");
    },
  });

  const onSubmit = (values: FormValues) => {
    if (selectedProduct?.guarantor_required && (!values.guarantors || values.guarantors.length === 0)) {
      toast.error("At least one guarantor is required");
      return;
    }
    mutation.mutate(values);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addGuarantor = (member: any) => {
    if (member && !selectedGuarantors.find(g => g.id === member.id)) {
      setSelectedGuarantors(prev => [...prev, member]);
      form.setValue("guarantors", [...(form.watch("guarantors") || []), member.id]);
    }
  };

  const removeGuarantor = (id: number) => {
    setSelectedGuarantors(prev => prev.filter(g => g.id !== id));
    form.setValue("guarantors", form.watch("guarantors")?.filter((gid: number) => gid !== id) || []);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Member Selection */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Member Details</h2>
          <FormItem>
            <FormLabel>Member</FormLabel>
            <FormControl>
              <MemberSearchSelect
                value={selectedMember}
                onChange={(member) => {
                  setSelectedMember(member);
                  form.setValue("member_id", member?.id);
                  form.setValue("savings_account_id", undefined);
                  form.trigger("member_id");
                }}
                placeholder="Search member by name or ID..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </section>

        {selectedMember && (
          <>
            {/* Loan Product */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Loan Product</h2>
              <FormField
                control={form.control}
                name="loan_product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select onValueChange={(v) => {
                      field.onChange(parseInt(v));
                      const product = products.find((p: any) => p.id === parseInt(v));
                      setSelectedProduct(product || null);
                      form.setValue("principal_amount", product?.min_amount || 0);
                      form.setValue("term", product?.max_term || 12);
                    }}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product: any) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500">
                                {product.interest_rate}% • ₦{product.min_amount.toLocaleString()} - ₦{product.max_amount.toLocaleString()} • {product.max_term} {product.term_period}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            {selectedProduct && (
              <>
                {/* Amount & Term */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="principal_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Principal Amount (₦)</FormLabel>
                          <FormControl>
                            <Input type="number" min={selectedProduct.min_amount} max={selectedProduct.max_amount} step="1000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Min: ₦{selectedProduct.min_amount.toLocaleString()} • Max: ₦{selectedProduct.max_amount.toLocaleString()}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="term"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Term ({selectedProduct.term_period})</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={selectedProduct.max_term} {...field} />
                          </FormControl>
                          <FormDescription>Maximum: {selectedProduct.max_term} {selectedProduct.term_period}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Savings Account */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">Disbursement Account</h2>
                  <FormField
                    control={form.control}
                    name="savings_account_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Savings Account</FormLabel>
                        <Select onValueChange={(v) => field.onChange(parseInt(v))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account for disbursement & deductions" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {savingsAccounts.map((acc: any) => (
                              <SelectItem key={acc.id} value={acc.id.toString()}>
                                <div className="flex justify-between">
                                  <span>{acc.account_number}</span>
                                  <span className="text-gray-500 ml-4">Balance: ₦{parseFloat(acc.balance).toLocaleString()}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Net amount will be credited here. Fees and repayments will be deducted from this account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                {/* Guarantors */}
                {selectedProduct.guarantor_required && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Guarantors <Badge variant="destructive" className="ml-2">Required</Badge></h2>
                    <div className="space-y-4">
                      <MemberSearchSelect
                        value={null}
                        onChange={addGuarantor}
                        placeholder="Search and add guarantor..."
                      />
                      {selectedGuarantors.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Selected Guarantors ({selectedGuarantors.length})</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {selectedGuarantors.map((g) => (
                              <div key={g.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-medium">
                                    {g.first_name[0]}{g.last_name[0]}
                                  </div>
                                  <div>
                                    <p className="font-medium">{g.first_name} {g.last_name}</p>
                                    <p className="text-xs text-gray-500">#{g.member_number}</p>
                                  </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => removeGuarantor(g.id)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </section>
                )}

                {/* Documents */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">Supporting Documents</h2>
                  <div>
                    <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                    <FormDescription className="mt-2">Upload ID, payslip, guarantor forms, etc.</FormDescription>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Upload className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeFile(i)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Notes */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose of Loan / Notes</FormLabel>
                        <FormControl>
                          <Textarea rows={5} placeholder="Describe the purpose of the loan..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </section>

                {/* Summary & Schedule */}
                {schedule.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Loan Summary & Schedule</h2>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader>
                        <CardTitle>Financial Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Principal Amount</span>
                          <span className="font-medium">₦{form.watch("principal_amount").toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest ({selectedProduct.interest_rate}% {selectedProduct.interest_type})</span>
                          <span>₦{calculations.interest.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Application Fee</span>
                          <span>- ₦{calculations.applicationFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Processing Fee</span>
                          <span>- ₦{calculations.processingFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Net Amount Credited</span>
                            {/* <span>₦{(calculations.totalPayable || 0).toFixed(2)}</span> */}
                          </div>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between font-bold">
                            <span>Total Amount to Repay</span>
                            {/* <span>₦{((calculations.totalPayable as number) || 0).toFixed(2)}</span> */}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Repayment Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>#</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead className="text-right">Amount Due</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {schedule.map((inst) => (
                              <TableRow key={inst.installment}>
                                <TableCell>{inst.installment}</TableCell>
                                <TableCell>{new Date(inst.due_date).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right font-medium">
                                  ₦{inst.amount}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </section>
                )}

                {/* Submit */}
                <div className="flex justify-end pt-8">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={mutation.isPending || !selectedProduct || schedule.length === 0}
                    className="bg-black hover:bg-gray-900 text-white"
                  >
                    {mutation.isPending ? "Submitting Application..." : "Submit Loan Application"}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </form>
    </Form>
  );
}