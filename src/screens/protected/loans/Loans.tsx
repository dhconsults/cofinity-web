import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  loanType: string;
  principalAmount: number;
  interestRate: number;
  totalAmount: number;
  duration: number;
  status: 'Pending' | 'Approved' | 'Disbursed' | 'Active' | 'Completed' | 'Defaulted';
  disbursedDate: string;
  dueDate: string;
  createdAt: string;
  amountPaid: number;
}

const LoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState('recent');

  const navigate = useNavigate(); 

  const rowsPerPage = 8;

  const mockLoans: Loan[] = [
    {
      id: 'LN-001',
      memberId: 'MEM-001',
      memberName: 'Abdul Saakar',
      memberEmail: 'abdul003@gmail.com',
      loanType: 'Personal',
      principalAmount: 5000,
      interestRate: 12,
      totalAmount: 5600,
      duration: 25,
      status: 'Active',
      disbursedDate: '2025-03-21',
      dueDate: '2025-08-25',
      createdAt: '2025-03-15',
      amountPaid: 2800,
    },
    {
      id: 'LN-002',
      memberId: 'MEM-002',
      memberName: 'Amina Bello',
      memberEmail: 'amina@gmail.com',
      loanType: 'Business',
      principalAmount: 8700,
      interestRate: 15,
      totalAmount: 10005,
      duration: 18,
      status: 'Pending',
      disbursedDate: '2025-02-01',
      dueDate: '2026-08-01',
      createdAt: '2025-01-20',
      amountPaid: 0,
    },
    {
      id: 'LN-003',
      memberId: 'MEM-003',
      memberName: 'Bode Hassan',
      memberEmail: 'bodeh@gmail.com',
      loanType: 'Education',
      principalAmount: 12000,
      interestRate: 10,
      totalAmount: 13200,
      duration: 12,
      status: 'Active',
      disbursedDate: '2025-01-01',
      dueDate: '2026-01-01',
      createdAt: '2025-01-01',
      amountPaid: 3300,
    },
    {
      id: 'LN-004',
      memberId: 'MEM-004',
      memberName: 'Mary John',
      memberEmail: 'maryj@gmail.com',
      loanType: 'Personal',
      principalAmount: 3500,
      interestRate: 12,
      totalAmount: 3920,
      duration: 8,
      status: 'Defaulted',
      disbursedDate: '2025-10-01',
      dueDate: '2026-06-01',
      createdAt: '2025-09-15',
      amountPaid: 1000,
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoans(mockLoans);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = loans;

    if (searchTerm) {
      filtered = filtered.filter(
        (loan) =>
          loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loan.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((loan) => loan.status === statusFilter);
    }

    if (typeFilter !== 'All') {
      filtered = filtered.filter((loan) => loan.loanType === typeFilter);
    }

    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'amount-high') {
      filtered.sort((a, b) => b.principalAmount - a.principalAmount);
    } else if (sortBy === 'amount-low') {
      filtered.sort((a, b) => a.principalAmount - b.principalAmount);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.memberName.localeCompare(b.memberName));
    }

    setFilteredLoans(filtered);
    setCurrentPage(1);
  }, [loans, searchTerm, statusFilter, typeFilter, sortBy]);

  const totalPages = Math.ceil(filteredLoans.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirstRow, indexOfLastRow);

  const stats = {
    totalLoans: loans.length,
    activeLoans: loans.filter((l) => l.status === 'Active').length,
    pendingLoans: loans.filter((l) => l.status === 'Pending').length,
    defaultedLoans: loans.filter((l) => l.status === 'Defaulted').length,
  };

  const getStatusBadgeStyles = (status: string) => {
    const statusStyles: Record<string, string> = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-blue-100 text-blue-800',
      Disbursed: 'bg-purple-100 text-purple-800',
      Active: 'bg-green-100 text-green-800',
      Completed: 'bg-gray-100 text-gray-800',
      Defaulted: 'bg-red-100 text-red-800',
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadgeStyles = (type: string) => {
    const typeStyles: Record<string, string> = {
      Personal: 'bg-blue-50 text-blue-700',
      Business: 'bg-green-50 text-green-700',
      Education: 'bg-purple-50 text-purple-700',
      Emergency: 'bg-red-50 text-red-700',
    };
    return typeStyles[type] || 'bg-gray-50 text-gray-700';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(value);
  };

  const calculateRepaymentProgress = (amountPaid: number, totalAmount: number) => {
    return Math.round((amountPaid / totalAmount) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loans Management</h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage loan applications, disbursements, and repayments
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                📥 <span className="hidden sm:inline text-sm">Export</span>
              </button>
              <Button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => navigate('/loan-product')}>
                ⚙️ <span className="hidden sm:inline text-sm">Settings</span>
              </Button>
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
                ➕ <span className="hidden sm:inline text-sm">New Loan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: 'Total Loans',
              value: stats.totalLoans,
              icon: '💰',
              color: 'from-blue-500 to-blue-600',
            },
            {
              title: 'Active Loans',
              value: stats.activeLoans,
              icon: '📈',
              color: 'from-green-500 to-green-600',
            },
            {
              title: 'Pending',
              value: stats.pendingLoans,
              icon: '⏳',
              color: 'from-yellow-500 to-yellow-600',
            },
            {
              title: 'Defaulted',
              value: stats.defaultedLoans,
              icon: '⚠️',
              color: 'from-red-500 to-red-600',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/20 rounded-lg text-2xl">{stat.icon}</div>
              </div>
              <h3 className="text-sm font-medium opacity-90">{stat.title}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Member name, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Defaulted">Defaulted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              >
                <option value="All">All Types</option>
                <option value="Personal">Personal</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="amount-high">Amount (High to Low)</option>
                <option value="amount-low">Amount (Low to High)</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    'Member',
                    'Loan ID',
                    'Type',
                    'Amount',
                    'Duration',
                    'Status',
                    'Progress',
                    'Action',
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left font-semibold text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Loading loans...
                    </td>
                  </tr>
                ) : currentLoans.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No loans found
                    </td>
                  </tr>
                ) : (
                  currentLoans.map((loan, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              loan.memberName
                            )}&background=000000&color=ffffff`}
                            alt={loan.memberName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{loan.memberName}</p>
                            <p className="text-xs text-gray-500">{loan.memberEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{loan.id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeStyles(loan.loanType)}`}>
                          {loan.loanType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{formatCurrency(loan.principalAmount)}</td>
                      <td className="px-6 py-4 text-gray-700">{loan.duration} months</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyles(loan.status)}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${calculateRepaymentProgress(
                                loan.amountPaid,
                                loan.totalAmount
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {calculateRepaymentProgress(loan.amountPaid, loan.totalAmount)}%
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                          👁️ View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredLoans.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstRow + 1}–{Math.min(indexOfLastRow, filteredLoans.length)} of{' '}
                {filteredLoans.length} loans
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 border rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ←
                </button>
                <span className="text-sm text-gray-600 px-3 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 border rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoansPage;