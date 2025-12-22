// src/screens/protected/members/member/c/BankAccountTab.tsx
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Banknote,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Assuming member has bank_accounts relation (array)
type BankAccount = {
  id: number;
  bank_name: string;
  bank_code?: string;
  account_number: string;
  account_name: string;
  is_primary: boolean;
  verified_at?: string | null;
  created_at: string;
};

type Member = {
  id: number;
  first_name: string;
  last_name: string;
  bank_accounts?: BankAccount[];
};

// Zod schema for validation
const bankAccountSchema = z.object({
  bank_name: z.string().min(1, "Bank name is required"),
  account_number: z.string().min(10, "Valid account number required"),
  account_name: z.string().min(1, "Account name is required"),
  is_primary: z.boolean().optional(),
});

type BankAccountForm = z.infer<typeof bankAccountSchema>;

interface BankAccountTabProps {
  memberId: number;
}

export default function BankAccountTab({ memberId }: BankAccountTabProps) {
  const queryClient = useQueryClient();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch bank accounts (assume endpoint returns member with bank_accounts)
  const { data: member, isLoading } = useQuery({
    queryKey: ["member-bank-accounts", memberId],
    queryFn: async () => {
      const res = await apiClient.get(MEMBERS_API.SHOW(memberId));
      return res.data as Member;
    },
  });

  const bankAccounts = member?.bank_accounts || [];

  // Mutations
  const addMutation = useMutation({
    mutationFn: async (data: BankAccountForm) => {
      await apiClient.post(MEMBERS_API.BANK_ACCOUNTS(memberId), data);
    },
    onSuccess: () => {
      toast.success("Bank account added successfully");
      queryClient.invalidateQueries({
        queryKey: ["member-bank-accounts", memberId],
      });
      setOpenAdd(false);
      resetForm();
    },
    onError: () => toast.error("Failed to add bank account"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BankAccountForm }) => {
      await apiClient.put(MEMBERS_API.BANK_ACCOUNT(memberId, id), data);
    },
    onSuccess: () => {
      toast.success("Bank account updated");
      queryClient.invalidateQueries({
        queryKey: ["member-bank-accounts", memberId],
      });
      setOpenEdit(false);
      setEditingAccount(null);
      resetForm();
    },
    onError: () => toast.error("Failed to update bank account"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (accountId: number) => {
      await apiClient.delete(MEMBERS_API.BANK_ACCOUNT(memberId, accountId));
    },
    onSuccess: () => {
      toast.success("Bank account removed");
      queryClient.invalidateQueries({
        queryKey: ["member-bank-accounts", memberId],
      });
      setDeletingId(null);
    },
    onError: () => toast.error("Failed to delete bank account"),
  });

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BankAccountForm>({
    resolver: zodResolver(bankAccountSchema),
  });

  const resetForm = () =>
    reset({
      bank_name: "",
      account_number: "",
      account_name: "",
      is_primary: false,
    });

  const onSubmitAdd = (data: BankAccountForm) => {
    addMutation.mutate(data);
  };

  const onSubmitEdit = (data: BankAccountForm) => {
    if (!editingAccount) return;
    updateMutation.mutate({ id: editingAccount.id, data });
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setValue("bank_name", account.bank_name);
    setValue("account_number", account.account_number);
    setValue("account_name", account.account_name);
    setValue("is_primary", account.is_primary);
    setOpenEdit(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Banknote className="w-6 h-6" />
            Bank Accounts
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage disbursement and withdrawal bank accounts for this member
          </p>
        </div>

        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Bank Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Bank Account</DialogTitle>
              <DialogDescription>
                Add a bank account for withdrawals and disbursements.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
              <div>
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  {...register("bank_name")}
                  placeholder="e.g., Access Bank"
                />
                {errors.bank_name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.bank_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  {...register("account_number")}
                  placeholder="1234567890"
                />
                {errors.account_number && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.account_number.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="account_name">Account Name</Label>
                <Input
                  id="account_name"
                  {...register("account_name")}
                  placeholder="John Doe"
                />
                {errors.account_name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.account_name.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Account
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {bankAccounts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No bank accounts added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bankAccounts.map((account) => (
            <Card
              key={account.id}
              className={account.is_primary ? "border-primary" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Banknote className="w-8 h-8 text-gray-700" />
                    <div>
                      <CardTitle className="text-lg">
                        {account.bank_name}
                      </CardTitle>
                      <CardDescription>
                        {account.account_number}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.is_primary && (
                      <Badge variant="default">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Primary
                      </Badge>
                    )}
                    {account.verified_at ? (
                      <Badge variant="default" className="bg-green-600">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Account Name</p>
                    <p className="text-gray-700">{account.account_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(account)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingId(account.id)}
                      disabled={
                        deleteMutation.isPending && deletingId === account.id
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Bank Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
            <div>
              <Label htmlFor="edit_bank_name">Bank Name</Label>
              <Input id="edit_bank_name" {...register("bank_name")} />
            </div>
            <div>
              <Label htmlFor="edit_account_number">Account Number</Label>
              <Input id="edit_account_number" {...register("account_number")} />
            </div>
            <div>
              <Label htmlFor="edit_account_name">Account Name</Label>
              <Input id="edit_account_name" {...register("account_name")} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      {deletingId && (
        <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Bank Account?</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(deletingId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
