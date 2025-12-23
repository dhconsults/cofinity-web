import React, { useState } from "react";
import { CreditCard, DollarSign, Clock, TrendingUp, X } from "lucide-react";

export default function UserLoan() {
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [paymentOption, setPaymentOption] = useState("Wallet Balance");
  const [amount, setAmount] = useState("");

  const loans = [
    {
      id: 1,
      amount: 250000,
      status: "Active",
      date: "2025-09-15",
      due: "2026-09-15",
    },
    {
      id: 2,
      amount: 150000,
      status: "Paid",
      date: "2024-06-20",
      due: "2025-06-20",
    },
    { id: 3, amount: 100000, status: "Rejected", date: "2023-02-12", due: "-" },
  ];

  const progress = 65;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6 text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Loan Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card icon={<DollarSign />} label="Total Loan" value="₦500,000" />
        <Card icon={<TrendingUp />} label="Active Loan" value="₦250,000" />
        <Card icon={<Clock />} label="Next Payment Due" value="15 Dec 2025" />
      </div>

      {/* Active Loan Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard size={20} /> Active Loan Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <p>
            <strong>Amount:</strong> ₦250,000
          </p>
          <p>
            <strong>Interest Rate:</strong> 12% per annum
          </p>
          <p>
            <strong>Duration:</strong> 12 months
          </p>
          <p>
            <strong>Next Payment:</strong> ₦22,000 (15 Dec 2025)
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-900">
              Repayment Progress
            </span>
            <span className="text-sm font-medium text-gray-900">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={() => setShowRepayModal(true)}
          className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Repay Loan
        </button>
      </div>

      {/* Loan History */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Loan History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100 text-gray-900 uppercase">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{loan.id}</td>
                  <td className="py-3 px-4">₦{loan.amount.toLocaleString()}</td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      loan.status === "Active"
                        ? "text-blue-600"
                        : loan.status === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {loan.status}
                  </td>
                  <td className="py-3 px-4">{loan.date}</td>
                  <td className="py-3 px-4">{loan.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Repay Loan Modal */}
      {showRepayModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setShowRepayModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Repay Loan
            </h3>

            {/* Payment Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Payment Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Payment Option */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Payment Option
              </label>
              <select
                value={paymentOption}
                onChange={(e) => setPaymentOption(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option>Wallet Balance</option>
                <option>Bank Transfer</option>
                <option>Debit Card</option>
                <option>USSD</option>
                <option>Cash Deposit</option>
              </select>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Description / Notes
              </label>
              <textarea
                placeholder="Optional note"
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              ></textarea>
            </div>

            <button className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-900 transition">
              Confirm Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Card Component
const Card = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col items-start gap-2 p-5 rounded-xl bg-white shadow-md border border-gray-200">
    <div className="flex items-center justify-between w-full text-gray-900">
      {icon}
    </div>
    <p className="text-sm text-gray-500">{label}</p>
    <h3 className="text-xl font-bold text-gray-900">{value}</h3>
  </div>
);
