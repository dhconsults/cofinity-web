"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

/* ================= TYPES ================= */

type NextOfKin = {
  id: number;
  full_name: string;
  relationship: string;
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

const RELATIONSHIP_OPTIONS = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Guardian",
  "Relative",
  "Friend",
  "Other",
];

const nextOfKinSchema = z.object({
  full_name: z.string().min(3, "Full name is required"),
  relationship: z.string().min(2, "Relationship is required"),
  phone_number: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
});

type NextOfKinForm = z.infer<typeof nextOfKinSchema>;

interface NextOfKinTabProps {
  member: Member;
}

/* ================= COMPONENT ================= */

export default function NextOfKinTab({ member }: NextOfKinTabProps) {
  const queryClient = useQueryClient();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingKin, setEditingKin] = useState<NextOfKin | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const nextOfKinList = member?.next_of_kin || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NextOfKinForm>({
    resolver: zodResolver(nextOfKinSchema),
  });

  const relationshipValue = watch("relationship");

  const resetForm = () =>
    reset({
      full_name: "",
      relationship: "",
      phone_number: "",
      email: "",
      address: "",
    });

  /* ================= MUTATIONS ================= */

  const addMutation = useMutation({
    mutationFn: async (data: NextOfKinForm) =>
      apiClient.post(MEMBERS_API.NEXT_OF_KIN(member.id), data),
    onSuccess: () => {
      toast.success("Next of kin added successfully");
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
      setOpenAdd(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: NextOfKinForm }) =>
      apiClient.put(MEMBERS_API.NEXT_OF_KIN_ITEM(member.id, id), data),
    onSuccess: () => {
      toast.success("Next of kin updated");
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
      setOpenEdit(false);
      setEditingKin(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) =>
      apiClient.delete(MEMBERS_API.NEXT_OF_KIN_ITEM(member.id, id)),
    onSuccess: () => {
      toast.success("Next of kin removed");
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
      setDeletingId(null);
    },
  });

  const handleEdit = (kin: NextOfKin) => {
    setEditingKin(kin);
    setValue("full_name", kin.full_name);
    setValue("relationship", kin.relationship);
    setValue("phone_number", kin.phone_number);
    setValue("email", kin.email || "");
    setValue("address", kin.address || "");
    setOpenEdit(true);
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Next of Kin
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage emergency contacts and beneficiaries
          </p>
        </div>

        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Next of Kin
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Next of Kin</DialogTitle>
              <DialogDescription>
                Emergency contact information
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit((d) => addMutation.mutate(d))}
              className="space-y-4"
            >
              <div>
                <Label>Full Name</Label>
                <Input {...register("full_name")} />
                {errors.full_name && (
                  <p className="text-sm text-red-600">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Relationship</Label>
                <Select
                  value={relationshipValue}
                  onValueChange={(v) => setValue("relationship", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.relationship && (
                  <p className="text-sm text-red-600">
                    {errors.relationship.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input {...register("phone_number")} />
              </div>

              <div>
                <Label>Email (Optional)</Label>
                <Input type="email" {...register("email")} />
              </div>

              <div>
                <Label>Address (Optional)</Label>
                <Input {...register("address")} />
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="w-full sm:w-auto"
                >
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

      {/* List */}
      {nextOfKinList.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No next of kin added yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {nextOfKinList.map((kin) => (
            <Card key={kin.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="truncate">
                        {kin.full_name}
                      </CardTitle>
                      <CardDescription className="truncate capitalize">
                        {kin.relationship}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(kin)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
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

              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 ">
                  <Phone className="w-4 h-4" />
                  {kin.phone_number}
                </div>
                {kin.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {kin.email}
                  </div>
                )}
                {kin.address && (
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <AlertCircle className="w-4 h-4" />
                    {kin.address}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Next of Kin</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit((d) => {
              if (!editingKin) return;
              updateMutation.mutate({ id: editingKin.id, data: d });
            })}
            className="space-y-4"
          >
            <div>
              <Label>Full Name</Label>
              <Input {...register("full_name")} />
            </div>

            <div>
              <Label>Relationship</Label>
              <Select
                value={relationshipValue}
                onValueChange={(v) => setValue("relationship", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input {...register("phone_number")} />
            </div>

            <div>
              <Label>Email (Optional)</Label>
              <Input type="email" {...register("email")} />
            </div>

            <div>
              <Label>Address (Optional)</Label>
              <Input {...register("address")} />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updateMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      {deletingId && (
        <Dialog open onOpenChange={() => setDeletingId(null)}>
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
