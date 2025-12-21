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
    status: 'pending' | 'completed' | 'approved';
  }>;
  monthly_trend: Array<{
    month: string;
    savings: number;
    loans: number;
  }>;
  repayment_rate: number;
  subscription: {
    plan: string;
    price: number;
    users_used: number;
    users_limit: number;
    admins_used: number;
    admins_limit: number;
    expired: boolean;
    days_overdue: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    error,
  } = useQuery<DashboardData>({
    queryKey: ['dashboard-summary'],
    queryFn: () => apiClient.get('/api/dashboard/summary').then(res => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const stats = data?.stats || {};
  const activities = data?.recent_activities || [];
  const trend = data?.monthly_trend || [];
  const repaymentRate = data?.repayment_rate || 0;
  const subscription = data?.subscription || {};

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, <span className="font-medium">{user?.full_name || 'Cooperative Admin'}</span>
        </p>
      </div>

      {/* Subscription Alert */}
      {subscription.expired && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Subscription Expired</AlertTitle>
          <AlertDescription>
            Your active subscription expired {subscription.days_overdue} days ago. Please renew to continue using this service.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['Total Members', 'Active Loans', 'Total Savings', 'Pending KYC'].map((title, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isLoading ? <Skeleton className="h-4 w-32" /> : title}
              </CardTitle>
              {i === 0 && <Users className="h-4 w-4 text-muted-foreground" />}
              {i === 1 && <HandCoins className="h-4 w-4 text-muted-foreground" />}
              {i === 2 && <PiggyBank className="h-4 w-4 text-muted-foreground" />}
              {i === 3 && <AlertCircle className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {i === 0 && stats.total_members?.toLocaleString()}
                    {i === 1 && stats.active_loans}
                    {i === 2 && formatCurrency(stats.total_savings)}
                    {i === 3 && stats.pending_kyc}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    {i === 0 && (
                      <>
                        {stats.members_growth > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                        )}
                        {stats.members_growth > 0 ? '+' : ''}{stats.members_growth}%
                      </>
                    )}
                    {i === 1 && (
                      <>
                        {stats.loans_growth > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                        )}
                        {stats.loans_growth > 0 ? '+' : ''}{stats.loans_growth}%
                      </>
                    )}
                    {i === 2 && (
                      <>
                        {stats.savings_growth > 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                        )}
                        {stats.savings_growth > 0 ? '+' : ''}{stats.savings_growth}%
                      </>
                    )}
                    {i === 3 && (
                      <>
                        <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                        {stats.kyc_change}%
                      </>
                    )}
                    {' This Month'}
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
            <CardDescription>Latest member actions and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
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
                          <TableCell>
                            {activity.amount ? formatCurrency(activity.amount) : '—'}
                          </TableCell>
                          <TableCell>{activity.date}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                activity.status === 'completed'
                                  ? 'default'
                                  : activity.status === 'approved'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {activity.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {activity.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {activity.status === 'approved' && <BadgeCheck className="h-3 w-3 mr-1" />}
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <div className="mt-4 text-right">
                  <Button variant="link">View All →</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Subscription */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Member
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <BadgeCheck className="mr-2 h-4 w-4" />
                Approve Loan
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Users</span>
                      <span className="font-medium">
                        {subscription.users_used} of {subscription.users_limit}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {subscription.users_limit - subscription.users_used} users remaining
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Sub-Admins</span>
                      <span className="font-medium">
                        {subscription.admins_used} of {subscription.admins_limit}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {subscription.admins_limit - subscription.admins_used} slots remaining
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Plan</p>
                        <p className="text-sm text-muted-foreground">
                          {subscription.plan} • ₦{subscription.price}/month
                        </p>
                      </div>
                      <Button>Upgrade Plan</Button>
                    </div>
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
            <CardDescription>Monthly growth over the last 7 months</CardDescription>
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
            <CardDescription>On-time repayment performance</CardDescription>
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
                <p className="mt-6 text-lg font-medium">Excellent repayment performance</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}