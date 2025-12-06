import { useState, useMemo, useEffect } from "react";
import { Check, Calendar, Clock, Mail, Zap } from "lucide-react";
import type { Tenant } from "@/types/tenant.types";
import { getData, saveData } from "@/lib/storageHelper";
import { useLocation, useNavigate } from "react-router-dom";
import { type BillingCycle, type Plan } from "@/types/plan.types";
import { apiClient } from "@/lib/api-client";
import { APIS } from "@/constants";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";



const formatPrice = (n: number) =>
    n === 0 ? "Free" : `₦${n.toLocaleString()}`;

export default function ChoosePlan() {
    const [billing, setBilling] = useState<BillingCycle>("yearly");

    const location = useLocation();
    const navigate = useNavigate();
    const [tenant, setTenant] = useState<Tenant | null>(null);

    







    const [plansData, setPlansData] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPlanHandleLoading, setIsPlanHandleLoading] = useState(false);


    





    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(APIS.GET_PLANS);

                const transformedPlans: Plan[] = response.data.map((p: any) => {
                    const features: string[] = [];

                    // Auto-convert any feature object → readable strings
                    if (p.features && typeof p.features === "object") {
                        Object.entries(p.features).forEach(([key, value]) => {
                            // Convert snake_case → Title Case
                            const label = key
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ');

                            if (value === true) {
                                features.push(label);
                            } else if (typeof value === "number" && value > 0) {
                                const formatted = value === -1 ? "Unlimited" : value.toLocaleString();
                                features.push(`${label}: ${formatted}`);
                            }
                        });
                    }

                    return {
                        id: p.id,
                        name: p.name,
                        description: p.description || "Perfect for growing cooperatives",
                        slug: p.slug,
                        price_monthly: p.price_monthly || "0",
                        price_quarterly: p.price_quarterly || "0",
                        price_yearly: p.price_yearly || "0",
                        highlighted: ["pro", "business"].includes(p.slug),
                        badge: p.slug === "pro" ? "Most Popular" : p.slug === "business" ? "Best Value" : undefined,
                        custom: p.slug === "enterprise" || p.slug === "custom",
                        features, // Fully dynamic
                    } as Plan;
                });

                setPlansData(transformedPlans);
            } catch (err: any) {
                setError("Failed to load pricing plans.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);


    useEffect(() => {
        // prefer navigation state
        const navTenant = (location.state as any)?.tenant as Tenant | undefined;
        if (navTenant) {
            setTenant(navTenant);
            return;
        }

        // fallback to persisted tenant
        const stored = getData<Tenant>("selected_tenant");
        if (stored) {
            setTenant(stored);
            return;
        }

        // no tenant -> redirect to selection
        navigate("/cooperative-selection", { replace: true });
    }, [location.state, navigate]);





    const plans = useMemo(() => {
        return plansData.map((plan) => {
            const raw = plan[`price_${billing}`];     // price_monthly, etc.
            const price = Number(raw) || 0;

            return {
                ...plan,
                price,
                displayPrice: plan.custom ? "Let's Talk" : formatPrice(price),
                period:
                    billing === "monthly"
                        ? "/month"
                        : billing === "quarterly"
                            ? "/3 months"
                            : "/year",
            };
        });
    }, [billing, plansData]);

    if (!tenant) return null;


  const handleSelect = async (planId: string) => {
  const plan = plans.find((p) => p.id === Number(planId));
  if (!plan) return;

  setIsPlanHandleLoading(true);

  try {
    // Show optimistic feedback
    toast.loading(`Preparing ${plan.name} plan...`, { id: "plan-toast" });

    const response = await apiClient.post(APIS.SUBSCRIPTION_INITIATE, {
      plan_id: plan.id,
      billing_cycle: billing,  
      tenant_id: tenant.id, 
    });

    toast.dismiss("plan-toast");

    if (!response.success) {
      throw new Error(response.message || "Something went wrong");
    }

    // FREE PLAN → go straight to dashboard
    if (response.data.redirect) {
      toast.success("Free plan activated! Welcome aboard 🎉");
      saveData('selected_cooperative_id', tenant.id); 
      navigate(response.data.redirect);
      return;
    }

    // CUSTOM PLAN → show contact message
    if (response.data.action === "contact_sales") {
      toast.success("We’ll contact you within 24 hours!", {
        description: "Our team will reach out to discuss your needs.",
      });
      return;
    }

    // PAID PLAN → redirect to Nomba checkout
    if (response.data.payment_url) {
      toast.success(`Redirecting to secure payment...`, {
        description: `₦${plan.price.toLocaleString()} • ${billing}`,
      });

      // Optional: save state before redirect
      localStorage.setItem("pending_plan", JSON.stringify({
        planId: plan.id,
        billingCycle: billing,
        reference: response.data.reference,
      }));

      // Redirect to Nomba
      window.location.href = response.data.payment_url;
      return;
    }

  } catch (error: any) {
    console.error("Subscription error:", error);

    toast.dismiss("plan-toast");
    toast.error("Failed to process plan", {
      description: error.message || "Please try again later",
    });
  } finally {
    setIsPlanHandleLoading(false);
  }
};

    if (loading)
        return (
            <div className="p-6 text-center text-gray-600">Loading plans...</div>
        );

    // ❌ ERROR STATE  
    if (error)
        return (
            <div className="p-6 text-center text-red-600">
                {error}
            </div>
        );



    return (
        <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center mb-4">
                    <div className="bg-gray-900 rounded-full p-2">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                    Choose Your Plan
                </h1>
                {tenant && (
                    <p className="text-sm text-gray-700 mb-2">
                        For <span className="font-semibold text-gray-900">{tenant.name}</span>
                    </p>
                )}
                <p className="text-xs text-gray-500">
                    14-day free trial • No card required • Cancel anytime
                </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-10">
                <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200">
                    {(["monthly", "quarterly", "yearly"] as BillingCycle[]).map((cycle) => (
                        <button
                            key={cycle}
                            onClick={() => setBilling(cycle)}
                            className={`relative px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${billing === cycle
                                    ? "bg-gray-900 text-white shadow-md"
                                    : "text-gray-700 hover:text-gray-900 hover:bg-white"
                                }`}
                        >
                            {cycle === "monthly" && <Calendar className="w-4 h-4" />}
                            {cycle === "quarterly" && <Clock className="w-4 h-4" />}
                            {cycle === "yearly" && <Calendar className="w-4 h-4" />}

                            {cycle === "monthly"
                                ? "Monthly"
                                : cycle === "quarterly"
                                    ? "Quarterly"
                                    : "Yearly"}

                            {cycle === "quarterly" && billing === "quarterly" && (
                                <span className="ml-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                    Save 10%
                                </span>
                            )}
                            {cycle === "yearly" && billing === "yearly" && (
                                <span className="ml-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                    Save 20%
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plans Grid */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-xl border-2 transition-all duration-300 overflow-hidden ${plan.highlighted
                                    ? "border-gray-900 bg-gray-50 shadow-lg md:scale-105"
                                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                                }`}
                        >
                            {/* Badge */}
                            {plan.badge && (
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                                    <div className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                                        {plan.badge}
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className={`p-5 ${plan.badge ? "pt-7" : ""}`}>
                                {/* Plan Name & Description */}
                                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                                <p className="text-xs text-gray-600 mt-1">
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div className="mt-5 mb-5">
                                    <div className="text-3xl font-black text-gray-900">
                                        {plan.displayPrice}
                                    </div>
                                    {!plan.custom && plan.price > 0 && (
                                        <div className="text-xs text-gray-500 mt-1">{plan.period}</div>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="space-y-2 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}

                <Button
  onClick={() => handleSelect(String(plan.id))}
  disabled={isPlanHandleLoading}
  className={`w-full py-5 text-sm font-bold rounded-lg  ${plan.custom
                                            && "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                             
                                        }`}
                                >  
  {isPlanHandleLoading ? (
    <>Processing...</>
  ) : plan.custom ? (
    <>Contact Sales</>
  ) : plan.price === 0 ? (
    "Start Free"
  ) : (
    "Choose Plan"
  )}
</Button>

 
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Help */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-600">
                        Need help choosing?{" "}
                        <a
                            href="mailto:support@cooperative.com"
                            className="font-semibold text-gray-900 hover:underline"
                        >
                            Contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

