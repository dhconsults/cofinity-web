// src/pages/shares-plans/index.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Share2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { SHARESPLAN_API } from "@/constants"; // We'll define this next
import SharesPlanForm from "./SharesPlanForm";
import { useNavigate } from "react-router-dom";
import type { SharesPlan } from "@/types/sharesPlan.type";

export default function SharesPlansPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SharesPlan | null>(null);

  // Fetch quota
  const { data: quota } = useQuery({
    queryKey: ["shares-plans-quota"],
    queryFn: () => apiClient.get(SHARESPLAN_API.QUOTA).then((res) => res.data),
  });

  // Fetch plans
  const { data: plans = [], isLoading } = useQuery<SharesPlan[]>({
    queryKey: ["shares-plans"],
    queryFn: () => apiClient.get(SHARESPLAN_API.LIST).then((res) => res.data.plans),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(SHARESPLAN_API.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares-plans"] });
      toast.success("Shares plan deleted");
    },
    onError: () => toast.error("Failed to delete plan"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => apiClient.patch(SHARESPLAN_API.TOGGLE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares-plans"] });
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
            <Share2 className="w-8 h-8" />
            Shares Plans
          </h1>
          <p className="text-sm text-gray-600">Manage share capital plans and contribution rules</p>
        </div>
        <div className="flex items-center gap-4">
          {quota && (
            <div className="text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded-md bg-white">
              {quota.used} / {quota.limit} plans
            </div>
          )}
          <Button
            onClick={() => {
              setEditingPlan(null);
              setOpen(true);
            }}
            disabled={!canCreate}
            className="bg-black hover:bg-gray-900 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Plan
          </Button>
        </div>
      </div>

      {/* Quota Warning */}
      {quota && !canCreate && (
        <Card className="border border-yellow-300 bg-yellow-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-700" />
            <p className="text-sm text-yellow-700">
              You've reached your shares plan limit ({quota.used}/{quota.limit}).{" "}
              <button onClick={() => navigate("/upgrade")} className="underline font-medium">
                Upgrade plan
              </button>{" "}
              to add more.
            </p>
          </div>
        </Card>
      )}

      {/* Desktop: Table View */}
      <div className="hidden lg:block">
        <Card className="border border-neutral-100 shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-300">
                  <TableHead className="font-semibold text-black">Plan Name</TableHead>
                  <TableHead className="font-semibold text-black">Unit Price</TableHead>
                  <TableHead className="font-semibold text-black">Min Units</TableHead>
                  <TableHead className="font-semibold text-black">Max Units</TableHead>
                  <TableHead className="font-semibold text-black">Partial Purchase</TableHead>
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
                ) : plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      No shares plans created yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
                    <TableRow key={plan.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-black">{plan.name}</p>
                          {plan.description && <p className="text-xs text-gray-600 mt-1">{plan.description}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">₦{plan.unit_price.toLocaleString()}</TableCell>
                      <TableCell>{plan.minimum_units}</TableCell>
                      <TableCell>{plan.maximum_units || "No limit"}</TableCell>
                      <TableCell>
                        <Badge variant={plan.allow_partial_purchase ? "default" : "secondary"}>
                          {plan.allow_partial_purchase ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {plan.is_default ? (
                          <Badge variant="default" className="bg-black text-white">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={plan.is_active ? "default" : "secondary"}>
                          {plan.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingPlan(plan);
                              setOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleMutation.mutate(plan.id)}
                          >
                            {plan.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4 text-gray-500" />}
                          </Button>
                          {!plan.is_default && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteMutation.mutate(plan.id)}
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
      </div>

      {/* Mobile: Card View */}
      <div className="block lg:hidden space-y-4">
        {isLoading ? (
          <Card><CardContent className="py-8 text-center text-gray-500">Loading...</CardContent></Card>
        ) : plans.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-gray-500">No shares plans created yet.</CardContent></Card>
        ) : (
          plans.map((plan) => (
            <Card key={plan.id} className="border border-gray-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.description && <CardDescription className="mt-1">{plan.description}</CardDescription>}
                  </div>
                  {plan.is_default && (
                    <Badge variant="default" className="bg-black text-white">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Default
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Price</span>
                  <span className="font-medium">₦{plan.unit_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Units</span>
                  <span>{plan.minimum_units}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Units</span>
                  <span>{plan.maximum_units || "No limit"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Partial Purchase</span>
                  <Badge variant={plan.allow_partial_purchase ? "default" : "secondary"}>
                    {plan.allow_partial_purchase ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge variant={plan.is_active ? "default" : "secondary"}>
                    {plan.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="pt-4 flex gap-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingPlan(plan);
                      setOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleMutation.mutate(plan.id)}
                  >
                    {plan.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </Button>
                  {!plan.is_default && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMutation.mutate(plan.id)}
                      className="text-red-600 border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-black">
              {editingPlan ? "Edit Shares Plan" : "Add New Shares Plan"}
            </DialogTitle>
          </DialogHeader>
          <SharesPlanForm
            plan={editingPlan}
            onSuccess={() => {
              setOpen(false);
              queryClient.invalidateQueries({ queryKey: ["shares-plans"] });
              queryClient.invalidateQueries({ queryKey: ["shares-plans-quota"] });
              toast.success(editingPlan ? "Plan updated" : "Plan created");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}