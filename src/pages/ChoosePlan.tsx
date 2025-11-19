import React, { useMemo, useState } from "react";
import { Check, Calendar, Clock, Infinity } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type BillingCycle = "monthly" | "yearly" | "lifetime";

type Plan = {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  lifetimePrice?: number;
  users: string;
  subAdmins: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    lifetimePrice: 0,
    users: "10 Users",
    subAdmins: "2 Sub-admins",
    features: [
      "Dashboard",
      "Community support",
      "Limited exports",
      "1 Account type",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 5000,
    yearlyPrice: 5000 * 10,
    lifetimePrice: 50000,
    users: "50 Users",
    subAdmins: "10 Sub-admins",
    features: [
      "Dashboard",
      "Priority support",
      "Bulk operations",
      "Export features",
      "2 Account type",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 20000,
    yearlyPrice: 20000 * 10,
    lifetimePrice: 200000,
    users: "Unlimited Users",
    subAdmins: "Unlimited Sub-admins",
    features: [
      "Dashboard",
      "All Pro features",
      "Dedicated account manager",
      "SLA & onboarding",
      "5 Account types",
    ],
  },
];

const currencyFormat = (n: number) =>
  n >= 1000 ? `₦${n.toLocaleString()}` : `₦${n}`;

const ChoosePlan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cooperative = location.state?.cooperative;

  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = useMemo(
    () =>
      PLANS.map((p) => {
        let priceValue =
          billing === "monthly"
            ? p.monthlyPrice
            : billing === "yearly"
            ? p.yearlyPrice ?? p.monthlyPrice * 12
            : p.lifetimePrice ?? p.monthlyPrice * 12 * 5;
        const priceLabel =
          priceValue === 0 ? "Free" : currencyFormat(priceValue);
        return { ...p, priceValue, priceLabel };
      }),
    [billing]
  );

  const handleChoose = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    setSelectedPlan(planId);

    if (!plan) return;

    if (plan.priceValue === 0) {
      alert(`You're on the ${plan.name} plan (Free).`);
    } else {
      alert(`Selected ${plan.name} (${billing}) — ${plan.priceLabel}.`);
    }

    navigate("/dashboard", { state: { cooperative, plan } });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
      <div className="max-w-6xl w-full mt-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Choose Your Plan
        </h1>
        {cooperative && (
          <p className="text-sm text-gray-700 text-center mt-2 mb-4">
            Cooperative: <span className="font-medium">{cooperative.name}</span>
          </p>
        )}
        <p className="text-sm text-gray-600 text-center mt-2 mb-8 max-w-xl mx-auto">
          Select a plan for your cooperative. Switch billing cycle to see
          monthly, yearly, or lifetime pricing.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-3 py-2 text-sm rounded-full transition ${
                billing === "monthly"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-white"
              }`}
            >
              <Calendar className="inline mr-2" size={14} /> Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className={`px-3 py-2 text-sm rounded-full transition ${
                billing === "yearly"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-white"
              }`}
            >
              <Clock className="inline mr-2" size={14} /> Yearly
            </button>

            <button
              onClick={() => setBilling("lifetime")}
              className={`px-3 py-2 text-sm rounded-full transition ${
                billing === "lifetime"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-white"
              }`}
            >
              <Infinity className="inline mr-2" size={14} /> Lifetime
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col justify-between bg-white rounded-xl p-6 relative h-full min-h-[400px] border ${
                p.highlighted ? "border-blue-500 shadow-lg" : "border-gray-300"
              }`}
            >
              {/* Badge */}
              {p.badge && (
                <div className="absolute -top-3 left-4 bg-indigo-600 text-white px-3 py-1 text-xs rounded-full font-medium">
                  {p.badge}
                </div>
              )}

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{p.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{p.users}</p>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div className="text-2xl font-extrabold text-gray-900">
                      {p.priceLabel}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {billing === "monthly"
                        ? "/ month"
                        : billing === "yearly"
                        ? "/ year"
                        : "/ one-time"}
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    {p.subAdmins}
                  </div>

                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {p.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-1" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleChoose(p.id)}
                    className={`w-full py-2 rounded-md text-white font-medium transition cursor-pointer ${
                      p.priceValue === 0
                        ? "bg-gray-700 hover:bg-gray-900"
                        : p.highlighted
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-black hover:bg-gray-900"
                    }`}
                  >
                    {p.priceValue === 0 ? "Choose Plan" : "Choose Plan"}
                  </button>

                  <div className="mt-2 text-xs text-gray-500 text-center">
                    <span className="font-medium">Billing:</span>{" "}
                    {billing === "monthly"
                      ? "Billed monthly"
                      : billing === "yearly"
                      ? "Billed yearly (discount applied)"
                      : "One-time payment"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChoosePlan;
