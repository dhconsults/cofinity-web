import React, { useState } from "react";
import { Building2, PlusCircle, CheckCircle2, ArrowRight, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Tenant } from "@/types/tenant.types";
import { Button } from "@/components/ui/button";


export default function CooperativeSelection() {
  const [selected, setSelected] = useState<"existing" | "new" | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant>();

  const navigate = useNavigate();


  // Mock data - replace with actual data from useAuth
 const {tenants, user} = useAuth(); 
  

  const getStatusStyle = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "active") {
      return { badge: "Active", bgColor: "bg-green-100", textColor: "text-green-700", borderColor: "border-green-200" };
    } else if (statusLower === "suspended") {
      return { badge: "Suspended", bgColor: "bg-red-100", textColor: "text-red-700", borderColor: "border-red-200" };
    } else if (statusLower === "pending") {
      return { badge: "Pending", bgColor: "bg-amber-100", textColor: "text-amber-700", borderColor: "border-amber-200" };
    } else {
      return { badge: "Inactive", bgColor: "bg-gray-100", textColor: "text-gray-700", borderColor: "border-gray-200" };
    }
  };

  const handleContinue = () => {
    if (selected === "existing" && selectedTenant) {
      if (selectedTenant.status?.toLowerCase() === "suspended") {
        toast.error("Cooperative is Suspended. Please contact support.");
        return;
      }
      if (selectedTenant.plan_id == null) {
        toast.error("Plan selection required", {description: 'You are require to pick a plan'});


        navigate("/choose-plan", {state: {tenant: selectedTenant}});

        return;
      }



      toast.success("Navigating to dashboard...");
      navigate('/dashboard') 

    } else if (selected === "new") {

        navigate("/create-cooperative"); // redirect to create cooperative

      
    } else {
      toast.error("Please select an option");
    }
  };

  return (
    // <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">

      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gray-900 rounded-full p-2">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Select Your Cooperative
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Choose an existing cooperative to manage, or create a new one.
          </p>
        </div>

        {/* Selection Container */}
        <div className="space-y-4 mb-6">
          {/* Existing Cooperatives Section */}
          {tenants && tenants.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700 px-1">
                Your Cooperatives ({tenants.length})
              </p>
              {tenants.map((tenant) => {
                const statusStyle = getStatusStyle(tenant.status);
                const isSelected = selected === "existing" && selectedTenant?.id === tenant.id;

                return (
                  <div
                    key={tenant.id}
                    onClick={() => {
                      setSelected("existing");
                      setSelectedTenant(tenant);
                    }}
                    className={`group cursor-pointer transition-all duration-300 transform ${
                      isSelected ? "scale-105" : "hover:scale-[1.02]"
                    }`}
                  >
                    <div
                      className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                        isSelected
                          ? "border-gray-900 bg-gray-50 shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex items-start gap-4 flex-1">
                          {/* Icon */}
                          <div
                            className={`flex-shrink-0 p-3 rounded-lg transition-colors ${
                              isSelected
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 group-hover:bg-gray-900 group-hover:text-white"
                            }`}
                          >
                            <Building2 className="w-6 h-6" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {tenant.name}
                            </h3>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-500">
                                ID:{" "}
                                <span className="font-mono text-gray-700">
                                  {tenant.coop_initials}-{tenant.id}
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Email:{" "}
                                <span className="text-gray-700">
                                  {tenant.email}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col items-end gap-3">
                          {/* Status Badge */}
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusStyle.bgColor} ${statusStyle.textColor} ${statusStyle.borderColor}`}
                          >
                            {statusStyle.badge}
                          </div>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="flex items-center gap-2 text-gray-900">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-medium">Selected</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Plan Status Warning */}
                      {tenant.status == 'pending_payment' && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-md flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>Plan selection required</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Create New Cooperative Section */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700 px-1">Or Start Fresh</p>
            <div
              onClick={() => setSelected("new")}
              className={`group cursor-pointer transition-all duration-300 transform ${
                selected === "new" ? "scale-105" : "hover:scale-[1.02]"
              }`}
            >
              <div
                className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                  selected === "new"
                    ? "border-gray-900 bg-gray-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex items-start gap-3 flex-1">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                        selected === "new"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-900 group-hover:text-white"
                      }`}
                    >
                      <PlusCircle className="w-5 h-5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Create New Cooperative
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Set up a new organization and manage it from your dashboard.
                      </p>
                    </div>
                  </div>

                  {/* Right Section */}
                  {selected === "new" && (
                    <div className="flex items-center gap-2 text-gray-900 flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-medium">Selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
          <Button     onClick={handleContinue} className="w-full py-5 text-sm font-bold rounded-lg " >
              Continue
          <ArrowRight className="w-4 h-4" />


            </Button>
  

        {/* Footer Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-600">
            Logged in as{" "}
            <span className="font-semibold text-gray-900"> {user?.email} </span>
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            Need help?{" "}
            <a href="mailto:support@cooperative.com" className="text-gray-900 font-medium hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}