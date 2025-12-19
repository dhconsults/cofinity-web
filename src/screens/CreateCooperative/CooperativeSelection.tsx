'use client';

import React, { useState } from "react";
import {
  Building2,
  PlusCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Tenant } from "@/types/tenant.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { saveData } from "@/lib/storageHelper";

export default function CooperativeSelection() {
  const [selected, setSelected] = useState<"existing" | "new" | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const navigate = useNavigate();
  const { tenants, user } = useAuth();

  const getStatusStyle = (status: string) => {
    const lower = status?.toLowerCase() || "";
    if (lower === "active") {
      return { badge: "Active", variant: "default" as const, bg: "bg-green-100", text: "text-green-700" };
    }
    if (lower === "suspended") {
      return { badge: "Suspended", variant: "destructive" as const, bg: "bg-red-100", text: "text-red-700" };
    }
    if (lower === "grace_period") {
      return { badge: "Grace Period", variant: "secondary" as const, bg: "bg-orange-100", text: "text-orange-700" };
    }
    if (lower === "pending_payment") {
      return { badge: "Plan Required", variant: "secondary" as const, bg: "bg-amber-100", text: "text-amber-700" };
    }
    return { badge: "Inactive", variant: "secondary" as const, bg: "bg-gray-100", text: "text-gray-700" };
  };

  const handleContinue = () => {
    if (selected === "existing" && selectedTenant) {
      const status = selectedTenant.status?.toLowerCase();

      // Suspended → only allow billing
      if (status === "suspended") {
        toast.error("This cooperative is suspended.", {
          description: "You can only access billing to renew your subscription.",
        });
        saveData("selected_cooperative_id", selectedTenant.id);
        navigate("/billing");
        return;
      }

      // Grace period → allow full access (warning shown in dashboard)
      if (status === "grace_period") {
        toast.warning("Your subscription is in grace period.", {
          description: "Renew soon to avoid suspension.",
        });
      }

      // Pending payment → force plan selection
      if (status === "pending_payment") {
        toast.info("Plan selection required");
        navigate("/choose-plan", { state: { tenant: selectedTenant } });
        return;
      }

      // Active → normal flow
      saveData("selected_cooperative_id", selectedTenant.id);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else if (selected === "new") {
      navigate("/create-cooperative");
    } else {
      toast.error("Please select a cooperative or create a new one.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gray-900 rounded-full p-3">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Select Your Cooperative
          </h1>
          <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">
            Choose an existing cooperative or create a new one to manage.
          </p>
        </div>

        {/* Cooperatives List */}
        <div className="space-y-6 mb-8">
          {tenants && tenants.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">
                Your Cooperatives ({tenants.length})
              </p>

              {tenants.map((tenant) => {
                const statusStyle = getStatusStyle(tenant.status || "");
                const isSelected =
                  selected === "existing" && selectedTenant?.id === tenant.id;

                return (
                  <div
                    key={tenant.id}
                    onClick={() => {
                      setSelected("existing");
                      setSelectedTenant(tenant);
                    }}
                    className={`group cursor-pointer transition-all duration-300 rounded-xl ${
                      isSelected ? "ring-2 ring-gray-900" : ""
                    }`}
                  >
                    <div
                      className={`border-2 rounded-xl p-6 transition-all ${
                        isSelected
                          ? "border-gray-900 bg-gray-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
                              isSelected
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 group-hover:bg-gray-900 group-hover:text-white"
                            }`}
                          >
                            <Building2 className="w-6 h-6" />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {tenant.name}
                            </h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p>
                                ID: <span className="font-mono">{tenant.coop_initials}-{tenant.id}</span>
                              </p>
                              <p>Email: {tenant.email}</p>
                            </div>

                            {/* Special warnings */}
                            {tenant.status?.toLowerCase() === "suspended" && (
                              <Alert variant="destructive" className="mt-4">
                                <ShieldAlert className="h-4 w-4" />
                                <AlertDescription>
                                  This cooperative is suspended. Access limited to billing only.
                                </AlertDescription>
                              </Alert>
                            )}

                            {tenant.status?.toLowerCase() === "grace_period" && (
                              <Alert className="mt-4 border-orange-400 bg-orange-50">
                                <Clock className="h-4 w-4" />
                                <AlertDescription>
                                  Your subscription is in grace period. Renew soon to avoid suspension.
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <Badge variant={statusStyle.variant}>
                            {statusStyle.badge}
                          </Badge>

                          {isSelected && (
                            <div className="flex items-center gap-2 text-gray-900">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-medium">Selected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Create New */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Or Start Fresh</p>
            <div
              onClick={() => setSelected("new")}
              className={`group cursor-pointer transition-all duration-300 rounded-xl ${
                selected === "new" ? "ring-2 ring-gray-900" : ""
              }`}
            >
              <div
                className={`border-2 rounded-xl p-6 transition-all ${
                  selected === "new"
                    ? "border-gray-900 bg-gray-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg transition-colors ${
                        selected === "new"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-900 group-hover:text-white"
                      }`}
                    >
                      <PlusCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Create New Cooperative
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Set up a brand new organization
                      </p>
                    </div>
                  </div>
                  {selected === "new" && (
                    <div className="flex items-center gap-2 text-gray-900">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="w-full py-6 text-lg font-semibold"
          size="lg"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            Logged in as{" "}
            <span className="font-semibold text-gray-900">{user?.email}</span>
          </p>
          <p className="mt-2">
            Need help?{" "}
            <a
              href="mailto:support@cooperative.com"
              className="font-medium text-gray-900 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}