"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Phone,
  Mail,
  User,
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { MEMBERS_API } from "@/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Expected shape from backend
type NextOfKin = {
  id: number;
  full_name: string;
  relationship: string; // e.g., Spouse, Child, Parent, Sibling
  phone_number: string;
  email?: string | null;
  address?: string | null;
  created_at: string;
};

type Member = {
  id: number;
  first_name: string;
  last_name: string;
  next_of_kin?: NextOfKin[];
};

const nextOfKinSchema = z.object({
  full_name: z.string().min(3, "Full name is required"),
  relationship: z.string().min(2, "Relationship is required"),
  phone_number: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
});

type NextOfKinForm = z.infer<typeof nextOfKinSchema>;

interface NextOfKinTabProps {
  member: Member; // Full member object passed from ViewMember
}

export default function NextOfKinTab({ member }: NextOfKinTabProps) {
  const queryClient = useQueryClient();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingKin, setEditingKin] = useState<NextOfKin | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const nextOfKinList = member?.next_of_kin || [];

  // Mutations
  const addMutation = useMutation({
    mutationFn: async (data: NextOfKinForm) => {
      await apiClient.post(MEMBERS_API.NEXT_OF_KIN(member.id), data);
    },
    onSuccess: () => {
      toast.success("Next of kin added successfully");
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
      setOpenAdd(false);
      resetForm();
    },
    onError: (err: any) =>
      toast.error("Failed to add next of kin", { description: err.message }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: NextOfKinForm }) => {
      await apiClient.put(MEMBERS_API.NEXT_OF_KIN_ITEM(member.id, id), data);
    },
    onSuccess: () => {
      toast.success("Next of kin updated");
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
      setOpenEdit(false);
      setEditingKin(null);
      resetForm();
    },
    onError: () => toast.error("Failed to update next of kin"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (kinId: number) => {
      await apiClient.delete(MEMBERS_API.NEXT_OF_KIN_ITEM(member.id, kinId));
    },
    onSuccess: () => {
      toast.success("Next of kin removed");
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
      setDeletingId(null);
    },
    onError: () => toast.error("Failed to delete next of kin"),
  });

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<NextOfKinForm>({
    resolver: zodResolver(nextOfKinSchema),
  });

  const resetForm = () =>
    reset({
      full_name: "",
      relationship: "",
      phone_number: "",
      email: "",
      address: "",
    });

  const onSubmitAdd = (data: NextOfKinForm) => addMutation.mutate(data);

  const onSubmitEdit = (data: NextOfKinForm) => {
    if (!editingKin) return;
    updateMutation.mutate({ id: editingKin.id, data });
  };

  const handleEdit = (kin: NextOfKin) => {
    setEditingKin(kin);
    setValue("full_name", kin.full_name);
    setValue("relationship", kin.relationship);
    setValue("phone_number", kin.phone_number);
    setValue("email", kin.email || "");
    setValue("address", kin.address || "");
    setOpenEdit(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Next of Kin
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage emergency contacts and beneficiaries for this member
          </p>
        </div>

        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Next of Kin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Next of Kin</DialogTitle>
              <DialogDescription>
                Provide details of the person to contact in case of emergency.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitAdd)} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  {...register("full_name")}
                  placeholder="John Doe"
                />
                {errors.full_name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  {...register("relationship")}
                  placeholder="e.g., Spouse, Parent, Child"
                />
                {errors.relationship && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.relationship.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone_number")}
                  placeholder="08012345678"
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="kin@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="123 Main St, Lagos"
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {nextOfKinList.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No next of kin added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {nextOfKinList.map((kin) => (
            <Card key={kin.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{kin.full_name}</CardTitle>
                      <CardDescription className="capitalize">
                        {kin.relationship}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(kin)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingId(kin.id)}
                      disabled={
                        deleteMutation.isPending && deletingId === kin.id
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{kin.phone_number}</span>
                </div>
                {kin.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{kin.email}</span>
                  </div>
                )}
                {kin.address && (
                  <div className="flex items-center gap-2 col-span-2">
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                    <span>{kin.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Next of Kin</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
            <div>
              <Label htmlFor="edit_full_name">Full Name</Label>
              <Input id="edit_full_name" {...register("full_name")} />
            </div>
            <div>
              <Label htmlFor="edit_relationship">Relationship</Label>
              <Input id="edit_relationship" {...register("relationship")} />
            </div>
            <div>
              <Label htmlFor="edit_phone">Phone Number</Label>
              <Input id="edit_phone" {...register("phone_number")} />
            </div>
            <div>
              <Label htmlFor="edit_email">Email (Optional)</Label>
              <Input id="edit_email" type="email" {...register("email")} />
            </div>
            <div>
              <Label htmlFor="edit_address">Address (Optional)</Label>
              <Input id="edit_address" {...register("address")} />
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
              <DialogTitle>Remove Next of Kin?</DialogTitle>
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
