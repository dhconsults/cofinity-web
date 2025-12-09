// src/pages/loan-products/index.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import LoanProductForm from "./LoanProductForm";
import { LOANPRODUCT_API } from "@/constants";
import { useNavigate } from 'react-router-dom';


interface LoanProduct {
  id: number;
  name: string;
  prefix: string;
  starting_id: number;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  interest_type: "flat" | "reducing_balance";
  max_term: number;
  term_period: "days" | "weeks" | "months" | "years";
  late_penalty_rate: number | null;
  application_fee: number;
  application_fee_type: "fixed" | "percentage";
  processing_fee: number;
  processing_fee_type: "fixed" | "percentage";
  description: string | null;
  guarantor_required: boolean;
  is_active: boolean;
  created_at: string;
}

export default function LoanProductsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(null);
  const navigate = useNavigate()

  const { data: quota } = useQuery({
    queryKey: ["loan-products-quota"],
    queryFn: () => apiClient.get(LOANPRODUCT_API.QUOTA).then((res) => res.data),
  });

  const { data: products = [], isLoading } = useQuery<LoanProduct[]>({
    queryKey: ["loan-products"],
    queryFn: () => apiClient.get(LOANPRODUCT_API.LIST).then((res) => res.data.products),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(LOANPRODUCT_API.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan-products"] });
      toast.success("Loan product deleted");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => apiClient.patch(LOANPRODUCT_API.TOGGLE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan-products"] });
      toast.success("Status updated");
    },
  });

  const canCreate = quota?.can_create_more ?? true;

  return (
    <div className="py-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Loan Products</h1>
          <p className="text-sm text-gray-600">Manage loan types available to members</p>
        </div>

        <div className="flex items-center gap-4">
          {quota && (
            <div className="text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-md bg-white">
              {quota.used} / {quota.limit} products
            </div>
          )}
          <Button
            onClick={() => {
              setEditingProduct(null);
              setOpen(true);
            }}
            disabled={!canCreate}
            className="bg-black hover:bg-gray-900 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Quota Warning */}
      {quota && !canCreate && (
        <Card className="border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-700">
            You've reached your loan product limit ({quota.used}/{quota.limit}).{" "}
            <button  onClick={() => navigate("/upgrade")} className="btn-link underline font-medium">
              Upgrade plan
            </button>{" "}
            to add more.
          </p>
        </Card>
      )}

      {/* Table */}
      <Card className="border border-neutral-100 shadow-none overflow-hidden px-5" >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-300">
                <TableHead className="font-semibold text-black">Product</TableHead>
                <TableHead className="font-semibold text-black">Prefix</TableHead>
                <TableHead className="font-semibold text-black">Amount Range</TableHead>
                <TableHead className="font-semibold text-black">Interest</TableHead>
                <TableHead className="font-semibold text-black">Term</TableHead>
                <TableHead className="font-semibold text-black">Guarantor</TableHead>
                <TableHead className="font-semibold text-black">Status</TableHead>
                <TableHead className="font-semibold text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    No loan products created yet
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-black">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-gray-600 mt-1">{product.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-black">{product.prefix}</TableCell>
                    <TableCell className="text-gray-700">
                      ₦{product.min_amount.toLocaleString()} - ₦{product.max_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gray-400">
                        {product.interest_rate}% ({product.interest_type.replace("_", " ")})
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {product.max_term} {product.term_period}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.guarantor_required ? "destructive" : "secondary"}>
                        {product.guarantor_required ? "Required" : "Not Required"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingProduct(product);
                            setOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="lg"
                          variant="ghost"
                          onClick={() => toggleMutation.mutate(product.id)}
                        >
                          {product.is_active ? (
                            <ToggleRight className="w-12 h-12" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-gray-500" />
                          )}
                        </Button>
                        <Button
                          size="lg"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl  max-h-[90vh] overflow-y-auto border-gray-300">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black">
              {editingProduct ? "Edit Loan Product" : "Add New Loan Product"}
            </DialogTitle>
          </DialogHeader>
          <LoanProductForm
            product={editingProduct}
            onSuccess={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["loan-products"] });
              queryClient.invalidateQueries({ queryKey: ["loan-products-quota"] });
              toast.success(editingProduct ? "Product updated" : "Product created");
            }}
            onCancel={() => {
                setOpen(false); 
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}