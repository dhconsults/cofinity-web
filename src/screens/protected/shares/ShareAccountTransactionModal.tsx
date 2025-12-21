// src/components/ShareAccountTransactionModal.tsx
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, User, FileText } from "lucide-react";
import apiClient from "@/lib/api-client";
import { MEMBER_SHARE_ACCOUNT_API } from "@/constants";

interface ShareAccountTransactionModalProps {
  accountId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareAccountTransactionModal({
  accountId,
  open,
  onOpenChange,
}: ShareAccountTransactionModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["share-account-transactions", accountId],
    queryFn: () => apiClient.get(MEMBER_SHARE_ACCOUNT_API.TRANSACTIONS(accountId)).then(res => res.data),
    enabled: open,
  });

  const transactions = data?.data || [];
  const pagination = data?.meta || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Share Purchase History</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No purchase transactions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx: any) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {new Date(tx.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium">
                              {tx.member.first_name} {tx.member.last_name}
                            </p>
                            <p className="text-xs text-gray-500">#{tx.member.member_number}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {parseFloat(tx.meta.units_added).toFixed(8).replace(/\.?0+$/, "")}
                      </TableCell>
                      <TableCell className="font-mono">
                        ₦{parseFloat(tx.meta.unit_price).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono font-medium text-green-600">
                        ₦{parseFloat(tx.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          {tx.meta.description || "Share purchase"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination (optional - add if needed) */}
        {pagination.last_page > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {[...Array(pagination.last_page)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={pagination.current_page === i + 1 ? "default" : "outline"}
                onClick={() => {
                  // You can add pagination query param handling if needed
                }}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}