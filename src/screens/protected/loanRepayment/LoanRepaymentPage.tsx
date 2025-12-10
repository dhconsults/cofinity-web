import React, { useState } from 'react';
import { 
  Plus,
  Search,
  Eye,
  Trash2,
  Download,
  Calendar,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Mock data for loan repayments
const mockRepayments = [
  {
    id: 1,
    loanId: 'LN-2024-001',
    paymentDate: '2024-12-10',
    principalAmount: 20000,
    interest: 4000,
    latePenalties: 1000,
    totalAmount: 25000,
    debitAccount: 'Cash',
    remarks: 'Regular monthly payment'
  },
  {
    id: 2,
    loanId: 'LN-2024-002',
    paymentDate: '2024-12-08',
    principalAmount: 28000,
    interest: 2000,
    latePenalties: 0,
    totalAmount: 30000,
    debitAccount: 'Bank Transfer',
    remarks: 'Early payment with discount'
  },
  {
    id: 3,
    loanId: 'LN-2024-003',
    paymentDate: '2024-12-05',
    principalAmount: 12000,
    interest: 3000,
    latePenalties: 0,
    totalAmount: 15000,
    debitAccount: 'Cash',
    remarks: 'Partial payment'
  },
  {
    id: 4,
    loanId: 'LN-2024-004',
    paymentDate: '2024-12-03',
    principalAmount: 35000,
    interest: 5000,
    latePenalties: 500,
    totalAmount: 40500,
    debitAccount: 'Cash',
    remarks: 'Late payment with penalty'
  },
  {
    id: 5,
    loanId: 'LN-2024-005',
    paymentDate: '2024-12-01',
    principalAmount: 18000,
    interest: 3500,
    latePenalties: 0,
    totalAmount: 21500,
    debitAccount: 'Bank Transfer',
    remarks: 'Monthly installment'
  }
];

// Mock loan options
const loanOptions = [
  { id: 'LN-2024-001', label: 'LN-2024-001 - Chidi Okonkwo' },
  { id: 'LN-2024-002', label: 'LN-2024-002 - Amina Bello' },
  { id: 'LN-2024-003', label: 'LN-2024-003 - Tunde Adeyemi' },
  { id: 'LN-2024-004', label: 'LN-2024-004 - Ngozi Eze' },
  { id: 'LN-2024-005', label: 'LN-2024-005 - Ibrahim Yusuf' }
];

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

const LoanRepaymentPage = () => {
  const [repayments, setRepayments] = useState(mockRepayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    loanId: '',
    dueRepaymentDate: '',
    latePenalties: '',
    principalAmount: '',
    interest: '',
    debitAccount: 'Cash',
    totalAmount: '',
    remarks: ''
  });

  // Calculate total amount when principal, interest, or penalties change
  React.useEffect(() => {
    const principal = parseFloat(formData.principalAmount) || 0;
    const interest = parseFloat(formData.interest) || 0;
    const penalties = parseFloat(formData.latePenalties) || 0;
    const total = principal + interest + penalties;
    
    setFormData(prev => ({
      ...prev,
      totalAmount: total > 0 ? total.toFixed(2) : ''
    }));
  }, [formData.principalAmount, formData.interest, formData.latePenalties]);

  // Filter repayments
  const filteredRepayments = repayments.filter(repayment =>
    repayment.loanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repayment.debitAccount.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.loanId || !formData.principalAmount || !formData.interest) {
      alert('Please fill in all required fields');
      return;
    }

    const newRepayment = {
      id: repayments.length + 1,
      loanId: formData.loanId,
      paymentDate: formData.paymentDate,
      principalAmount: parseFloat(formData.principalAmount),
      interest: parseFloat(formData.interest),
      latePenalties: parseFloat(formData.latePenalties) || 0,
      totalAmount: parseFloat(formData.totalAmount),
      debitAccount: formData.debitAccount,
      remarks: formData.remarks
    };

    setRepayments(prev => [newRepayment, ...prev]);
    setIsDialogOpen(false);
    
    // Reset form
    setFormData({
      paymentDate: new Date().toISOString().split('T')[0],
      loanId: '',
      dueRepaymentDate: '',
      latePenalties: '',
      principalAmount: '',
      interest: '',
      debitAccount: 'Cash',
      totalAmount: '',
      remarks: ''
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this repayment record?')) {
      setRepayments(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleView = (id) => {
    alert(`View details for repayment ID: ${id}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Repayments</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all loan repayment transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 ">
                <Plus className="w-4 h-4" />
                Add Repayment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Loan Repayment</DialogTitle>
                <DialogDescription>
                  Record a new loan repayment transaction. Fill in all required fields marked with *.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Payment Date */}
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">
                      Payment Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="paymentDate"
                      name="paymentDate"
                      type="date"
                      value={formData.paymentDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Loan ID */}
                  <div className="space-y-2">
                    <Label htmlFor="loanId">
                      Loan ID <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.loanId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, loanId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Loan" />
                      </SelectTrigger>
                      <SelectContent>
                        {loanOptions.map(loan => (
                          <SelectItem key={loan.id} value={loan.id}>
                            {loan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Due Repayment Date */}
                  <div className="space-y-2">
                    <Label htmlFor="dueRepaymentDate">
                      Due Repayment Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dueRepaymentDate"
                      name="dueRepaymentDate"
                      type="date"
                      value={formData.dueRepaymentDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Late Penalties */}
                  <div className="space-y-2">
                    <Label htmlFor="latePenalties">Late Penalties</Label>
                    <Input
                      id="latePenalties"
                      name="latePenalties"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.latePenalties}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Principal Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="principalAmount">
                      Principal Amount <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="principalAmount"
                      name="principalAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.principalAmount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Interest */}
                  <div className="space-y-2">
                    <Label htmlFor="interest">
                      Interest <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="interest"
                      name="interest"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.interest}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Debit Account */}
                  <div className="space-y-2">
                    <Label htmlFor="debitAccount">
                      Debit Account <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.debitAccount} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, debitAccount: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Total Amount (Read-only calculated) */}
                  <div className="space-y-2">
                    <Label htmlFor="totalAmount">
                      Total Amount <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="totalAmount"
                      name="totalAmount"
                      type="text"
                      value={formData.totalAmount}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                {/* Remarks - Full width */}
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    name="remarks"
                    placeholder="Enter any additional notes..."
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Save Repayment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show</span>
              <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-700">entries</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Loan ID</TableHead>
                  <TableHead className="font-semibold">Payment Date</TableHead>
                  <TableHead className="font-semibold text-right">Principal Amount</TableHead>
                  <TableHead className="font-semibold text-right">Interest</TableHead>
                  <TableHead className="font-semibold text-right">Late Penalties</TableHead>
                  <TableHead className="font-semibold text-right">Total Amount</TableHead>
                  <TableHead className="font-semibold text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No repayment records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRepayments.map((repayment) => (
                    <TableRow key={repayment.id}>
                      <TableCell className="font-medium text-blue-600">
                        {repayment.loanId}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(repayment.paymentDate)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(repayment.principalAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(repayment.interest)}
                      </TableCell>
                      <TableCell className="text-right">
                        {repayment.latePenalties > 0 ? (
                          <span className="text-red-600 font-medium">
                            {formatCurrency(repayment.latePenalties)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(repayment.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(repayment.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(repayment.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination info */}
          {filteredRepayments.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredRepayments.length} of {repayments.length} repayments
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanRepaymentPage;