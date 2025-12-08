import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Building2,
  AlertCircle,
  Shield,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api-client";
import { useNavigate } from "react-router-dom";
import { BRANCH_API, MEMBERS_API } from "@/constants";

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export default function AddMember() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();




  const { data: branchesData, isLoading: branchesLoading } = useQuery({
      queryKey: ["branches"],
      queryFn: async () => {
        const res = await apiClient.get(BRANCH_API.LIST);
        return res.data; // Full payload: { branches: [], quota: {}, ... }
      },
    });
  
    const branches = branchesData?.branches ?? [];

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    other_name: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    email: "",
    bvn: "",
    nin: "",
    address: "",
    city: "",
    state: "",
    lga: "",
    monthly_savings_target: "",
    branch_id: "",
  });

  const [verification, setVerification] = useState({
    bvn_verified: false,
    nin_verified: false,
  });

  const [verifyModal, setVerifyModal] = useState<{ open: boolean; type: "bvn" | "nin" | null }>({
    open: false,
    type: null,
  });

  const [verifyId, setVerifyId] = useState("");

  // Mutations
  const createMember = useMutation({
    mutationFn: (data: any) => apiClient.post(MEMBERS_API.CREATE, data),
    onSuccess: () => {
      toast.success("Member added successfully!");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      navigate("/members");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to add member";
      if (error.response?.status === 403) {
        toast.error("Member limit reached. Upgrade your plan.");
      } else {
        toast.error(msg);
      }
    },
  });


//   const verifyIdentity = useMutation({
//     mutationFn: ({ type, id }: { type: "bvn" | "nin"; id: string }) =>
//       apiClient.post(`/kyc/verify-${type}`, { [type]: id }),
//     onSuccess: (res: any, vars) => {
//       toast.success(`${vars.type.toUpperCase()} verified successfully!`);
//       setVerification(prev => ({ ...prev, [vars.type + "_verified"]: true }));
//       setFormData(prev => ({ ...prev, [vars.type]: vars.id }));
//       setVerifyModal({ open: false, type: null });
//       setVerifyId("");
//     },
//     onError: () => {
//       toast.error("Verification failed. Please check the ID and try again.");
//     },
//   });



const verifyIdentity = () => { 
                toast.info("Coming Soon", { description: 'Identity verification  will be available in a future update.' } );

}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const required = ["first_name", "last_name", "gender", "date_of_birth", "phone", "address", "city", "state", "lga"];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]?.trim()) {
       if (!formData[field as keyof typeof formData]?.toString().trim()) {
      toast.error(`Please fill ${field === "branch_id" ? "branch" : field.replace(/_/g, " ")}`);
      return;
    }
      }
    }

    createMember.mutate({
      ...formData,
      branch_id: Number(formData.branch_id),
      bvn_verified: verification.bvn_verified,
      nin_verified: verification.nin_verified,
      monthly_savings_target: formData.monthly_savings_target || 0,
    });
  };

  return (
    <div className=" bg-neutral-50 p-6">
      <div className="mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Member</h1>
              <p className="text-neutral-600">Register a new cooperative member</p>
            </div>
          </div>
          <UserPlus className="w-10 h-10 text-neutral-400" />
        </div>

        <form onSubmit={handleSubmit} className="">

          {/* Personal Info */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={formData.first_name}
                  onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  value={formData.last_name}
                  onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Other Name</Label>
                <Input
                  value={formData.other_name}
                  onChange={e => setFormData({ ...formData, other_name: e.target.value })}
                  placeholder="Middle name (optional)"
                />
              </div>
              <div className="space-y-2 w-full">
                <Label>Gender *</Label>
                <Select onValueChange={v => setFormData({ ...formData, gender: v })} >
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+2348012345678"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
    <Building2 className="w-6 h-6" />
    Assign to Branch
  </h2>
  <div className="max-w-md">
    <Label>Branch *</Label>
    {branchesLoading ? (
      <div className="h-10 bg-neutral-100 rounded-lg animate-pulse" />
    ) : branches.length === 0 ? (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No branches found. <a href="/branches" className="underline font-medium">Create a branch first</a>.
        </AlertDescription>
      </Alert>
    ) : (
      <Select
        value={formData.branch_id}
        onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
      >
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Select a branch" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch: any) => (
            <SelectItem key={branch.id} value={String(branch.id)}>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral-500" />
                <div>
                  <div className="font-medium">{branch.name}</div>
                  <div className="text-xs text-neutral-500">
                    {branch.city}, {branch.state}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
    {!formData.branch_id && formData.branch_id !== "" && (
      <p className="text-xs text-red-600 mt-1">Please select a branch</p>
    )}
  </div>
</Card>



          {/* KYC Verification */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" /> Identity Verification
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>BVN</Label>
                <div className="flex gap-3">
                  <Input
                    value={formData.bvn}
                    disabled={verification.bvn_verified}
                    placeholder="11 digits"
                    maxLength={11}
                    onChange={e => setFormData({ ...formData, bvn: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                  />
                  <Button
                    type="button"
                    onClick={() => setVerifyModal({ open: true, type: "bvn" })}
                    disabled={verification.bvn_verified}
                    variant={verification.bvn_verified ? "outline" : "default"}
                  >
                    {verification.bvn_verified ? "Verified" : "Verify"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>NIN</Label>
                <div className="flex gap-3">
                  <Input
                    value={formData.nin}
                    disabled={verification.nin_verified}
                    placeholder="11 digits"
                    maxLength={11}
                    onChange={e => setFormData({ ...formData, nin: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                  />
                  <Button
                    type="button"
                    onClick={() => setVerifyModal({ open: true, type: "nin" })}
                    disabled={verification.nin_verified}
                    variant={verification.nin_verified ? "outline" : "default"}
                  >
                    {verification.nin_verified ? "Verified" : "Verify"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Address */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Address</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Full Address *</Label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-neutral-200 p-3 focus:border-black focus:ring-black"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Example Street..."
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Select onValueChange={v => setFormData({ ...formData, state: v })}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map(s => <SelectItem key={s} value={s}>{s} State</SelectItem>)} 
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>LGA *</Label>
                  <Input value={formData.lga} onChange={e => setFormData({ ...formData, lga: e.target.value })} />
                </div>
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMember.isPending}
              className="bg-black hover:bg-neutral-900"
            >
              {createMember.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Member...
                </>
              ) : (
                "Add Member"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Verification Modal */}
      <Dialog open={verifyModal.open} onOpenChange={() => setVerifyModal({ open: false, type: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify {verifyModal.type?.toUpperCase()}</DialogTitle>
            <DialogDescription>
              Enter the member's {verifyModal.type} to verify identity 
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={verifyId}
              onChange={e => setVerifyId(e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="Enter 11-digit number"
              maxLength={11}
            />
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                This will verify the identity through our secure API.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyModal({ open: false, type: null })}>
              Cancel
            </Button>
            <Button
              onClick={() =>  verifyIdentity()} // verifyIdentity.mutate({ type: verifyModal.type!, id: verifyId })}
              disabled={verifyId.length !== 11}
            >
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}