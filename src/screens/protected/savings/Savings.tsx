// src/pages/savings/index.tsx
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Search,
  PiggyBank,
  UserCheck,
  BarChart3,
  Plus,
  Eye,
  ArrowDownRight,
  Calculator,
  ArrowUpRight
} from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { MEMBERS_API, SAVINGACCOUNT_API, SAVINGPRODUCT_API } from "@/constants";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import type { Member } from "@/types";
import type { SavingsProduct } from "@/types/savingProduct.type";
import { Textarea } from "@/components/ui/textarea";
import { MemberSearchSelect } from "@/screens/Components/MemberSearchSelect";

interface Summary {
  total_balance: number;
  members_with_savings: number;
  average_balance: number;
}

interface SavingsAccount {
  id: string;

  account_number: string;
  product_name: string;
  bank_name: string;
  available_balance: string;
  opened_at: string;
  updated_at: string;


  balance: number;
  last_activity: string;
  status: "active" | "inactive" | "dormant" | "closed";
  member: {
    id: number | string,
    name: string,
  }
  product: {
    id: number | string,
    name: string,
  }
}


interface MemberBankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

// Validation Schemas
const createSchema = z.object({
  member_id: z.string().min(1, "Select a member"),
  savings_product_id: z.string().min(1, "Select a product"),
  opening_balance: z.number().min(0, "Opening balance must be ≥ 0"),
  description: z.string().optional(),
  branch_id: z.string().optional(),
});

const calcSchema = z.object({
  product_id: z.string().min(1, "Select a product"),
  balance: z.number().min(0, "Enter valid balance"),
  duration: z.number().min(1, "Enter duration"),
  period: z.enum(["days", "months", "years"]),
});


const transactionSchema = z.object({
  savings_account_id: z.string().min(1, "Select an account"),
  amount: z.number().min(0.01, "Amount must be > 0"),
  description: z.string().optional(),
  member_bank_account_id: z.string().optional(), // only for withdrawal
});



