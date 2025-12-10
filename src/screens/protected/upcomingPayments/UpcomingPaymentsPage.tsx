import React, { useState } from 'react';
import { 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  Eye,
  Send
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for upcoming payments
const mockPayments = [
  {
    id: 'LN-2024-001',
    date: '2024-12-15',
    member: 'Chidi Okonkwo',
    memberCode: 'MEM-001',
    amountToPay: 25000,
    principalAmount: 20000,
    interest: 4000,
    latePenalty: 1000,
    balance: 250000,
    status: 'overdue',
    daysOverdue: 5
  },
  {
    id: 'LN-2024-002',
    date: '2024-12-12',
    member: 'Amina Bello',
    memberCode: 'MEM-002',
    amountToPay: 30000,
    principalAmount: 28000,
    interest: 2000,
    latePenalty: 0,
    balance: 180000,
    status: 'due',
    daysOverdue: 0
  },
  {
    id: 'LN-2024-003',
    date: '2024-12-18',
    member: 'Tunde Adeyemi',
    memberCode: 'MEM-003',
    amountToPay: 15000,
    principalAmount: 12000,
    interest: 3000,
    latePenalty: 0,
    balance: 95000,
    status: 'upcoming',
    daysOverdue: 0
  },
  {
    id: 'LN-2024-004',
    date: '2024-12-20',
    member: 'Ngozi Eze',
    memberCode: 'MEM-004',
    amountToPay: 40000,
    principalAmount: 35000,
    interest: 5000,
    latePenalty: 0,
    balance: 320000,
    status: 'upcoming',
    daysOverdue: 0
  },
  {
    id: 'LN-2024-005',
    date: '2024-12-08',
    member: 'Ibrahim Yusuf',
    memberCode: 'MEM-005',
    amountToPay: 22000,
    principalAmount: 18000,
    interest: 3500,
    latePenalty: 500,
    balance: 145000,
    status: 'overdue',
    daysOverdue: 2
  },
  {
    id: 'LN-2024-006',
    date: '2024-12-25',
    member: 'Funke Ajayi',
    memberCode: 'MEM-006',
    amountToPay: 50000,
    principalAmount: 45000,
    interest: 5000,
    latePenalty: 0,
    balance: 450000,
    status: 'upcoming',
    daysOverdue: 0
  },
  {
    id: 'LN-2024-007',
    date: '2024-12-13',
    member: 'Emeka Obi',
    memberCode: 'MEM-007',
    amountToPay: 18000,
    principalAmount: 15000,
    interest: 3000,
    latePenalty: 0,
    balance: 120000,
    status: 'due',
    daysOverdue: 0
  },
];

// Status badge component
const StatusBadge = ({ status, daysOverdue }) => {
  const statusConfig = {
    overdue: {
      icon: AlertCircle,
      label: `Overdue (${daysOverdue}d)`,
      variant: 'destructive',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    due: {
      icon: AlertTriangle,
      label: 'Due Today',
      variant: 'warning',
      className: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    upcoming: {
      icon: Clock,
      label: 'Upcoming',
      variant: 'secondary',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    paid: {
      icon: CheckCircle2,
      label: 'Paid',
      variant: 'success',
      className: 'bg-green-100 text-green-800 border-green-200'
    }
  };

  const config = statusConfig[status] || statusConfig.upcoming;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const UpcomingPaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [payments, setPayments] = useState(mockPayments);

  // Calculate summary statistics
  const stats = {
    total: payments.length,
    overdue: payments.filter(p => p.status === 'overdue').length,
    dueToday: payments.filter(p => p.status === 'due').length,
    upcoming: payments.filter(p => p.status === 'upcoming').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amountToPay, 0),
    overdueAmount: payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amountToPay, 0),
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.memberCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSendReminder = (paymentId) => {
    alert(`Reminder sent for payment ${paymentId}`);
  };

  const handleViewDetails = (paymentId) => {
    alert(`View details for payment ${paymentId}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upcoming Payments</h1>
          <p className="text-gray-600 mt-1">
            Track and manage loan repayment schedules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Send className="w-4 h-4" />
            Send Bulk Reminders
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription>Total Payments</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {formatCurrency(stats.totalAmount)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Overdue
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">{stats.overdue}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 font-semibold">
              {formatCurrency(stats.overdueAmount)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Due Today
            </CardDescription>
            <CardTitle className="text-2xl text-amber-600">{stats.dueToday}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Upcoming
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.upcoming}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Within next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by loan ID, member name, or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="due">Due Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Loan ID</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Member</TableHead>
                  <TableHead className="font-semibold text-right">Amount to Pay</TableHead>
                  <TableHead className="font-semibold text-right">Principal</TableHead>
                  <TableHead className="font-semibold text-right">Interest</TableHead>
                  <TableHead className="font-semibold text-right">Late Penalty</TableHead>
                  <TableHead className="font-semibold text-right">Balance</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No payments found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-blue-600">
                        {payment.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(payment.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.member}</div>
                          <div className="text-sm text-gray-500">{payment.memberCode}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(payment.amountToPay)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(payment.principalAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(payment.interest)}
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.latePenalty > 0 ? (
                          <span className="text-red-600 font-medium">
                            {formatCurrency(payment.latePenalty)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(payment.balance)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status} daysOverdue={payment.daysOverdue} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(payment.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendReminder(payment.id)}>
                              <Send className="w-4 h-4 mr-2" />
                              Send Reminder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination info */}
          {filteredPayments.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredPayments.length} of {payments.length} payments
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpcomingPaymentsPage;