import React, { useState } from "react";
import {
  Download,
  Calendar,
  Search,
  ArrowLeftRight,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
} from "lucide-react";

const Transactions = () => {
  const members = [
    {
      id: "Txn-b45",
      name: "Elon Musk",
      type: "Withdrawal",
      amount: "$8,250",
      status: "Completed",
      date: "21-06-2025",
    },
    {
      id: "Txn-b56",
      name: "Nora Amanda",
      type: "Withdrawal",
      amount: "$3,500",
      status: "Pending",
      date: "21-06-2025",
    },
    {
      id: "Txn-b89",
      name: "Joyce Kalu",
      type: "Share Purchase",
      amount: "$450",
      status: "Failed",
      date: "21-06-2025",
    },
    {
      id: "Txn-b45",
      name: "Micheal Joker",
      type: "Withdrawal",
      amount: "$450",
      status: "Completed",
      date: "21-06-2025",
    },
    {
      id: "Txn-Y374",
      name: "Jay Jay",
      type: "Loan Disbursement",
      amount: "$450",
      status: "Pending",
      date: "21-06-2025",
    },
    {
      id: "Txn-a36",
      name: "Bill Gate",
      type: "Deposit",
      amount: "$4,500",
      status: "Completed",
      date: "21-06-2025",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = members.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(members.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between">
        {/* Filters */}
        <div className="flex  justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            {/* Date Range */}
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select className="appearance-none border border-gray-300 rounded-lg py-2 pl-9 pr-8 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:outline-none">
                <option>Date Range:</option>
                <option>Last 10 Days</option>
                <option>Last 30 Days</option>
                <option>1 Month</option>
                <option>3 Months</option>
              </select>
              <svg
                className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {/* Status */}
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-lg py-2 px-8 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:outline-none">
                <option>Status:</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
              <svg
                className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Type */}
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-lg py-2 px-8 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:outline-none">
                <option>Type:</option>
                <option>All</option>
                <option>Withdrawal</option>
                <option>Deposit</option>
                <option>Loan</option>
                <option>Share Purchase</option>
              </select>
              <svg
                className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
        <button className="flex mt-4 md:mt-0 gap-2 items-center bg-black text-white rounded-lg py-2 px-4 hover:bg-gray-950 transition">
          <Download size={18} /> Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {[
          {
            icon: <ArrowLeftRight size={20} />,
            label: "Total Transactions",
            value: "$5,233",
            change: "+11% This Month",
          },
          {
            icon: <ArrowDownCircle size={20} />,
            label: "Total Inflows",
            value: "$4,350",
            change: "+5% This Month",
          },
          {
            icon: <ArrowUpCircle size={20} />,
            label: "Total Outflows",
            value: "$5,233",
            change: "+15% This Month",
          },
          {
            icon: <Clock size={20} />,
            label: "Pending Approvals",
            value: "7",
            change: "+15% This Month",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white text-black p-4 rounded-xl shadow-sm hover:shadow-md flex flex-col justify-between h-36 hover:scale-105 transition-transform duration-300"
          >
            <div>
              <div className="text-gray-700 mb-1">{card.icon}</div>
              <p className="text-sm text-gray-800">{card.label}</p>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{card.value}</h1>
              <span className="text-green-500 text-xs font-medium">
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mt-8">
        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name or ID"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none text-sm text-black"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Transaction ID
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Member Name
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Type
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Amount
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Status
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Date
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((member, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-sm text-black">{member.id}</td>
                  <td className="py-3 px-4 text-sm text-black">
                    {member.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-black">
                    {member.type}
                  </td>
                  <td className="py-3 px-4 text-sm text-black font-semibold">
                    {member.amount}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        member.status === "Completed"
                          ? "bg-green-500/20 text-green-700"
                          : member.status === "Failed"
                          ? "bg-red-500/20 text-red-700"
                          : "bg-yellow-500/20 text-yellow-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-black">
                    {member.date}
                  </td>
                  <td className="py-3 px-4 text-blue-500 text-sm cursor-pointer hover:underline">
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}–
            {Math.min(indexOfLastItem, members.length)} of {members.length}{" "}
            transactions
          </p>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-lg border text-sm ${
                  currentPage === i + 1
                    ? "bg-black text-white border-black"
                    : "text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
