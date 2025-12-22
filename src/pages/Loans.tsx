import React, { useState } from "react";
import {
  Wallet,
  TrendingDown,
  Clock,
  AlertTriangle,
  Search,
  Settings,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Loan {
  name: string;
  email: string;
  id: string;
  type: string;
  amount: string;
  duration: string;
  status: string;
  startDate: string;
  endDate: string;
}

const Loans = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showModal, setShowModal] = useState(false);

  const rowsPerPage = 4;

  const loans: Loan[] = [
    {
      name: "Abdul Saakar",
      email: "abdul003@gmail.com",
      id: "LN-002",
      type: "Personal",
      amount: "$5,059",
      duration: "25 Months",
      status: "Verified",
      startDate: "21-3-2025",
      endDate: "25-8-2025",
    },
    {
      name: "Amina Bello",
      email: "amina@gmail.com",
      id: "LN-003",
      type: "Business",
      amount: "$8,700",
      duration: "18 Months",
      status: "Pending",
      startDate: "01-2-2025",
      endDate: "01-8-2026",
    },
    {
      name: "Bode Hassan",
      email: "bodeh@gmail.com",
      id: "LN-004",
      type: "Education",
      amount: "$12,000",
      duration: "12 Months",
      status: "Verified",
      startDate: "01-1-2025",
      endDate: "01-1-2026",
    },
    {
      name: "Mary John",
      email: "maryj@gmail.com",
      id: "LN-005",
      type: "Personal",
      amount: "$3,500",
      duration: "8 Months",
      status: "Pending",
      startDate: "01-10-2025",
      endDate: "01-6-2026",
    },
  ];

  const totalPages = Math.ceil(loans.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentLoans = loans.slice(indexOfFirstRow, indexOfLastRow);

  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  return (
    <div className="p-4">
      {/* Header Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between ">
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="gap-2 items-center flex bg-black text-white rounded-lg py-2 px-4 hover:bg-gray-900 transition-colors cursor-pointer">
            <Download size={18} />
            Export Report
          </button>
          <Link
            to="/loans/LoanSettings"
            className="flex items-center border-2 border-black py-2 px-4 rounded-lg gap-2 text-black cursor-pointer hover:border-gray-900 transition-colors"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
        <div className=" mt-4 sm:mt-0">
          <Link
            to="/loans/LoanApplicationForm"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            New Loan Application
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 text-black">
        {[
          {
            title: "Total Loan Issued",
            value: "5,233",
            change: "+11%",
            icon: <Wallet size={20} />,
            color: "text-green-500",
          },
          {
            title: "Active Loans",
            value: "350",
            change: "+5%",
            icon: <TrendingDown size={20} />,
            color: "text-green-500",
          },
          {
            title: "Pending Approvals",
            value: "$5,233",
            change: "+15%",
            icon: <Clock size={20} />,
            color: "text-green-500",
          },
          {
            title: "Overdue Loans",
            value: "101",
            change: "-3%",
            icon: <AlertTriangle size={20} />,
            color: "text-red-500",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md flex flex-col  h-36 hover:scale-105 transition-transform duration-300"
          >
            <div>
              {card.icon}
              <p className="text-sm text-gray-800">{card.title}</p>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{card.value}</h1>
              <span className={`${card.color} text-xs font-medium`}>
                {card.change} This Month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Search Section */}
      <div className="mt-8 md:flex gap-4 justify-between">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search members by name, ID, contact info"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none text-sm text-black"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <div className="relative w-50 md:w-48 mt-4 md:mt-0">
          <select
            className="w-full appearance-none border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Sort by
            </option>
            <option value="recent">Most Recent</option>
            <option value="name">Name (A–Z)</option>
            <option value="kyc">KYC Status</option>
            <option value="contribution">Highest Contribution</option>
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

      {/* Loans Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-50">
              <tr>
                {[
                  "Member",
                  "Loan ID",
                  "Type",
                  "Amount",
                  "Duration",
                  "Status",
                  "Disbursed Date",
                  "Next Payment",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    className="py-3 px-4 font-semibold text-sm text-black"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentLoans.map((loan, index) => (
                <tr key={index} className="border-b border-gray-200 text-black">
                  <td className="flex items-center gap-2 py-3 px-4">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        loan.name
                      )}&background=000000&color=ffffff`}
                      alt={loan.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-bold">{loan.name}</p>
                      <span className="text-gray-500 text-sm">
                        {loan.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{loan.id}</td>
                  <td className="py-3 px-4 text-sm">{loan.type}</td>
                  <td className="py-3 px-4 text-sm">{loan.amount}</td>
                  <td className="py-3 px-4 text-sm">{loan.duration}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        loan.status === "Verified"
                          ? "bg-green-500/20 text-green-700"
                          : "bg-yellow-500/20 text-yellow-700"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{loan.startDate}</td>
                  <td className="py-3 px-4 text-sm">{loan.endDate}</td>
                  <td className="py-3 px-4 text-sm text-blue-500">
                    <button
                      onClick={() => handleViewDetails(loan)}
                      className="hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Showing {indexOfFirstRow + 1}–
              {Math.min(indexOfLastRow, loans.length)} of {loans.length} loans
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-lg text-sm ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed border-gray-200"
                    : "text-black border-gray-300 hover:bg-gray-100"
                }`}
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded-lg text-sm ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed border-gray-200"
                    : "text-black border-gray-300 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Details Modal */}
      {showModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Loan Details</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {selectedLoan.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedLoan.email}
              </p>
              <p>
                <strong>Loan ID:</strong> {selectedLoan.id}
              </p>
              <p>
                <strong>Type:</strong> {selectedLoan.type}
              </p>
              <p>
                <strong>Amount:</strong> {selectedLoan.amount}
              </p>
              <p>
                <strong>Duration:</strong> {selectedLoan.duration}
              </p>
              <p>
                <strong>Status:</strong> {selectedLoan.status}
              </p>
              <p>
                <strong>Disbursed:</strong> {selectedLoan.startDate}
              </p>
              <p>
                <strong>Next Payment:</strong> {selectedLoan.endDate}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
