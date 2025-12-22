import React from "react";
import {
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  MoreVertical,
} from "lucide-react";

const UserSavings = () => {
  const transactions = [
    {
      id: 1,
      type: "Deposit",
      amount: "+₦50,000",
      date: "Nov 4, 2025",
      icon: <ArrowUpRight />,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "Withdrawal",
      amount: "-₦20,000",
      date: "Nov 3, 2025",
      icon: <ArrowDownRight />,
      color: "text-red-600",
    },
    {
      id: 3,
      type: "Deposit",
      amount: "+₦15,000",
      date: "Oct 29, 2025",
      icon: <ArrowUpRight />,
      color: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col gap-8 mb-4 rounded-lg">
      {/* Header */}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-gray-500 font-medium">Total Savings</h2>
              <p className="text-3xl font-bold text-gray-900 mt-1">₦150,000</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <PiggyBank className="text-blue-600 w-6 h-6" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Goal Progress</span>
              <span className="text-sm font-medium text-blue-600">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-[75%]" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-700 font-semibold">Summary</h3>
            <MoreVertical className="text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100">
              <ArrowUpRight className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Deposits</p>
              <p className="font-semibold text-gray-800">₦300,000</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100">
              <ArrowDownRight className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Withdrawals</p>
              <p className="font-semibold text-gray-800">₦150,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-800 font-semibold">Recent Transactions</h3>
          <button className="text-blue-600 hover:underline text-sm font-medium">
            View all
          </button>
        </div>

        <ul className="divide-y divide-gray-200">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 bg-gray-100 rounded-full ${tx.color}`}>
                  {tx.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{tx.type}</p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
              </div>
              <span className={`font-semibold ${tx.color}`}>{tx.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Wallet Summary */}
      <div className="bg-white text-gray-900 rounded-2xl p-6 flex items-center justify-between shadow">
        <div>
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-3xl font-bold mt-1">₦120,000</p>
        </div>
        <div className="bg-white/20 p-4 rounded-full">
          <Wallet className="w-7 h-7 text-gray-900" />
        </div>
      </div>
    </div>
  );
};

export default UserSavings;
