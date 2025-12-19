'use client';

import { format } from 'date-fns';
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Shield,
  Users,
  Building2,
  DollarSign,
  History,
  RefreshCw,
  Eye,
  Download,
  FileText
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
 
// Dummy data (replace with real API later)
const currentPlan = {
  name: 'Pro',
  price: 5000,
  formattedPrice: '₦5,000',
  billingCycle: 'monthly',
  status: 'active',
  nextBillingDate: '2026-01-18',
  subscriptionStart: '2025-03-06',
  subscriptionEnd: '2030-04-04',
  lastPayment: 5000,
  lastPaymentDate: '2025-03-07',
};

const usage = {
  members: { used: 42, limit: 50 },
  admins: { used: 8, limit: 10 },
  activeLoans: { used: 28, limit: 100 },
};

const invoices = [
  {
    id: 'INV-2025-000012',
    date: '2025-03-07',
    amount: 5000,
    status: 'paid',
    description: 'Pro Plan – Monthly',
    dueDate: '2025-04-07',
    items: [
      { description: 'Pro Plan (Monthly)', quantity: 1, unitPrice: 5000, total: 5000 },
    ],
  },
  {
    id: 'INV-2025-000008',
    date: '2025-02-07',
    amount: 5000,
    status: 'paid',
    description: 'Pro Plan – Monthly',
    dueDate: '2025-03-07',
    items: [
      { description: 'Pro Plan (Monthly)', quantity: 1, unitPrice: 5000, total: 5000 },
    ],
  },
  {
    id: 'INV-2025-000004',
    date: '2025-01-07',
    amount: 5000,
    status: 'paid',
    description: 'Pro Plan – Monthly',
    dueDate: '2025-02-07',
    items: [
      { description: 'Pro Plan (Monthly)', quantity: 1, unitPrice: 5000, total: 5000 },
    ],
  },
];

const upcomingInvoice = {
  id: 'INV-2026-000001',
  amount: 5000,
  dueDate: '2026-01-18',
  description: 'Pro Plan – Monthly Renewal',
  items: [
    { description: 'Pro Plan (Monthly)', quantity: 1, unitPrice: 5000, total: 5000 },
  ],
};

export default function BillingPage() {
  const router = useNavigate();

  const canDowngrade = usage.members.used <= 10 && usage.admins.used <= 2 && usage.activeLoans.used <= 20;

  const handleUpgradeClick = () => {
    router('/billing/upgrade'); // or '/choose-plan' if that's your route
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">
          Manage your plan, view invoices, and payment history
        </p>
      </div>

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>Your cooperative is on the {currentPlan.name} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="text-2xl font-bold flex items-center gap-2">
                {currentPlan.name}
                <Badge variant="secondary">Active</Badge>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Billing Cycle</p>
              <p className="text-lg font-medium capitalize">{currentPlan.billingCycle}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Next billing: {format(new Date(currentPlan.nextBillingDate), 'dd MMM yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-2xl font-bold">{currentPlan.formattedPrice}/month</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-semibold mb-4">Membership Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Subscription Start</p>
                <p className="font-medium">{format(new Date(currentPlan.subscriptionStart), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Period Ends</p>
                <p className="font-medium">{format(new Date(currentPlan.subscriptionEnd), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Payment</p>
                <p className="font-medium">₦{currentPlan.lastPayment.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Payment Date</p>
                <p className="font-medium">{format(new Date(currentPlan.lastPaymentDate), 'dd MMM yyyy HH:mm')}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={handleUpgradeClick}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Renew Now / Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Invoice Alert */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertTitle>Upcoming Renewal</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            Your next invoice <strong>{upcomingInvoice.id}</strong> for ₦{upcomingInvoice.amount.toLocaleString()} is due on{' '}
            {format(new Date(upcomingInvoice.dueDate), 'dd MMMM yyyy')}.
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="px-0">
                View Invoice Preview →
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Invoice Preview – {upcomingInvoice.id}</DialogTitle>
                <DialogDescription>Due {format(new Date(upcomingInvoice.dueDate), 'dd MMMM yyyy')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Invoice Number</p>
                    <p className="font-medium">{upcomingInvoice.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount Due</p>
                    <p className="font-medium text-xl">₦{upcomingInvoice.amount.toLocaleString()}</p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingInvoice.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">₦{item.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₦{item.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button>Pay Now</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </AlertDescription>
      </Alert>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>Your past invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell>{format(new Date(inv.date), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{inv.description}</TableCell>
                  <TableCell>₦{inv.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === 'paid' ? 'default' : 'secondary'}>
                      {inv.status === 'paid' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : null}
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Invoice – {inv.id}</DialogTitle>
                          <DialogDescription>Issued {format(new Date(inv.date), 'dd MMMM yyyy')}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Invoice Number</p>
                              <p className="font-medium">{inv.id}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <p className="font-medium">
                                <Badge variant={inv.status === 'paid' ? 'default' : 'secondary'}>
                                  {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                                </Badge>
                              </p>
                            </div>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {inv.items.map((item, i) => (
                                <TableRow key={i}>
                                  <TableCell>{item.description}</TableCell>
                                  <TableCell className="text-right">{item.quantity}</TableCell>
                                  <TableCell className="text-right">₦{item.unitPrice.toLocaleString()}</TableCell>
                                  <TableCell className="text-right">₦{item.total.toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <div className="flex justify-end">
                            <Button variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upgrade Button */}
      <div className="flex justify-center">
        <Button size="lg" onClick={handleUpgradeClick}>
          Renew Now or Upgrade Plan
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}