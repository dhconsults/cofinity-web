import React, { useMemo, useState } from "react";
import { Check, Calendar, Clock, Infinity } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  current?: string; // Badge text
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
    current: "Current",
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
    current: "Most Popular",
    highlighted: true,
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
      "Custom automations",
      "5 Account types",
    ],
  },
];

const currencyFormat = (n: number) =>
  n >= 1000 ? `₦${n.toLocaleString()}` : `₦${n}`;

const UpgradePlan: React.FC = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = useMemo(
    () =>
      PLANS.map((p) => {
        let priceLabel = "Free";
        let priceValue = 0;
        if (billing === "monthly") {
          priceValue = p.monthlyPrice;
        } else if (billing === "yearly") {
          priceValue = p.yearlyPrice ?? p.monthlyPrice * 12;
        } else {
          priceValue = p.lifetimePrice ?? p.monthlyPrice * 12 * 5;
        }
        priceLabel = priceValue === 0 ? "Free" : currencyFormat(priceValue);
        return { ...p, priceLabel, priceValue };
      }),
    [billing]
  );

  const handleChoose = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    setSelectedPlan(planId);

    if (plan?.priceValue === 0) {
      alert(`You're on the ${plan.name} plan (Free).`);
      navigate("/dashboard");
    } else {
      alert(
        `Selected ${plan?.name} (${billing}) — ${plan?.priceLabel}. (Mock checkout.)`
      );
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">
              Upgrade Your Plan
            </h1>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              Choose a plan that suits your cooperative. Switch billing cycle to
              see monthly, yearly or lifetime pricing. Prices shown in Naira.
            </p>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center gap-3 mt-8 justify-center">
          <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-3 py-2 text-sm rounded-full transition ${
                billing === "monthly"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-white"
              }`}
            >
              <Calendar className="inline mr-2" size={14} />
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className={`px-3 py-2 text-sm rounded-full transition ${
                billing === "yearly"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-white"
              }`}
            >
              <Clock className="inline mr-2" size={14} />
              Yearly
            </button>

            <button
              onClick={() => setBilling("lifetime")}
              className={`px-3 py-2 text-sm rounded-full transition ${
                billing === "lifetime"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-white"
              }`}
            >
              <Infinity className="inline mr-2" size={14} />
              Lifetime
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative bg-white border ${
                p.highlighted
                  ? "border-indigo-300 shadow-lg"
                  : "border-gray-200"
              } rounded-xl p-6 hover:shadow-lg transition flex flex-col`}
            >
              {/* Badge */}
              {p.current && (
                <div
                  className={`absolute -top-3 left-16 -translate-x-1/2 px-3 py-1 text-xs rounded-md text-white ${
                    p.current === "Current" ? "bg-gray-900" : "bg-indigo-600"
                  }`}
                >
                  {p.current}
                </div>
              )}

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {p.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">{p.users}</p>
                    </div>

                    <div className="text-right">
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
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">{p.subAdmins}</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      {p.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check size={14} className="text-green-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => handleChoose(p.id)}
                    className={`w-full py-2 rounded-md text-white font-medium transition ${
                      p.priceValue === 0
                        ? "bg-gray-600 cursor-default"
                        : p.highlighted
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-black hover:bg-gray-900"
                    }`}
                    aria-pressed={selectedPlan === p.id}
                  >
                    {p.priceValue === 0 ? "Current Plan" : "Choose Plan"}
                  </button>

                  <div className="text-xs text-gray-500 text-center mt-1">
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

export default UpgradePlan;
