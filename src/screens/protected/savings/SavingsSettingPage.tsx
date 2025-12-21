// src/pages/savings-products/index.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, PiggyBank, Percent, Calendar, ShieldCheck, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { SAVINGPRODUCT_API } from "@/constants";
import SavingsProductForm from "./SavingsProductForm";
import { useNavigate } from "react-router-dom";
import type { SavingsProduct } from "@/types/savingProduct.type";


export default function SavingsSettingsPage() {
 const navigate = useNavigate()
    
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SavingsProduct | null>(null);

  const { data: quota } = useQuery({
    queryKey: ["savings-products-quota"],
    queryFn: () => apiClient.get(SAVINGPRODUCT_API.QUOTA).then((res) => res.data),
  });

  const { data: products = [], isLoading } = useQuery<SavingsProduct[]>({
    queryKey: ["savings-products"],
    queryFn: () => apiClient.get(SAVINGPRODUCT_API.LIST).then((res) => res.data.products),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(SAVINGPRODUCT_API.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-products"] });
      toast.success("Savings product deleted");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => apiClient.patch(SAVINGPRODUCT_API.TOGGLE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-products"] });
      toast.success("Status updated");
    },
  });

  const canCreate = quota?.can_create_more ?? true;

  return (
    <div className="py-5 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-3">
            <PiggyBank className="w-8 h-8" />
            Savings Products
          </h1>
          <p className="text-sm text-gray-600">Manage savings account types and rules for members</p>
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
                    You've reached your savings product limit ({quota.used}/{quota.limit}).{" "}
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
                <TableHead className="font-semibold text-black">Interest</TableHead>
                <TableHead className="font-semibold text-black">Min Balance</TableHead>
                <TableHead className="font-semibold text-black">Auto Create</TableHead>
                <TableHead className="font-semibold text-black">Default</TableHead>
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
                    No savings products created yet. A default one will be added on setup.
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
                    <TableCell className="font-mono text-black">{product.account_prefix}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">
                          {product.yearly_interest_rate}% / year
                          <span className="text-gray-500 text-xs ml-1">
                            ({product.interest_period.replace('_', ' ')})
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      ₦{product.min_account_balance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.auto_create_on_registration ? "default" : "secondary"}>
                        {product.auto_create_on_registration ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.is_default ? (
                        <Badge variant="default" className="bg-black text-white">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Default
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
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
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleMutation.mutate(product.id)}
                        >
                          {product.is_active ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-gray-500" />
                          )}
                        </Button>
                        {!product.is_default && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(product.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
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
        <DialogContent    className="
    !w-full
    sm:!max-w-[600px]
    md:!max-w-[800px]
    lg:!max-w-[1000px]
    xl:!max-w-[1200px]
    !max-h-[90vh] 
    overflow-y-auto
  " >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black">
              {editingProduct ? "Edit Savings Product" : "Add New Savings Product"}
            </DialogTitle>
          </DialogHeader>
          <SavingsProductForm
            product={editingProduct}
            onSuccess={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["savings-products"] });
              queryClient.invalidateQueries({ queryKey: ["savings-products-quota"] });
              toast.success(editingProduct ? "Product updated" : "Product created");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}