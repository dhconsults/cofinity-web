// src/pages/shares/accounts/index.tsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Share2, Users, DollarSign, Search, Download, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { MEMBER_SHARE_ACCOUNT_API } from "@/constants";
import PurchaseSharesForm from "./PurchaseSharesForm";
import { useNavigate } from "react-router-dom";
import type { MemberShareAccount } from "@/types/memberShareAccount.type";
import ShareAccountTransactionModal from "./ShareAccountTransactionModal";

export default function MemberShareAccountsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch quota
  const { data: quota } = useQuery({
    queryKey: ["member-share-accounts-quota"],
    queryFn: () => apiClient.get(MEMBER_SHARE_ACCOUNT_API.QUOTA).then(res => res),
  });

  // Fetch accounts
  const { data: response, isLoading } = useQuery({
    queryKey: ["member-share-accounts"],
    queryFn: () => apiClient.get(MEMBER_SHARE_ACCOUNT_API.LIST).then(res => res),
  });

  const accounts: MemberShareAccount[] = response?.data?.accounts || [];
  const quotaData = response?.data?.quota || quota?.data;

  // Filter by search
  const filteredAccounts = accounts.filter(acc =>
    acc.member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.member.member_number.includes(searchTerm) ||
    acc.shares_plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalValue = accounts.reduce((sum, acc) => sum + parseFloat(acc.total_value.toString()), 0);
  const activeAccounts = accounts.filter(acc => acc.is_active).length;

  const canCreate = quotaData?.can_create_more ?? true;


  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="py-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
        {quotaData && (
            <div className="text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-md bg-white">
              {quotaData.used} / {quotaData.limit} accounts
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
         
          <Button
            onClick={() => setOpen(true)}
            disabled={!canCreate}
            className="bg-black hover:bg-gray-900 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Purchase Shares
          </Button>

           <Button className=" " onClick={() => navigate('/shares-plan')}>
                Add New Share Plan
                  </Button>
                

        </div>
      </div>

      {/* Quota Warning */}
      {quotaData && !canCreate && (
        <Card className="border border-yellow-300 bg-yellow-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-700" />
            <p className="text-sm text-yellow-700">
              You've reached your share account limit ({quotaData.used}/{quotaData.limit}).{" "}
              <button onClick={() => navigate("/upgrade")} className="underline font-medium">
                Upgrade plan
              </button>{" "}
              to create more.
            </p>
          </div>
        </Card>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Share Value</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Share Accounts</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAccounts}</div>
            <p className="text-xs text-muted-foreground">Members with shares</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members with Shares</CardTitle>
            <Share2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(accounts.map(a => a.member_id)).size}</div>
            <p className="text-xs text-muted-foreground">Unique members</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by member name, ID, or plan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Linked Savings</TableHead>
                    <TableHead> Action </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                  ) : filteredAccounts.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-gray-500">
                      No share accounts found.
                    </TableCell></TableRow>
                  ) : (
                    filteredAccounts.map((acc) => (
                      <TableRow key={acc.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{acc.member.first_name} {acc.member.last_name}</p>
                            <p className="text-sm text-gray-500">#{acc.member.member_number}</p>
                          </div>
                        </TableCell>
                        <TableCell>{acc.shares_plan.name}</TableCell>
                        <TableCell>{acc.total_units}</TableCell>
                        <TableCell>₦{parseFloat(acc.total_value.toString()).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={acc.is_active ? "default" : "secondary"}>
                            {acc.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {acc.savings_account?.account_number || "—"}
                        </TableCell>

                        <TableCell>
  <div className="flex items-center gap-2">
    {/* ... existing buttons ... */}
    <Button
      size="sm"
      variant="ghost"
      onClick={() => {
        setSelectedAccountId(acc.id);
        setHistoryOpen(true);
      }}
    >
      <FileText className="w-4 h-4" /> History
    </Button>
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

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-4">
        {isLoading ? (
          <Card><CardContent className="py-8 text-center">Loading...</CardContent></Card>
        ) : filteredAccounts.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-gray-500">No share accounts found.</CardContent></Card>
        ) : (
          filteredAccounts.map((acc) => (
            <Card key={acc.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {acc.member.first_name} {acc.member.last_name}
                    </CardTitle>
                    <CardDescription>#{acc.member.member_number}</CardDescription>
                  </div>
                  <Badge variant={acc.is_active ? "default" : "secondary"}>
                    {acc.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium">{acc.shares_plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Units</span>
                  <span className="font-medium">{acc.total_units}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Value</span>
                  <span className="font-medium">₦{parseFloat(acc.total_value.toString()).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Linked Savings</span>
                  <span>{acc.savings_account?.account_number || "—"}</span>
                </div>

                <div className="pt-4 flex gap-2 border-t">
  {/* ... existing buttons ... */}
  <Button
    size="sm"
    variant="outline"
    onClick={() => {
      setSelectedAccountId(acc.id);
      setHistoryOpen(true);
    }}
    className="flex-1"
  >
    <FileText className="w-4 h-4 mr-1" /> History
  </Button>
</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Purchase Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Purchase Shares for Member</DialogTitle>
          </DialogHeader>
          <PurchaseSharesForm
            onSuccess={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["member-share-accounts"] });
              queryClient.invalidateQueries({ queryKey: ["member-share-accounts-quota"] });
              toast.success("Shares purchased successfully");
            }}
          />
        </DialogContent>
      </Dialog>


      <ShareAccountTransactionModal
  accountId={selectedAccountId!}
  open={historyOpen}
  onOpenChange={(open) => {
    setHistoryOpen(open);
    if (!open) setSelectedAccountId(null);
  }}
/>
    </div>
  );
}