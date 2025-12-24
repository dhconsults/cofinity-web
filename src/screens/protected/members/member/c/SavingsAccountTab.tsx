"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Wallet,
  Plus,
  History,
  CreditCard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { apiClient } from "@/lib/api-client";
import { MEMBERS_API, SAVINGACCOUNT_API, SAVINGPRODUCT_API } from "@/constants";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/* ================= TYPES ================= */

type SavingsAccount = {
  id: number;
  account_number: string;
  product_name: string;
  balance: number;
  total_deposits: number;
  total_withdrawals: number;
  interest_earned: number;
  status: "active" | "dormant" | "closed";
  opened_at: string;
  last_transaction_at?: string | null;
};

type Member = {
  id: number;
  savings_accounts?: SavingsAccount[];
};

type SavingsProduct = {
  id: number;
  name: string;
};

interface Props {
  memberId: number;
}

/* ================= VALIDATION ================= */

const createSchema = z.object({
  savings_product_id: z.string().min(1, "Select a product"),
  opening_balance: z.number().min(0),
  description: z.string().optional(),
  member_id: z.number(),
});

/* ================= COMPONENT ================= */

export default function SavingsAccountTab({ memberId }: Props) {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  /* ===== Queries ===== */

  const { data: accountsResponse, isLoading } = useQuery<SavingsAccount[]>({
    queryKey: ["savings-accounts", memberId],
    queryFn: async () => {
      const res = await apiClient.get(MEMBERS_API.SAVINGSACCOUNTS(memberId));
      return res.data;
    },
  });

  // const [currentPage, setCurrentPage] = useState(1);
  // const [search, setSearch] = useState("");
  // const [sort, setSort] = useState("recent");

  // const { data: accountsResponse, isLoading } = useQuery({
  //   queryKey: ["savings-accounts", currentPage, search, sort],
  //   queryFn: () =>
  //     apiClient
  //       .get(SAVINGACCOUNT_API.LIST, {
  //         params: { page: currentPage, search, sort },
  //       })
  //       .then((res) => res),
  // });

  const { data: products = [] } = useQuery<SavingsProduct[]>({
    queryKey: ["savings-products"],
    queryFn: async () => {
      const res = await apiClient.get(SAVINGPRODUCT_API.LIST);
      return res.data.products || [];
    },
  });

  console.log("accountsResponse", accountsResponse);

  const savingsAccounts = accountsResponse || [];

  /* ===== Form ===== */

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      opening_balance: 0,
    },
  });

  /* ===== Mutation ===== */

  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof createSchema>) =>
      apiClient.post(SAVINGACCOUNT_API.CREATE, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["member-savings", memberId],
      });
      toast.success("Savings account created successfully");
      setCreateOpen(false);
      createForm.reset();
    },

    onError: (err: any) =>
      toast.error(err?.message || "Failed to create account"),
  });

  const formatCurrency = (amount: number | undefined) =>
    amount === undefined || amount === null
      ? "₦0.00"
      : `₦${amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold flex items-center gap-2 truncate">
            <Wallet className="w-6 h-6 shrink-0" />
            <span className="truncate">Savings Accounts</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1 truncate">
            View all savings products and balances <br /> for this member
          </p>
        </div>

        <div className="shrink-0">
          <Button
            onClick={() => setCreateOpen(true)}
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Savings Account
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {savingsAccounts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-lg text-gray-600">
              No Savings Accounts
            </CardTitle>
            <CardDescription className="mt-2">
              This member has not opened any savings account yet.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {savingsAccounts.map((account) => (
            <Card key={account.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      {account.product_name}
                    </CardTitle>
                    <CardDescription>
                      Account No:{" "}
                      <span className="font-mono">
                        {account.account_number}
                      </span>
                    </CardDescription>
                  </div>

                  <Badge
                    variant={
                      account.status === "active" ? "default" : "secondary"
                    }
                    className={
                      account.status === "active" ? "bg-green-600" : ""
                    }
                  >
                    {account.status === "active" ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    {account.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Current Balance</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Deposits</p>
                    <p className="text-xl text-green-600 font-semibold">
                      {formatCurrency(account.total_deposits)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Interest Earned</p>
                    <p className="text-xl text-blue-600 font-semibold">
                      {formatCurrency(account.interest_earned)}
                    </p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Opened On</TableHead>
                      <TableHead>Last Transaction</TableHead>
                      <TableHead>Total Withdrawals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {format(new Date(account.opened_at), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        {account.last_transaction_at
                          ? format(
                              new Date(account.last_transaction_at),
                              "dd MMM yyyy"
                            )
                          : "No transactions yet"}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {formatCurrency(account.total_withdrawals)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-6">
                  <Button variant="outline">
                    <History className="w-4 h-4 mr-2" />
                    View Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ================= CREATE MODAL ================= */}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="w-full sm:max-w-lg sm:mx-auto p-6 sm:p-8 rounded-lg">
          <DialogHeader>
            <DialogTitle>Create New Savings Account</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={createForm.handleSubmit((d) => createMutation.mutate(d))}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label>Savings Product *</Label>
              <Select
                onValueChange={(v) =>
                  createForm.setValue("savings_product_id", v)
                }
              >
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
            </div>

            <div className="space-y-2">
              <Label>Opening Balance</Label>
              <Input
                type="number"
                step="0.01"
                {...createForm.register("opening_balance", {
                  valueAsNumber: true,
                })}
              />
              <Input
                type="hidden"
                step="0.01"
                value={memberId}
                {...createForm.register("member_id", {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea {...createForm.register("description")} />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
