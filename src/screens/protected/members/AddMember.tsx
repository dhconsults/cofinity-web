// app/members/add/page.tsx  (or wherever your route is)
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api-client";
import { useNavigate } from "react-router-dom";
import { BRANCH_API, MEMBERS_API } from "@/constants";
import TopNav from "@/components/TopNav";

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function AddMember() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: branchesData, isLoading: branchesLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const res = await apiClient.get(BRANCH_API.LIST);
      return res.data;
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

  const [verifyModal, setVerifyModal] = useState<{
    open: boolean;
    type: "bvn" | "nin" | null;
  }>({ open: false, type: null });

  const [verifyId, setVerifyId] = useState("");

  const createMember = useMutation({
    mutationFn: (data: any) => apiClient.post(MEMBERS_API.CREATE, data),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "Failed to add member");
        return;
      }
      toast.success("Member added successfully!");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      navigate("/members");
    },
    onError: (error: any) => {
      const msg = error?.message || "Failed to add member";
      if (error.response?.status === 403) {
        toast.error("Member limit reached. Upgrade your plan.");
      } else {
        toast.error(msg);
      }
    },
  });

  const verifyIdentity = () => {
    toast.info("Coming Soon", {
      description:
        "Identity verification will be available in a future update.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = [
      "first_name",
      "last_name",
      "gender",
      "date_of_birth",
      "phone",
      "address",
      "city",
      "state",
      "lga",
      "branch_id",
    ];

    for (const field of required) {
      if (!formData[field as keyof typeof formData]?.toString().trim()) {
        toast.error(`Please fill in ${field.replace(/_/g, " ")}`);
        return;
      }
    }

    createMember.mutate({
      ...formData,
      branch_id: Number(formData.branch_id),
      monthly_savings_target: formData.monthly_savings_target || 0,
      bvn_verified: verification.bvn_verified,
      nin_verified: verification.nin_verified,
    });
  };

  return (
    <div className="   bg-gray-50">
      {" "}
      {/* This allows it to scroll with the layout */}
      {/* Page Header - Not sticky, flows with content */}
      <TopNav
        title="Add New Member"
        description="Register a new cooperative member"
        icon={<UserPlus className="h-8 w-8 text-gray-400 hidden sm:block" />}
        link="/members"
      />
      {/* Main Form Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto ">
          <form id="add-member-form" onSubmit={handleSubmit} />

          {/* Personal Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    placeholder="Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Other Name</Label>
                  <Input
                    value={formData.other_name}
                    onChange={(e) =>
                      setFormData({ ...formData, other_name: e.target.value })
                    }
                    placeholder="Middle name (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select
                    onValueChange={(v) =>
                      setFormData({ ...formData, gender: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Date of Birth *</Label>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+2348012345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Branch Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Assign to Branch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md">
                  <Label>Branch *</Label>
                  {branchesLoading ? (
                    <div className="mt-2 h-10 bg-gray-100 rounded-lg animate-pulse" />
                  ) : branches.length === 0 ? (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No branches found.{" "}
                        <a href="/branches" className="underline font-medium">
                          Create a branch first
                        </a>
                        .
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Select
                      value={formData.branch_id}
                      onValueChange={(v) =>
                        setFormData({ ...formData, branch_id: v })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch: any) => (
                          <SelectItem key={branch.id} value={String(branch.id)}>
                            <div className="flex items-center gap-3">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="font-medium">{branch.name}</div>
                                <div className="text-xs text-gray-500">
                                  {branch.city}, {branch.state}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Identity Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Identity Verification (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>BVN</Label>
                  <div className="flex gap-3">
                    <Input
                      value={formData.bvn}
                      disabled={verification.bvn_verified}
                      placeholder="11 digits"
                      maxLength={11}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bvn: e.target.value.replace(/\D/g, "").slice(0, 11),
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant={
                        verification.bvn_verified ? "outline" : "default"
                      }
                      disabled={verification.bvn_verified}
                      onClick={() =>
                        setVerifyModal({ open: true, type: "bvn" })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nin: e.target.value.replace(/\D/g, "").slice(0, 11),
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant={
                        verification.nin_verified ? "outline" : "default"
                      }
                      disabled={verification.nin_verified}
                      onClick={() =>
                        setVerifyModal({ open: true, type: "nin" })
                      }
                    >
                      {verification.nin_verified ? "Verified" : "Verify"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Full Address *</Label>
                  <Textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="123 Example Street, Off Main Road..."
                    className="resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State *</Label>
                    <Select
                      onValueChange={(v) =>
                        setFormData({ ...formData, state: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s} State
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>LGA *</Label>
                    <Input
                      value={formData.lga}
                      onChange={(e) =>
                        setFormData({ ...formData, lga: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMember.isPending}
                form="add-member-form"
                className="bg-black hover:bg-gray-900 text-white"
              >
                {createMember.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Member...
                  </>
                ) : (
                  "Add Member"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Verification Modal */}
      <Dialog
        open={verifyModal.open}
        onOpenChange={(open) =>
          !open && setVerifyModal({ open: false, type: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify {verifyModal.type?.toUpperCase()}</DialogTitle>
            <DialogDescription>
              Enter the member's {verifyModal.type} to verify identity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={verifyId}
              onChange={(e) =>
                setVerifyId(e.target.value.replace(/\D/g, "").slice(0, 11))
              }
              placeholder="Enter 11-digit number"
              maxLength={11}
              autoFocus
            />
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will verify the identity through our secure partner
                (Korapay).
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVerifyModal({ open: false, type: null })}
            >
              Cancel
            </Button>
            <Button onClick={verifyIdentity} disabled={verifyId.length !== 11}>
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
