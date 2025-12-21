// src/components/member/EditMember.tsx
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, User, Phone, Mail, MapPin, Calendar, Shield, Building2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/lib/api-client";
import { BRANCH_API, MEMBERS_API } from "@/constants";

const nigerianStates = ["Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Kaduna", "Delta", "Ogun", "Enugu", "Anambra"];

export default function EditMember({ member: initialMember }: { member: any }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialMember);

  useEffect(() => {
    setForm(initialMember);
  }, [initialMember]);

  const { data: branchesData } = useQuery({
    queryKey: ["branches"],
    queryFn: () => apiClient.get(BRANCH_API.LIST).then(res => res.data.branches),
  });

  const updateMember = useMutation({
    mutationFn: () => apiClient.put(MEMBERS_API.UPDATE(form.id), form),
    onSuccess: () => {
      toast.success("Member updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["member", form.id] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => toast.error("Failed to update member"),
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <User className="w-10 h-10 text-neutral-800" />
          Edit Member Details
        </h2>
        <Button
          size="lg"
          className="bg-gradient-to-r from-black to-neutral-800 hover:from-neutral-800 hover:to-black text-white shadow-xl"
          onClick={() => updateMember.mutate()}
          disabled={updateMember.isPending}
        >
          {updateMember.isPending ? (
            <>
              <Save className="w-5 h-5 mr-2 animate-pulse" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Personal Info */}
        <Card className="p-8 bg-gradient-to-br from-neutral-50 to-neutral-100 border-neutral-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-6 h-6" />
            Personal Information
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input value={form.first_name} onChange={e => handleChange("first_name", e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={form.last_name} onChange={e => handleChange("last_name", e.target.value)} className="mt-2" />
              </div>
            </div>
            <div>
              <Label>Other Name (Optional)</Label>
              <Input value={form.other_name || ""} onChange={e => handleChange("other_name", e.target.value)} className="mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={v => handleChange("gender", v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={form.date_of_birth} onChange={e => handleChange("date_of_birth", e.target.value)} className="mt-2" />
              </div>
            </div>
          </div>
        </Card>

        {/* Contact & Address */}
        <Card className="p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border-blue-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Phone className="w-6 h-6" />
            Contact & Address
          </h3>
          <div className="space-y-6">
            <div>
              <Label>Phone Number</Label>
              <Input value={form.phone} onChange={e => handleChange("phone", e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input type="email" value={form.email || ""} onChange={e => handleChange("email", e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label>Branch</Label>
              <Select value={String(form.branch_id)} onValueChange={v => handleChange("branch_id", Number(v))}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchesData?.map((b: any) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {b.name} - {b.city}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Full Address</Label>
              <Input value={form.address} onChange={e => handleChange("address", e.target.value)} className="mt-2" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input value={form.city} onChange={e => handleChange("city", e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label>State</Label>
                <Select value={form.state} onValueChange={v => handleChange("state", v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>LGA</Label>
                <Input value={form.lga} onChange={e => handleChange("lga", e.target.value)} className="mt-2" />
              </div>
            </div>
          </div>
        </Card>

        {/* Financial Targets */}
        <Card className="p-8 bg-gradient-to-br from-emerald-50/50 to-green-50/30 border-emerald-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Financial Settings
          </h3>
          <div className="space-y-6">
            <div>
              <Label>Monthly Savings Target (₦)</Label>
              <Input
                type="number"
                value={form.monthly_savings_target || ""}
                onChange={e => handleChange("monthly_savings_target", e.target.value)}
                className="mt-2 text-xl font-bold"
                placeholder="0"
              />
            </div>
            <div>
              <Label>Member Status</Label>
              <Select value={form.status} onValueChange={v => handleChange("status", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* KYC & Permissions */}
        <Card className="p-8 bg-gradient-to-br from-purple-50/50 to-indigo-50/30 border-purple-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Verification & Permissions
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
              <div className="flex items-center gap-4">
                <ToggleLeft className="w-8 h-8 text-neutral-400" />
                <div>
                  <p className="font-semibold">BVN Verified</p>
                  <p className="text-sm text-neutral-600">Bank Verification Number</p>
                </div>
              </div>
              <Switch
                checked={form.bvn_verified}
                onCheckedChange={v => handleChange("bvn_verified", v)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
              <div className="flex items-center gap-4">
                <ToggleRight className="w-8 h-8 text-neutral-400" />
                <div>
                  <p className="font-semibold">NIN Verified</p>
                  <p className="text-sm text-neutral-600">National Identification Number</p>
                </div>
              </div>
              <Switch
                checked={form.nin_verified}
                onCheckedChange={v => handleChange("nin_verified", v)}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
              <div className="flex items-center gap-4">
                <User className="w-8 h-8 text-neutral-400" />
                <div>
                  <p className="font-semibold">Is Guarantor</p>
                  <p className="text-sm text-neutral-600">Can stand for loan applications</p>
                </div>
              </div>
              <Switch
                checked={form.is_guarantor}
                onCheckedChange={v => handleChange("is_guarantor", v)}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}