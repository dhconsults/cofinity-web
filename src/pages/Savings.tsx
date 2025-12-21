import React from "react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { useEffect } from "react";

import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  CreditCard,
  PiggyBank,
  Coins,
  Receipt,
  Shield,
  FileText,
  Settings,
  Bell,
  Landmark,
  IdCard,
  Search,
  Download,
  Wallet,
  TrendingDown,
  Clock,
  AlertTriangle,
  UserCheck,
  BarChart3,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Savings = () => {

  const navigate = useNavigate(); 
  
 

  const members = [
    {
      name: "Sophia Clark",
      id: "MS-23-23",
      product: "Regular Savings",
      balance: "$113,203",
      activity: "21-06-2025",
      kyc: "Active",
    },
    {
      name: "Liam Foster",
      id: "MS-23-24",
      product: "Business Savings",
      balance: "$53,203",
      activity: "21-06-2025",
      kyc: "Inactive",
    },
    {
      name: "Emma Brown",
      id: "MS-23-25",
      product: "Regular Savings",
      balance: "$11,203",
      activity: "21-06-2025",
      kyc: "Active",
    },
    {
      name: "Ava Hughes",
      id: "MS-23-26",
      product: "Regular Savings",
      balance: "$3,203",
      activity: "21-06-2025",
      kyc: "Active",
    },
    {
      name: "Noah Reed",
      id: "MS-23-27",
      product: "Regular Savings",
      balance: "$203",
      activity: "21-06-2025",
      kyc: "Inactive",
    },
    {
      name: "Mason Green",
      id: "MS-23-28",
      product: "Regular Savings",
      balance: "$9,203",
      activity: "21-06-2025",
      kyc: "Active",
    },
    {
      name: "Olivia Bennett",
      id: "MS-23-29",
      product: "Regular Savings",
      balance: "$5,203",
      activity: "21-06-2025",
      kyc: "Inactive",
    },
    {
      name: "Ethan Carter",
      id: "MS-23-30",
      product: "Regular Savings",
      balance: "$3,203",
      activity: "21-06-2025",
      kyc: "Active",
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
    <div className="">
      {/* Main Content */}
      <main className="p-4 overflow-y-auto h-screen lg:h-auto">
        <div className="md:flex  items-center justify-between">
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button className="gap-2 items-center flex bg-black rounded-lg py-2 px-4 hover:bg-blue-950 transition-colors cursor-pointer">
              Record Withdrawal
            </button>
            <button className="flex items-center border-2 border-black py-2 px-4 rounded-lg gap-2 text-black cursor-pointer hover:border-blue-950 transition-colors">
              Record Deposit
            </button>
          </div>
          <div className="">
            <Button onClick={() => navigate('/savings-product')} className="bg-black px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
              <a href=""> Manage Savings Product</a>
            </Button>
          </div>
        </div>

        {/* card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white text-black p-4 rounded-xl shadow-sm hover:shadow-md flex flex-col justify-between h-36 hover:scale-105 transition-transform duration-300">
            <div>
              <PiggyBank size={20} className="text-gray-700 mb-2" />
              <p className="text-sm text-gray-800">Total Savings Balance</p>
            </div>
            <div>
              <h1 className="text-2xl font-bold">$5,233</h1>
              <span className="text-green-500 text-xs font-medium">
                +11% This Month
              </span>
            </div>
          </div>

          <div className="bg-white text-black p-4 rounded-xl shadow-sm hover:shadow-md flex flex-col justify-between h-36 hover:scale-105 transition-transform duration-300">
            <div>
              <UserCheck size={20} className="text-gray-700 mb-2" />
              <p className="text-sm text-gray-800">Members with Savings</p>
            </div>
            <div>
              <h1 className="text-2xl font-bold">350</h1>
              <span className="text-green-500 text-xs font-medium">
                +5% This Month
              </span>
            </div>
          </div>

          <div className="bg-white text-black p-4 rounded-xl shadow-sm hover:shadow-md flex flex-col justify-between h-36 hover:scale-105 transition-transform duration-300">
            <div>
              <BarChart3 size={20} className="text-gray-700 mb-2" />
              <p className="text-sm text-gray-800">Average Account Balance</p>
            </div>
            <div>
              <h1 className="text-2xl font-bold">$5,233</h1>
              <span className="text-green-500 text-xs font-medium">
                +15% This Month
              </span>
            </div>
          </div>
        </div>

        {/* search */}
        <div className=" md:flex gap-4 mt-8">
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

        {/* table             */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50">
                <tr className="">
                  <th className="py-3 px-4 font-semibold text-sm text-black">
                    Member Name
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-black">
                    Account Number
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-black">
                    Savings Product
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-black">
                    Current Balance
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-black">
                    Last Activity
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-black">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-black">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((member, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 px-4 text-sm text-black">
                      {member.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-black">
                      {member.id}
                    </td>

                    <td className="py-3 px-4 text-sm text-black">
                      {member.product}
                    </td>
                    <td className="py-3 px-4 text-sm text-black">
                      {member.balance}
                    </td>
                    <td className="py-3 px-4 text-sm text-black">
                      {member.activity}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          member.kyc === "Active"
                            ? "bg-green-500/20 text-green-700"
                            : "bg-yellow-500/20 text-yellow-700"
                        }`}
                      >
                        {member.kyc}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-sm text-blue-500">
                      <a href="#">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1}–
                {Math.min(indexOfLastItem, members.length)} of {members.length}{" "}
                members
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg border text-sm ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Prev
                </button>

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

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg border text-sm ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Savings;