export default function Savings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");

  // Modal States
  const [createOpen, setCreateOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);

  // Selected data
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null);
  const [memberBankAccounts, setMemberBankAccounts] = useState<MemberBankAccount[]>([]);

  // API Queries
  const { data: summary = { total_balance: 0, members_with_savings: 0, average_balance: 0 } } = useQuery<Summary>({
    queryKey: ["savings-summary"],
    queryFn: () => apiClient.get(SAVINGACCOUNT_API.SUMMARY).then((res) => res.data),
  });

  const { data: accountsResponse, isLoading } = useQuery({
    queryKey: ["savings-accounts", currentPage, search, sort],
    queryFn: () =>
      apiClient
        .get(SAVINGACCOUNT_API.LIST, { params: { page: currentPage, search, sort } })
        .then((res) => res),
  });


  const { data: quota } = useQuery({
    queryKey: ["savings-account-quota"],
    queryFn: () => apiClient.get(SAVINGACCOUNT_API.QUOTA).then((res) => res.data),
  });





  const accounts: SavingsAccount[] = accountsResponse?.data || [];
  const totalPages = accountsResponse?.meta?.last_page || 1;

  const { data: products = [] } = useQuery<SavingsProduct[]>({
    queryKey: ["savings-products-select"],
    queryFn: () => apiClient.get(SAVINGPRODUCT_API.LIST).then((res) => res.data.products || []),
  });

  // Fetch member bank accounts when account selected in withdrawal
  useEffect(() => {
    if (withdrawalOpen && selectedAccount) {
      apiClient
        .get(`/members/${selectedAccount.member.id}/bank-accounts`) // Adjust endpoint as needed
        .then((res) => setMemberBankAccounts(res.data.bank_accounts || []))
        .catch(() => setMemberBankAccounts([]));
    }
  }, [selectedAccount, withdrawalOpen]);

  // Forms
  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: { opening_balance: 0 },
  });

  const depositForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
  });

  const withdrawalForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
  });

  const calcForm = useForm<z.infer<typeof calcSchema>>({
    resolver: zodResolver(calcSchema),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof createSchema>) => apiClient.post(SAVINGACCOUNT_API.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["savings-summary"] });
      toast.success("Savings account created successfully");
      setCreateOpen(false);
      createForm.reset();
      setSelectedMember(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create account"),
  });

  const transactionMutation = useMutation({
    mutationFn: ({ type, data }: { type: "deposit" | "withdrawal"; data: z.infer<typeof transactionSchema> }) => {
      const endpoint = type === "deposit" ? SAVINGACCOUNT_API.DEPOSIT : SAVINGACCOUNT_API.WITHDRAW;
      return apiClient.post(endpoint, data);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["savings-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["savings-summary"] });
      toast.success(`${vars.type === "deposit" ? "Deposit" : "Withdrawal"} recorded successfully`);
      vars.type === "deposit" ? setDepositOpen(false) : setWithdrawalOpen(false);
      depositForm.reset();
      withdrawalForm.reset();
      setSelectedAccount(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Transaction failed"),
  });

  const calculateInterest = (data: z.infer<typeof calcSchema>) => {
    const rate = 5; // TODO: fetch from product
    let months = data.duration;
    if (data.period === "days") months = data.duration / 30;
    if (data.period === "years") months = data.duration * 12;
    const interest = data.balance * (rate / 100) * (months / 12);
    toast.success(`Estimated interest: ₦${interest.toFixed(2)}`);
    setCalcOpen(false);
    calcForm.reset();
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value);

  // Reusable Account Search (same pattern as MemberSearchSelect)
  const AccountSearch = ({ onSelect }: { onSelect: (acc: SavingsAccount) => void }) => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<SavingsAccount[]>([]);

    useEffect(() => {
      if (search.length < 2) {
        setResults([]);
        return;
      }
      const timer = setTimeout(() => {
        apiClient
          .get(SAVINGACCOUNT_API.LIST, { params: { search, limit: 10 } })
          .then((res) => setResults(res?.data || []))
          .catch(() => setResults([]));
      }, 300);
      return () => clearTimeout(timer);
    }, [search]);

    return (
      <div className="space-y-3">
        <Label>Search Savings Account *</Label>
        <Input
          placeholder="Type account number or member name..."
          value={selectedAccount ? selectedAccount.account_number : search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (selectedAccount) onSelect(null as any);
          }}
        />
        {results.length > 0 && (
          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white">
            {results.map((acc) => (
              <button
                key={acc.id}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                onClick={() => {
                  onSelect(acc);
                  setSearch("");
                  setResults([]);
                }}
              >
                {acc.account_number} - {acc.member.name} ({acc.product.name})
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const canCreate = quota?.can_create_more ?? true;

  return (
    <div className="p-6 space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-3">

          <Button onClick={() => setCalcOpen(true)} variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Interest Calculator
          </Button>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setCreateOpen(true)} className="bg-black hover:bg-gray-900 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Savings Account
          </Button>
          <Button onClick={() => navigate("/savings-products")} className="bg-black hover:bg-gray-900 text-white">
            Manage Products
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Same as before */}
        <Card className="p-6 border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <PiggyBank className="w-8 h-8 text-gray-700" />
              <p className="text-sm text-gray-600 mt-2">Total Savings Balance</p>
              <p className="text-2xl font-bold text-black mt-1">
                {formatCurrency(summary.total_balance)}
              </p>

              <Badge variant="secondary" className="bg-green-100 text-green-700">
                +11% this month
              </Badge>
            </div>

          </div>
        </Card>

        <Card className="p-6 border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <UserCheck className="w-8 h-8 text-gray-700" />
              <p className="text-sm text-gray-600 mt-2">Members with Savings</p>
              <p className="text-2xl font-bold text-black mt-1">
                {summary.members_with_savings}
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                +5% this month
              </Badge>
            </div>

          </div>
        </Card>

        <Card className="p-6 border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <BarChart3 className="w-8 h-8 text-gray-700" />
              <p className="text-sm text-gray-600 mt-2">Average Balance</p>
              <p className="text-2xl font-bold text-black mt-1">
                {formatCurrency(summary.average_balance)}
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                +15% this month
              </Badge>
            </div>

          </div>
        </Card>

        <Card className="p-6 border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <BarChart3 className="w-8 h-8 text-gray-700" />
              <p className="text-sm text-gray-600 mt-2">Total Account Used</p>
              <p className="text-2xl font-bold text-black mt-1">
                {quota && (
                  <>
                    {quota.used} / {quota.limit}
                  </>
                )}
              </p><Badge variant="secondary" className="bg-green-100 text-green-700">
                +15% this month
              </Badge>
            </div>

          </div>
        </Card>

        {/* ... other cards unchanged */}
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        {quota && !canCreate && (
          <Card className="border border-yellow-300 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-700">
              You've reached your account limit ({quota.used}/{quota.limit}).{" "}
              <button onClick={() => navigate("/upgrade")} className="btn-link underline font-medium">
                Upgrade plan
              </button>{" "}
              to add more.
            </p>
          </Card>
        )}



        <div className="relative flex-1">
          <Input
            placeholder="Search by name, account number, or member ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-gray-300"
          />
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full md:w-48 border-gray-300">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="balance">Highest Balance</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Accounts Table */}
      <Card className="border border-neutral-100 shadow-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-300 bg-red-50">
              <TableHead className="text-black font-semibold">Member Name</TableHead>
              <TableHead className="text-black font-semibold">Account Number</TableHead>
              <TableHead className="text-black font-semibold">Account Type</TableHead>
              <TableHead className="text-black font-semibold">Balance</TableHead>
              <TableHead className="text-black font-semibold">Last Activity</TableHead>
              <TableHead className="text-black font-semibold">Status</TableHead>
              <TableHead className="text-black font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12">Loading...</TableCell></TableRow>
            ) : accounts.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12">No accounts found</TableCell></TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-gray-50">
                  <TableCell className="text-black">{account.member.name}</TableCell>
                  <TableCell className="font-mono text-black">{account.account_number}</TableCell>
                  <TableCell className="text-black">{account.product.name}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(account.balance)}</TableCell>
                  <TableCell className="text-sm text-gray-600">{account.updated_at}</TableCell>
                  <TableCell>
                    <Badge variant={account.status === "active" ? "default" : "secondary"}>
                      {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/savings/accounts/${account.id}`)}
                    >
                      View Details →
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(p => p - 1); }}
              />
            </PaginationItem>
            {/* ... pages ... */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(p => p + 1); }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create Account Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Savings Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit((d) => createMutation.mutate(d))} className="space-y-5">
            <MemberSearchSelect
              value={selectedMember}
              className="space-y-2"
              onChange={(m) => {
                setSelectedMember(m);
                if (m) createForm.setValue("member_id", m.id.toString());
              }}
            />
            {createForm.formState.errors.member_id && (
              <p className="text-sm text-red-600 -mt-2">Select a member</p>
            )}
            <div className="space-y-2">
              <Label>Savings Product *</Label>
              <Select onValueChange={(v) => createForm.setValue("savings_product_id", v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {createForm.formState.errors.savings_product_id && (
                <p className="text-sm text-red-600 mt-1">Select a product</p>
              )}
            </div>
            <div className="space-y-2 ">
              <Label>Opening Balance</Label>

              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...createForm.register("opening_balance", { valueAsNumber: true })}
              />
              {/* <Input type="number" step="0.01" {...createForm.register("opening_balance")} /> */}

              {createForm.formState.errors.opening_balance && (
                <p className="text-sm text-red-600 mt-1">
                  {createForm.formState.errors.opening_balance.message || "Enter a valid amount"}
                </p>
              )}

            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea {...createForm.register("description")} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Deposit Modal */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Record Deposit</DialogTitle></DialogHeader>
          <form
            onSubmit={depositForm.handleSubmit((d) =>
              transactionMutation.mutate({ type: "deposit", data: { ...d, savings_account_id: selectedAccount!.id } })
            )}
            className="space-y-5"
          >
            <AccountSearch onSelect={(acc) => { setSelectedAccount(acc); depositForm.setValue("savings_account_id", acc.id); }} />
            <div className="space-y-3">
              <Label>Amount *</Label>
              <Input type="number" step="0.01" {...depositForm.register("amount", { valueAsNumber: true })} placeholder="0.00" />
            </div>
            <div className="space-y-3">
              <Label>Description (optional)</Label>
              <Textarea {...depositForm.register("description")} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDepositOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!selectedAccount || transactionMutation.isPending}>
                Record Deposit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Modal */}
      <Dialog open={withdrawalOpen} onOpenChange={setWithdrawalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Record Withdrawal</DialogTitle></DialogHeader>
          <form
            onSubmit={withdrawalForm.handleSubmit((d) =>
              transactionMutation.mutate({
                type: "withdrawal",
                data: { ...d, savings_account_id: selectedAccount!.id },
              })
            )}
            className="space-y-5"
          >
            <AccountSearch onSelect={(acc) => { setSelectedAccount(acc); withdrawalForm.setValue("savings_account_id", acc.id); }} />
            <div>
              <Label>Amount *</Label>
              <Input type="number" step="0.01" {...withdrawalForm.register("amount", { valueAsNumber: true })} placeholder="0.00" />
            </div>
            {memberBankAccounts.length > 0 && (
              <div>
                <Label>Withdraw to Bank Account (optional)</Label>
                <Select onValueChange={(v) => withdrawalForm.setValue("member_bank_account_id", v || undefined)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select bank account" /></SelectTrigger>
                  <SelectContent>
                    {memberBankAccounts.map((ba) => (
                      <SelectItem key={ba.id} value={ba.id}>
                        {ba.bank_name} - {ba.account_number} ({ba.account_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Description (optional)</Label>
              <Textarea {...withdrawalForm.register("description")} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setWithdrawalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!selectedAccount || transactionMutation.isPending} className="bg-red-600 hover:bg-red-700">
                Record Withdrawal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Interest Calculator Modal */}
      <Dialog open={calcOpen} onOpenChange={setCalcOpen}>
        <DialogContent className="max-w-md border-gray-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black">
              Interest Calculator
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={calcForm.handleSubmit(calculateInterest)} className="space-y-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select onValueChange={(v) => calcForm.setValue("product_id", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {calcForm.formState.errors.product_id && (
                <p className="text-sm text-red-600 mt-1">
                  {"Enter a valid account type"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Current Balance</Label>
              <Input
                type="number"
                step="0.01"
                {...calcForm.register("balance", { valueAsNumber: true })}
                placeholder="0.00"
              />

              {calcForm.formState.errors.balance && (
                <p className="text-sm text-red-600 mt-1">
                  {"Enter a valid figure"}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  type="number"
                  {...calcForm.register("duration", { valueAsNumber: true })}
                  placeholder="12"
                />
              </div>
              <div className="space-y-2">
                <Label>Period</Label>
                <Select onValueChange={(v) => calcForm.setValue("period", v as any)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setCalcOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-black hover:bg-gray-900 text-white">
                Calculate
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


    </div>
  );
}