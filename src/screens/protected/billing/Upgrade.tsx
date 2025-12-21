'use client';

import { useState, useMemo, useEffect } from 'react';
import { Check, Calendar, Clock, Zap, AlertCircle, ArrowLeft } from 'lucide-react';
 
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import apiClient from '@/lib/api-client';
import { APIS } from '@/constants';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


// Types
type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_monthly: string;
  price_quarterly: string;
  price_yearly: string;
  highlighted: boolean;
  badge?: string;
  custom: boolean;
  features: string[];
}

interface Usage {
  members: { used: number; limit: number | 'Unlimited' };
  admins: { used: number; limit: number | 'Unlimited' };
  active_loans: { used: number; limit: number | 'Unlimited' };
}

const formatPrice = (n: number) => (n === 0 ? 'Free' : `₦${n.toLocaleString()}`);

export default function UpgradePlanPage() {
  const router = useNavigate();
  const [billing, setBilling] = useState<BillingCycle>('yearly');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Fetch plans + current subscription + usage
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [plansRes, summaryRes] = await Promise.all([
          apiClient.get(APIS.GET_PLANS),
          apiClient.get('/api/dashboard/summary'),
        ]);

        const transformedPlans: Plan[] = plansRes.data.map((p: any) => {
          const features: string[] = [];
          if (p.features && typeof p.features === 'object') {
            Object.entries(p.features).forEach(([key, value]) => {
              const label = key
                .split('_')
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
              if (value === true) features.push(label);
              else if (typeof value === 'number' && value > 0) {
                const formatted = value === -1 ? 'Unlimited' : value.toLocaleString();
                features.push(`${label}: ${formatted}`);
              }
            });
          }

          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description || 'Perfect for growing cooperatives',
            price_monthly: p.price_monthly || '0',
            price_quarterly: p.price_quarterly || '0',
            price_yearly: p.price_yearly || '0',
            highlighted: ['pro', 'business'].includes(p.slug),
            badge: p.slug === 'pro' ? 'Most Popular' : p.slug === 'business' ? 'Best Value' : undefined,
            custom: p.slug === 'enterprise' || p.slug === 'custom',
            features,
          };
        });

        setPlans(transformedPlans);

        // Extract current plan & usage from dashboard summary
        const sub = summaryRes.data.subscription;
        setCurrentPlanId(sub.plan_id || null); // assume plan_id is returned, or map by slug/name

        setUsage({
          members: sub.members,
          admins: sub.admins,
          active_loans: sub.active_loans,
        });
      } catch (err) {
        toast.error('Failed to load plans or subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pricedPlans = useMemo(() => {
    return plans.map((plan) => {
      const raw = plan[`price_${billing}`];
      const price = Number(raw) || 0;

      return {
        ...plan,
        price,
        displayPrice: plan.custom ? "Let's Talk" : formatPrice(price),
        period:
          billing === 'monthly'
            ? '/month'
            : billing === 'quarterly'
            ? '/3 months'
            : '/year',
      };
    });
  }, [plans, billing]);

  // Downgrade protection logic
  const canSelectPlan = (plan: typeof pricedPlans[0]) => {
    if (plan.custom) return true;

    const memberLimit = plan.features.find((f) => f.includes('Members')) || '';
    const adminLimit = plan.features.find((f) => f.includes('Admins')) || '';
    const loanLimit = plan.features.find((f) => f.includes('Active Loans')) || '';

    const getLimit = (str: string) => {
      const match = str.match(/(\d+|Unlimited)/);
      return match ? (match[1] === 'Unlimited' ? Infinity : Number(match[1])) : Infinity;
    };

    if (!usage) return true;

    return (
      usage.members.used <= getLimit(memberLimit) &&
      usage.admins.used <= getLimit(adminLimit) &&
      usage.active_loans.used <= getLimit(loanLimit)
    );
  };

  const handleSelect = async (planId: number) => {
    const plan = pricedPlans.find((p) => p.id === planId);
    if (!plan) return;

    if (!canSelectPlan(plan)) {
      toast.error('You cannot downgrade – current usage exceeds plan limits');
      return;
    }

    setProcessing(true);
    try {
      toast.loading(`Processing ${plan.name} plan...`, { id: 'plan-toast' });

      const response = await apiClient.post(APIS.SUBSCRIPTION_INITIATE, {
        plan_id: plan.id,
        billing_cycle: billing,
      });

      toast.dismiss('plan-toast');

      if (!response.success) throw new Error(response.message || 'Failed');

      if (response.data.redirect) {
        toast.success('Plan updated successfully!');
        router(response.data.redirect);
        return;
      }

      if (response.data.action === 'contact_sales') {
        toast.success('We’ll contact you soon for your custom plan');
        return;
      }

      if (response.data.payment_url) {
        toast.success('Redirecting to payment...');
        window.location.href = response.data.payment_url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Upgrade or Change Plan</h1>
            <p className="text-muted-foreground mt-2">
              Select a new plan or renew your subscription
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Billing
          </Button>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200">
            {(['monthly', 'quarterly', 'yearly'] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBilling(cycle)}
                className={`relative px-6 py-3 rounded-md font-medium text-sm transition-all flex items-center gap-2 ${
                  billing === cycle
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white'
                }`}
              >
                {cycle === 'monthly' && <Calendar className="w-4 h-4" />}
                {cycle === 'quarterly' && <Clock className="w-4 h-4" />}
                {cycle === 'yearly' && <Calendar className="w-4 h-4" />}

                {cycle.charAt(0).toUpperCase() + cycle.slice(1)}

                {cycle === 'quarterly' && billing === 'quarterly' && (
                  <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Save 10%
                  </span>
                )}
                {cycle === 'yearly' && billing === 'yearly' && (
                  <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricedPlans.map((plan) => {
            const isCurrent = currentPlanId === plan.id;
            const canSelect = canSelectPlan(plan);

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all ${
                  plan.highlighted ? 'ring-2 ring-black shadow-xl' : ''
                } ${isCurrent ? 'ring-2 ring-green-600' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Current Plan
                  </div>
                )}

                <div className="p-6 pt-8">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{plan.description}</p>

                  <div className="mt-6">
                    <div className="text-4xl font-black">{plan.displayPrice}</div>
                    {!plan.custom && plan.price > 0 && (
                      <div className="text-sm text-gray-500 mt-1">{plan.period}</div>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full mt-8"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    disabled={isCurrent || processing || !canSelect}
                    onClick={() => handleSelect(plan.id)}
                  >
                    {processing
                      ? 'Processing...'
                      : isCurrent
                      ? 'Current Plan'
                      : plan.custom
                      ? 'Contact Sales'
                      : plan.price === 0
                      ? 'Switch to Free'
                      : 'Select Plan'}
                  </Button>

                  {!canSelect && !isCurrent && (
                    <Alert variant="destructive" className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Your current usage exceeds this plan's limits
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center text-sm text-gray-600">
          Need help choosing?{' '}
          <a href="mailto:support@cooperative.com" className="font-medium underline">
            Contact support
          </a>
        </div>
      </div>
    </div>
  );
}