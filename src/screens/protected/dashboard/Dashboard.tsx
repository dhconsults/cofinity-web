'use client';

import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  HandCoins,
  PiggyBank,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  BadgeCheck,
  Plus,
  FileText,
  Loader2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

import apiClient from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  stats: {
    total_members: number;
    members_growth: number;
    active_loans: number;
    loans_growth: number;
    total_savings: number;
    savings_growth: number;
    pending_kyc: number;
    kyc_change: number;
  };
  recent_activities: Array<{
    name: string;
    action: string;
    amount: number | null;
    date: string;
    status: string;
  }>;
  monthly_trend: Array<{
    month: string;
    savings: number;
    loans: number;
  }>;
  repayment_rate: number;
  subscription: {
    plan: string;
    price_monthly: number;
    formatted_price: string;
    status: 'active' | 'grace_period' | 'suspended' | 'trial';
    expired: boolean;
    in_grace_period: boolean;
    on_trial: boolean;
    ends_at?: string;
    grace_ends_at?: string;
    trial_ends_at?: string;
    days_until_expiry: number;
    days_overdue: number;
    days_in_grace: number;

    members: {
      used: number;
      limit: number | 'Unlimited';
      remaining: number | '∞';
      is_unlimited: boolean;
      can_add_more: boolean;
    };
    admins: {
      used: number;
      limit: number | 'Unlimited';
      remaining: number | '∞';
      can_add_more: boolean;
    };
    active_loans: {
      active_loans: number;
      max_active_loans: number | 'Unlimited';
      can_create_loan: boolean;
    };
  };
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard-summary'],
    queryFn: () => apiClient.get('/api/dashboard/summary').then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load dashboard data. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const stats = data?.stats || {};
  const activities = data?.recent_activities || [];
  const trend = data?.monthly_trend || [];
  const repaymentRate = data?.repayment_rate || 0;
  const sub = data?.subscription || {} as DashboardData['subscription'];

  const navigate = useNavigate();

  // Helper for usage progress bars
  const UsageProgress = ({
    label,
    used,
    limit,
    canAdd,
    isUnlimited = false,
  }: {
    label: string;
    used: number;
    limit: number | 'Unlimited';
    canAdd: boolean;
    isUnlimited?: boolean;
  }) => {
    const percentage = isUnlimited ? 0 : (used / Number(limit)) * 100;

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span className="font-medium">
            {used} / {isUnlimited ? '∞' : limit}
          </span>
        </div>
        {!isUnlimited && <Progress value={percentage} className="h-2" />}
        <p className="text-xs text-muted-foreground">
          {isUnlimited ? 'Unlimited' : canAdd ? `${Number(limit) - used} remaining` : 'Limit reached'}
        </p>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-medium">{user?.full_name || 'Cooperative Admin'}</span>
        </p>
      </div>

      {/* Subscription Alerts */}
      {sub.status === 'suspended' && (
        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Account Suspended</AlertTitle>
          <AlertDescription>
            Your subscription has expired and the grace period has ended. Access is restricted.
            <Button variant="outline" size="sm" className="ml-4">
              Renew Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {sub.in_grace_period && (
        <Alert variant="destructive" className="border-orange-500 bg-orange-50">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <AlertTitle>Grace Period Active – {sub.days_in_grace} day{sub.days_in_grace !== 1 ? 's' : ''} left</AlertTitle>
          <AlertDescription>
            Your subscription expired on {sub.ends_at}. You have until {sub.grace_ends_at} to renew before full suspension.
            <Button variant="outline" size="sm" className="ml-4" onClick={() => navigate('/billing')}>
              Renew Subscription
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {sub.days_until_expiry > 0 && sub.days_until_expiry <= 7 && sub.status === 'active' && (
        <Alert>
          <Clock className="h-5 w-5" />
          <AlertTitle>Subscription Renews Soon</AlertTitle>
          <AlertDescription>
            Your plan renews in {sub.days_until_expiry} day{sub.days_until_expiry !== 1 ? 's' : ''} ({sub.ends_at}).
          </AlertDescription>
        </Alert>
      )}

      {sub.on_trial && (
        <Alert variant="default">
          <Clock className="h-5 w-5" />
          <AlertTitle>On Trial</AlertTitle>
          <AlertDescription>
            Your trial ends on {sub.trial_ends_at}. Upgrade to continue using all features.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Members', value: stats.total_members?.toLocaleString(), growth: stats.members_growth, icon: Users },
          { title: 'Active Loans', value: stats.active_loans, growth: stats.loans_growth, icon: HandCoins },
          { title: 'Total Savings', value: formatCurrency(stats.total_savings), growth: stats.savings_growth, icon: PiggyBank },
          { title: 'Pending KYC', value: stats.pending_kyc, growth: stats.kyc_change, icon: AlertCircle },
        ].map((item, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{isLoading ? <Skeleton className="h-4 w-32" /> : item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{item.value ?? 0}</div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {item.growth > 0 ? <TrendingUp className="h-3 w-3 text-green-600 mr-1" /> : <TrendingDown className="h-3 w-3 text-red-600 mr-1" />}
                    {item.growth > 0 ? '+' : ''}{Math.abs(item.growth)}% This Month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest member transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No recent activities
                      </TableCell>
                    </TableRow>
                  ) : (
                    activities.map((activity, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{activity.name}</TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.amount ? formatCurrency(activity.amount) : '—'}</TableCell>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="default">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Subscription Usage */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" /> Add Member
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <BadgeCheck className="mr-2 h-4 w-4" /> Disburse Loan
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" /> Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : (
                <>
                  <UsageProgress
                    label="Members"
                    used={sub.members.used}
                    limit={sub.members.limit}
                    canAdd={sub.members.can_add_more}
                    isUnlimited={sub.members.is_unlimited}
                  />

                  <UsageProgress
                    label="Admins"
                    used={sub.admins.used}
                    limit={sub.admins.limit}
                    canAdd={sub.admins.can_add_more}
                    isUnlimited={sub.admins.is_unlimited}
                  />

                  <UsageProgress
                    label="Active Loans"
                    used={sub.active_loans.active_loans}
                    limit={sub.active_loans.max_active_loans}
                    canAdd={sub.active_loans.can_create_loan}
                    isUnlimited={sub.active_loans.max_active_loans === 'Unlimited'}
                  />

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium">{sub.plan}</p>
                        <p className="text-sm text-muted-foreground">{sub.formatted_price}/month</p>
                      </div>
                      <Button size="sm">Upgrade Plan</Button>
                    </div>
                    {sub.ends_at && (
                      <p className="text-xs text-muted-foreground">Renews on {sub.ends_at}</p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Savings & Loan Trend</CardTitle>
            <CardDescription>Last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} name="Savings" />
                  <Line type="monotone" dataKey="loans" stroke="#3b82f6" strokeWidth={2} name="Loans" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Repayment Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-72">
            {isLoading ? (
              <Loader2 className="h-16 w-16 animate-spin" />
            ) : (
              <>
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#10b981"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80}`}
                      strokeDashoffset={`${2 * Math.PI * 80 * (1 - repaymentRate / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-green-600">{repaymentRate}%</span>
                  </div>
                </div>
                <p className="mt-6 text-lg font-medium">
                  {repaymentRate >= 90 ? 'Excellent' : repaymentRate >= 70 ? 'Good' : 'Needs Attention'} repayment performance
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}