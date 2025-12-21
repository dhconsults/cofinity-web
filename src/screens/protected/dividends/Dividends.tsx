// src/pages/dividends/index.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, DollarSign, Calendar, Users, AlertCircle, CheckCircle, XCircle, Clock, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import DeclareDividendForm from "./DeclareDividendForm";
import { useNavigate } from "react-router-dom";
import { DIVIDEND_API } from "@/constants";
import DividendDetailModal from "./DividendDetailModal";



export default function DividendsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);


  const [declareOpen, setDeclareOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDividend, setSelectedDividend] = useState<any>(null);


  const { data: dividends = [], isLoading } = useQuery({
    queryKey: ["dividends"],
    queryFn: () => apiClient.get(DIVIDEND_API.LIST).then(res => res.data),
  });

  const payMutation = useMutation({
    mutationFn: (id: number) => apiClient.post(DIVIDEND_API.PAY(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dividends"] });
      toast.success("Dividend paid successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to pay dividend");
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "declared":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Declared</Badge>;
      case "processing":
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Processing</Badge>;
      case "paid":
        return <Badge variant="default" className="bg-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Paid</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="py-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            Dividend Management
          </h1>
          <p className="text-sm text-gray-600">Declare and distribute dividends to share holders</p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-black hover:bg-gray-900 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Declare Dividend
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Declared</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{dividends.reduce((sum: number, d: any) => sum + parseFloat(d.total_amount || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Year</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{dividends
                .filter((d: any) => d.status === "paid" && new Date(d.payment_date).getFullYear() === new Date().getFullYear())
                .reduce((sum: number, d: any) => sum + parseFloat(d.total_amount || 0), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <Clock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dividends.filter((d: any) => d.status === "declared").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payout</p>
          </CardContent>
        </Card>

        <Card className="sm:d-none  d-block">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dividends.filter((d: any) => d.status === "paid").reduce((sum: number, d: any) => sum + (d.beneficiaries || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Members received</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Declaration Date</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12">Loading...</TableCell></TableRow>
                ) : dividends.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    No dividends declared yet.
                  </TableCell></TableRow>
                ) : (
                  dividends.map((dividend: any) => (
                    <TableRow key={dividend.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{dividend.title}</p>
                          {dividend.description && <p className="text-xs text-gray-600">{dividend.description}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{dividend.sharesPlan?.name || "All Plans"}</TableCell>
                      <TableCell className="font-mono">{(dividend.rate * 100).toFixed(2)}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {new Date(dividend.declaration_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {dividend.payment_date ? new Date(dividend.payment_date).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        ₦{parseFloat(dividend.total_amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(dividend.status)}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* View Details */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedDividend(dividend);
                              setDetailOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {/* Pay Button - only if declared */}
                          {dividend.status === "declared" && (
                            <Button
                              size="sm"
                              onClick={() => payMutation.mutate(dividend.id)}
                              disabled={payMutation.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <DollarSign className="w-4 h-4 mr-1" />
                              {payMutation.isPending ? "Processing..." : "Pay"}
                            </Button>
                          )}

                          {/* Re-process (future) */}
                          {dividend.status === "paid" && (
                            <Button size="sm" variant="ghost" disabled title="Re-process (coming soon)">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>

                      
                      {/* <TableCell>
                        {dividend.status === "declared" && (
                          <Button
                            size="sm"
                            onClick={() => payMutation.mutate(dividend.id)}
                            disabled={payMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {payMutation.isPending ? "Processing..." : "Pay Now"}
                          </Button>
                        )}
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Declare Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Declare New Dividend</DialogTitle>
          </DialogHeader>
          <DeclareDividendForm
            onSuccess={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["dividends"] });
              toast.success("Dividend declared successfully");
            }}
          />
        </DialogContent>
      </Dialog>


        {/* Detail Modal */}
        {selectedDividend && (
        <DividendDetailModal
          dividend={selectedDividend}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onPay={() => {
            payMutation.mutate(selectedDividend.id);
          }}
        />
      )}

      
    </div>
  );
}