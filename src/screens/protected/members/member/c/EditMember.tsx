// src/components/member/EditMember.tsx
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Building2,
  ToggleLeft,
  ToggleRight,
  CreditCard,
  Bell,
  DollarSign,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/lib/api-client";
import { BRANCH_API, MEMBERS_API } from "@/constants";

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
  "Federal Capital Territory",
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

export default function EditMember({ member: initialMember }: { member: any }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialMember);

  useEffect(() => {
    setForm(initialMember);
  }, [initialMember]);

  const { data } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const res = await apiClient.get(BRANCH_API.LIST);
      return res.data; // Full payload: { branches: [], quota: {}, ... }
    },
  });

  const branchesData = data?.branches ?? [];

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
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-gray-900">
          <User className="w-8 h-8 text-gray-800" />
          Edit Member Details
        </h2>
        <Button
          size="lg"
          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-md rounded-lg px-6"
          onClick={() => updateMember.mutate()}
          disabled={updateMember.isPending}
        >
          {updateMember.isPending ? (
            <>
              <Save className="w-5 h-5 mr-2 animate-spin" />
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
        {/* Personal Information */}
        <Card className="p-6 md:p-8 shadow-sm border border-gray-200 rounded-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <User className="w-6 h-6 text-gray-700" />
            Personal Information
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  className="mt-1.5 border-gray-300 focus:border-gray-500"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  className="mt-1.5 border-gray-300 focus:border-gray-500"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Other Name (Optional)
              </Label>
              <Input
                value={form.other_name || ""}
                onChange={(e) => handleChange("other_name", e.target.value)}
                className="mt-1.5 border-gray-300 focus:border-gray-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Gender
                </Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => handleChange("gender", v)}
                >
                  <SelectTrigger className="mt-1.5 border-gray-300 focus:border-gray-500">
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
                <Label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) =>
                    handleChange("date_of_birth", e.target.value)
                  }
                  className="mt-1.5 border-gray-300 focus:border-gray-500"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Date Joined
              </Label>
              <Input
                type="date"
                value={form.date_joined}
                onChange={(e) => handleChange("date_joined", e.target.value)}
                className="mt-1.5 border-gray-300 focus:border-gray-500"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Membership ID
              </Label>
              <Input
                value={form.membership_id || ""}
                onChange={(e) => handleChange("membership_id", e.target.value)}
                className="mt-1.5 border-gray-300 focus:border-gray-500"
              />
            </div>
          </div>
        </Card>

        {/* Contact & Address */}
        <Card className="p-6 md:p-8 shadow-sm border border-gray-200 rounded-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <MapPin className="w-6 h-6 text-gray-700" />
            Contact & Address
          </h3>
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="mt-1.5 border-gray-300 focus:border-gray-500"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                type="email"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-1.5 border-gray-300 focus:border-gray-500"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Branch
              </Label>
              <Select
                value={String(form.branch_id)}
                onValueChange={(v) => handleChange("branch_id", Number(v))}
              >
                <SelectTrigger className="mt-1.5 border-gray-300 focus:border-gray-500">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchesData?.map((b: any) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-600" />
                        {b.name} - {b.city}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Full Address
              </Label>
              <Input
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="mt-1.5 border-gray-300 focus:border-gray-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  City
                </Label>
                <Input
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="mt-1.5 border-gray-300 focus:border-gray-500"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  State
                </Label>
                <Select
                  value={form.state}
                  onValueChange={(v) => handleChange("state", v)}
                >
                  <SelectTrigger className="mt-1.5 border-gray-300 focus:border-gray-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">LGA</Label>
                <Input
                  value={form.lga}
                  onChange={(e) => handleChange("lga", e.target.value)}
                  className="mt-1.5 border-gray-300 focus:border-gray-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Financial Settings */}
        <Card className="p-6 md:p-8 shadow-sm border border-gray-200 rounded-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <DollarSign className="w-6 h-6 text-gray-700" />
            Financial Settings
          </h3>
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Monthly Savings Target (₦)
              </Label>
              <Input
                type="number"
                value={form.monthly_savings_target || ""}
                onChange={(e) =>
                  handleChange("monthly_savings_target", e.target.value)
                }
                className="mt-1.5 border-gray-300 focus:border-gray-500"
                placeholder="0"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Total Savings (₦) - Read Only
                </Label>
                <Input
                  type="number"
                  value={form.total_savings || 0}
                  disabled
                  className="mt-1.5 bg-gray-100 border-gray-300"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Total Shares - Read Only
                </Label>
                <Input
                  type="number"
                  value={form.total_shares || 0}
                  disabled
                  className="mt-1.5 bg-gray-100 border-gray-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Total Loans (₦) - Read Only
                </Label>
                <Input
                  type="number"
                  value={form.total_loans || 0}
                  disabled
                  className="mt-1.5 bg-gray-100 border-gray-300"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Outstanding Loan (₦) - Read Only
                </Label>
                <Input
                  type="number"
                  value={form.outstanding_loan || 0}
                  disabled
                  className="mt-1.5 bg-gray-100 border-gray-300"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Member Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger className="mt-1.5 border-gray-300 focus:border-gray-500">
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

        {/* Verification & Permissions */}
        <Card className="p-6 md:p-8 shadow-sm border border-gray-200 rounded-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <Shield className="w-6 h-6 text-gray-700" />
            Verification & Permissions
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">BVN</Label>
                <Input
                  value={form.bvn || ""}
                  onChange={(e) => handleChange("bvn", e.target.value)}
                  className="mt-1.5 border-gray-300 focus:border-gray-500"
                  maxLength={11}
                />
              </div>
              <div className="flex items-center justify-between mt-6">
                <Label className="text-sm font-medium text-gray-700">
                  BVN Verified
                </Label>
                <Switch
                  checked={form.bvn_verified}
                  onCheckedChange={(v) => handleChange("bvn_verified", v)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">NIN</Label>
                <Input
                  value={form.nin || ""}
                  onChange={(e) => handleChange("nin", e.target.value)}
                  className="mt-1.5 border-gray-300 focus:border-gray-500"
                  maxLength={11}
                />
              </div>
              <div className="flex items-center justify-between mt-6">
                <Label className="text-sm font-medium text-gray-700">
                  NIN Verified
                </Label>
                <Switch
                  checked={form.nin_verified}
                  onCheckedChange={(v) => handleChange("nin_verified", v)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Is Guarantor</p>
                  <p className="text-xs text-gray-500">
                    Can guarantee loans for other members
                  </p>
                </div>
              </div>
              <Switch
                checked={form.is_guarantor}
                onCheckedChange={(v) => handleChange("is_guarantor", v)}
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 md:p-8 shadow-sm border border-gray-200 rounded-xl lg:col-span-2">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
            <Bell className="w-6 h-6 text-gray-700" />
            Notification Preferences
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">SMS Reminders</p>
                  <p className="text-xs text-gray-500">
                    Enable SMS notifications and reminders
                  </p>
                </div>
              </div>
              <Switch
                checked={form.sms_reminders_enabled}
                onCheckedChange={(v) =>
                  handleChange("sms_reminders_enabled", v)
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Email Reminders</p>
                  <p className="text-xs text-gray-500">
                    Enable email notifications and reminders
                  </p>
                </div>
              </div>
              <Switch
                checked={form.email_reminders_enabled}
                onCheckedChange={(v) =>
                  handleChange("email_reminders_enabled", v)
                }
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
