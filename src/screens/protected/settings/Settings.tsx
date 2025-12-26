"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  Settings as SettingsIcon,
  Upload,
  Banknote,
  Bell,
  Receipt,
  Shield,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import apiClient from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import PayoutAccountModal from "./PayoutAccountModal";
import { getData } from "@/lib/storageHelper";

const settingsSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().optional(),
  registration_number: z.string().optional(),

  settlement_type: z.enum(["collection", "wallet"]),
  sweep_bank_name: z.string().optional(),
  sweep_bank_code: z.string().optional(),
  sweep_account_number: z.string().optional(),
  sweep_account_name: z.string().optional(),

  registration_fee: z.string().regex(/^\d+(\.\d{1,2})?$/),
  maintenance_fee: z.string().regex(/^\d+(\.\d{1,2})?$/),
  maintenance_frequency: z.enum(["weekly", "monthly"]),
  auto_deduct_fees: z.boolean(),

  deposit_charge_bearer: z.enum(["cooperative", "member"]),
  sms_charge_bearer: z.enum(["cooperative", "member"]),
  email_charge_bearer: z.enum(["cooperative", "member"]),

  sms_enabled: z.boolean(),
  email_enabled: z.boolean(),

  notification_preferences: z.object({
    memberRegistration: z.object({ sms: z.boolean(), email: z.boolean() }),
    savingsDeposit: z.object({ sms: z.boolean(), email: z.boolean() }),
    savingsWithdrawal: z.object({ sms: z.boolean(), email: z.boolean() }),
    loanApproval: z.object({ sms: z.boolean(), email: z.boolean() }),
    loanDisbursement: z.object({ sms: z.boolean(), email: z.boolean() }),
    loanRepayment: z.object({ sms: z.boolean(), email: z.boolean() }),
    feeDeduction: z.object({ sms: z.boolean(), email: z.boolean() }),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { user, tenants, updateUser } = useAuth();

  const currentUser = user;

  const localCoopId = getData<string | number>("selected_cooperative_id");
  const tenant = tenants?.find((t) => t.id === localCoopId);

  const [activeTab, setActiveTab] = useState("organization");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [cacPreview, setCacPreview] = useState<string | null>(null);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);

  // MFA states
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [manualSecret, setManualSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  const settlementType = watch("settlement_type");

  // Load tenant data into form
  useEffect(() => {
    if (tenant) {
      reset({
        name: tenant.name || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        address: tenant.address || "",
        registration_number: tenant.registration_number || "",

        settlement_type: tenant.auto_sweep_enabled ? "wallet" : "collection",
        sweep_bank_name: tenant.sweep_bank_name || "",
        sweep_bank_code: tenant.sweep_bank_code || "",
        sweep_account_number: tenant.sweep_account_number || "",
        sweep_account_name: tenant.sweep_account_name || "",

        registration_fee: tenant.membership_fee || "0.00",
        maintenance_fee: "0.00", // Add field if needed
        maintenance_frequency: "monthly",
        auto_deduct_fees: true,

        deposit_charge_bearer: "cooperative",
        sms_charge_bearer: tenant.sms_enabled ? "cooperative" : "member",
        email_charge_bearer: tenant.email_enabled ? "cooperative" : "member",

        sms_enabled: Boolean(tenant.sms_enabled),
        email_enabled: Boolean(tenant.email_enabled),

        notification_preferences: {
          memberRegistration: { sms: true, email: true },
          savingsDeposit: { sms: true, email: false },
          savingsWithdrawal: { sms: true, email: false },
          loanApproval: { sms: true, email: true },
          loanDisbursement: { sms: true, email: true },
          loanRepayment: { sms: true, email: false },
          feeDeduction: { sms: true, email: true },
        },
      });

      // Preload logo if exists
      if (tenant.logo) {
        setLogoPreview(`$/storage/${tenant.logo}`);
      }
    }
  }, [tenant, reset]);

  // File upload preview only (real upload on save)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cac"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "logo") setLogoPreview(reader.result as string);
      if (type === "cac") setCacPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save all settings
  const saveSettings = async (data: SettingsFormData) => {
    const formData = new FormData();

    // Append text fields
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
      } else {
        formData.append(key, value as string);
      }
    });

    // Append files if selected
    const logoInput = document.querySelector(
      'input[type="file"][accept="image/*"]'
    ) as HTMLInputElement;
    const cacInput = document.querySelector(
      'input[type="file"][accept=".pdf,.jpg,.jpeg,.png"]'
    ) as HTMLInputElement;

    if (logoInput?.files?.[0]) formData.append("logo", logoInput.files[0]);
    if (cacInput?.files?.[0]) formData.append("cac_cert", cacInput.files[0]);

    await apiClient.post("/api/tenants/settings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await saveSettings(data);
      toast.success("Settings Saved", {
        description: "All changes have been successfully applied.",
      });
      // Optionally refetch tenant data
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    } catch (error: any) {
      toast.error("Save Failed", {
        description: error?.message || "Please try again later.",
      });
    }
  };

  // MFA Handlers
  const handleEnableMFA = async () => {
    setIsSettingUp(true);
    try {
      const res = await apiClient.get("/api/tenant-users/mfa/setup");
      setQrCodeUrl(res.data.qr_code_url);
      setManualSecret(res.data.secret);
      setShowQRModal(true);
    } catch (err: any) {
      toast.error("Setup Failed", {
        description: err?.response?.data?.message || "Please try again.",
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    try {
      await apiClient.post("/api/tenant-users/mfa/enable", {
        code: verificationCode,
      });
      toast.success("MFA Enabled", {
        description: "You will now need a code for withdrawals.",
      });
      setShowQRModal(false);
      setVerificationCode("");
      // Update user state
      updateUser({ ...user!, mfa_enabled: true });
    } catch (err: any) {
      toast.error("Invalid Code", {
        description: err?.response?.data?.message || "Try again.",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleDisableMFA = async () => {
    const password = prompt("Enter your password to disable MFA");
    if (!password) return;

    try {
      await apiClient.post("/api/tenant-users/mfa/disable", {
        current_password: password,
      });
      toast.success("MFA Disabled");
      updateUser({ ...user!, mfa_enabled: false });
    } catch (err: any) {
      toast.error("Failed", {
        description: err?.response?.data?.message || "Incorrect password",
      });
    }
  };

  const tabs = [
    { key: "organization", label: "Organization", icon: SettingsIcon },
    { key: "payout", label: "Payout & Wallet", icon: Banknote },
    { key: "fees", label: "Fees & Charges", icon: Receipt },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "mfa", label: "Security (MFA)", icon: Shield },
  ];

  if (!tenant) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Horizontal scrollable on mobile, vertical on md+ */}
      <aside className="bg-white border-b shadow-sm md:w-64 md:border-b-0 md:border-r">
        <div className="p-5 border-b md:border-b-0">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-gray-800" />
            <h2 className="font-semibold text-lg">System Settings</h2>
          </div>
        </div>
        <nav className="p-4 overflow-x-auto md:space-y-1 md:overflow-x-visible whitespace-nowrap md:whitespace-normal">
          <div className="flex gap-2 md:flex-col md:gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-sm md:text-base md:w-full ${
                  activeTab === tab.key
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 mt-4 pt-0 md:p-6 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Organization Profile */}
          {activeTab === "organization" && (
            <Card>
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>
                  Update your cooperative's public information
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Cooperative Name</Label>
                  <Input
                    {...register("name")}
                    placeholder="e.g. Unity Thrift Cooperative"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" {...register("email")} />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input {...register("phone")} placeholder="08012345678" />
                </div>

                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input {...register("registration_number")} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input {...register("address")} />
                </div>

                <div className="space-y-2">
                  <Label>Upload Logo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "logo")}
                  />
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="mt-3 h-24 rounded border"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Upload CAC Certificate</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, "cac")}
                  />
                  {cacPreview && (
                    <p className="mt-2 text-sm text-green-600">
                      Certificate uploaded
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payout & Wallet Settlement */}
          {activeTab === "payout" && (
            <Card>
              <CardHeader>
                <CardTitle>Payout & Wallet Settlement</CardTitle>
                <CardDescription>
                  Configure how funds received via Nomba are settled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Virtual Account Settlement</Label>
                  <RadioGroup
                    value={settlementType}
                    onValueChange={(v) =>
                      setValue("settlement_type", v as "collection" | "wallet")
                    }
                  >
                    <div className="flex items-center space-x-2 mt-3">
                      <RadioGroupItem value="collection" id="collection" />
                      <Label
                        htmlFor="collection"
                        className="font-normal cursor-pointer"
                      >
                        Collection Settlement (0.65% fee) – Auto-sweep to wallet
                        daily at 9PM
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label
                        htmlFor="wallet"
                        className="font-normal cursor-pointer"
                      >
                        Direct Wallet Settlement (1% fee) – Instant, max daily
                        withdrawal ₦250,000
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label>Payout Account (Commercial Bank)</Label>
                  <Card className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {watch("sweep_account_name") || "Not set"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {watch("sweep_account_number")
                            ? `${watch("sweep_account_number")} • ${watch(
                                "sweep_bank_name"
                              )}`
                            : "No account configured"}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setPayoutModalOpen(true)}
                      >
                        {watch("sweep_account_name") ? "Change" : "Set Account"}
                      </Button>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fees & Charges */}
          {activeTab === "fees" && (
            <Card>
              <CardHeader>
                <CardTitle>Fees & Charges</CardTitle>
                <CardDescription>
                  Set fees that apply to members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Registration Fee (₦)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("registration_fee")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Account Maintenance Fee (₦)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register("maintenance_fee")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Maintenance Frequency</Label>
                    <Select
                      value={watch("maintenance_frequency")}
                      onValueChange={(v) =>
                        setValue(
                          "maintenance_frequency",
                          v as "weekly" | "monthly"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={watch("auto_deduct_fees")}
                      onCheckedChange={(checked) =>
                        setValue("auto_deduct_fees", checked)
                      }
                    />
                    <Label className="font-normal">
                      Auto-deduct fees from member savings
                    </Label>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <Label>Who pays for SMS & Email alerts?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        SMS Charges
                      </Label>
                      <RadioGroup
                        value={watch("sms_charge_bearer")}
                        onValueChange={(v) =>
                          setValue(
                            "sms_charge_bearer",
                            v as "cooperative" | "member"
                          )
                        }
                      >
                        <div className="flex items-center space-x-2 mt-2">
                          <RadioGroupItem value="cooperative" />
                          <Label className="font-normal">
                            Cooperative pays
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <RadioGroupItem value="member" />
                          <Label className="font-normal">Debit member</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Email Charges
                      </Label>
                      <RadioGroup
                        value={watch("email_charge_bearer")}
                        onValueChange={(v) =>
                          setValue(
                            "email_charge_bearer",
                            v as "cooperative" | "member"
                          )
                        }
                      >
                        <div className="flex items-center space-x-2 mt-2">
                          <RadioGroupItem value="cooperative" />
                          <Label className="font-normal">
                            Cooperative pays
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <RadioGroupItem value="member" />
                          <Label className="font-normal">Debit member</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <Label>Who pays deposit processing fee?</Label>
                  <RadioGroup
                    value={watch("deposit_charge_bearer")}
                    onValueChange={(v) =>
                      setValue(
                        "deposit_charge_bearer",
                        v as "cooperative" | "member"
                      )
                    }
                  >
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem value="cooperative" />
                      <Label className="font-normal">
                        Cooperative absorbs fee
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <RadioGroupItem value="member" />
                      <Label className="font-normal">
                        Debit member (deducted from deposit)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose which events trigger SMS and Email alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      key: "memberRegistration",
                      label: "New Member Registration",
                    },
                    { key: "savingsDeposit", label: "Savings Deposit" },
                    { key: "savingsWithdrawal", label: "Savings Withdrawal" },
                    { key: "loanApproval", label: "Loan Approval" },
                    { key: "loanDisbursement", label: "Loan Disbursement" },
                    {
                      key: "loanRepayment",
                      label: "Loan Repayment Due/Received",
                    },
                    { key: "feeDeduction", label: "Fee Deduction" },
                  ].map(({ key, label }) => {
                    const smsPath =
                      `notification_preferences.${key}.sms` as const;
                    const emailPath =
                      `notification_preferences.${key}.email` as const;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between py-4 border-b last:border-0"
                      >
                        <Label className="font-medium">{label}</Label>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={watch(smsPath as any)}
                              onCheckedChange={(checked) =>
                                setValue(smsPath as any, checked)
                              }
                            />
                            <span className="text-sm">SMS</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={watch(emailPath as any)}
                              onCheckedChange={(checked) =>
                                setValue(emailPath as any, checked)
                              }
                            />
                            <span className="text-sm">Email</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "mfa" && (
            <Card>
              <CardHeader>
                <CardTitle>Multi-Factor Authentication (MFA)</CardTitle>
                <CardDescription>
                  Add an extra security layer for withdrawals only
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">MFA Status</p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser?.mfa_enabled
                        ? "Enabled – Required for all withdrawals"
                        : "Disabled – Not required for withdrawals"}
                    </p>
                  </div>
                  <Badge
                    variant={currentUser?.mfa_enabled ? "default" : "secondary"}
                  >
                    {currentUser?.mfa_enabled ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {!currentUser?.mfa_enabled ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        MFA adds strong protection to withdrawals. Once enabled,
                        you'll need to enter a code from your authenticator app
                        every time you withdraw funds.
                      </AlertDescription>
                    </Alert>

                    <Button onClick={handleEnableMFA} disabled={isSettingUp}>
                      {isSettingUp ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        "Enable MFA for Withdrawals"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert className="border-green-600 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        MFA is active. You will be prompted for a verification
                        code during withdrawals.
                      </AlertDescription>
                    </Alert>

                    <Button variant="destructive" onClick={handleDisableMFA}>
                      Disable MFA
                    </Button>
                  </div>
                )}

                {/* QR Code Modal */}
                <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Scan QR Code</DialogTitle>
                      <DialogDescription>
                        Open Google Authenticator or Authy and scan this QR code
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center space-y-6 py-4">
                      {qrCodeUrl && (
                        <QRCodeSVG value={qrCodeUrl} size={256} level="H" />
                      )}

                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Can't scan? Enter this code manually:
                        </p>
                        <code className="block bg-gray-100 px-4 py-2 rounded font-mono text-sm">
                          {manualSecret || "Loading..."}
                        </code>
                      </div>

                      <form
                        onSubmit={handleVerifyCode}
                        className="w-full space-y-4"
                      >
                        <Input
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) =>
                            setVerificationCode(
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                        />
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={verifying}
                        >
                          {verifying ? "Verifying..." : "Verify & Enable"}
                        </Button>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        </form>

        <PayoutAccountModal
          open={payoutModalOpen}
          onOpenChange={setPayoutModalOpen}
          onSave={(data) => {
            setValue("sweep_account_name", data.account_name);
            setValue("sweep_account_number", data.account_number);
            setValue("sweep_bank_name", data.bank_name);
            setValue("sweep_bank_code", data.bank_code || "");
            toast.success("Payout Account Updated");
          }}
        />
      </main>
    </div>
  );
}
