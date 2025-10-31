import React, { useState } from "react";
import { Coins, BarChart3, Clock, Gift, Search, Download } from "lucide-react";

const Shares = () => {
  const members = [
    {
      name: "Crowther's Foundation",
      id: "1,123",
      product: "$30,000,000,000",
      kyc: "Active",
      activity: "21-06-2025",
    },
    {
      name: "Growth Fund 24",
      id: "56",
      product: "$24,000",
      kyc: "Inactive",
      activity: "21-06-2025",
    },
    {
      name: "Educational Savings Plan",
      id: "38",
      product: "$5,434,343",
      kyc: "Active",
      activity: "21-06-2025",
    },
    {
      name: "Retirement",
      id: "2,234",
      product: "$3,940,343",
      kyc: "Active",
      activity: "21-06-2025",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = members.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(members.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <button className=" md:mt-0 bg-black text-white rounded-lg py-2 px-4 hover:bg-gray-900 transition">
          Add New Share Plan
        </button>
        <button className="flex gap-2 items-center bg-black text-white rounded-lg py-2 px-4 hover:bg-gray-950 transition">
          <Download size={18} /> Export
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[
          {
            icon: <Coins size={20} />,
            label: "Total Share Value",
            value: "$5,233",
            change: "+11% This Month",
          },
          {
            icon: <BarChart3 size={20} />,
            label: "Active Share Plan",
            value: "350",
            change: "+5% This Month",
          },
          {
            icon: <Clock size={20} />,
            label: "Pending Withdrawals",
            value: "$5,233",
            change: "+15% This Month",
          },
          {
            icon: <Gift size={20} />,
            label: "Dividend Distributed",
            value: "$5,233",
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

      {/* Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mt-8">
        <div className="md:flex justify-between items-center mb-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name, ID, contact info"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none text-sm text-black"
            />
          </div>
          {/* Filters */}
          <div className=" flex mt-4 md:mt-0 gap-4">
            <div className="flex gap-4">
              <select className="border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:outline-none">
                <option>All Members</option>
                <option>Most Recent</option>
                <option>Name (A–Z)</option>
                <option>KYC Status</option>
              </select>

              <select className="border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300 focus:outline-none">
                <option>All Types</option>
                <option>Most Recent</option>
                <option>Name (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Share Plan
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Member Count
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Share Value
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Status
                </th>
                <th className="py-3 px-4 font-semibold text-sm text-black">
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((member, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-sm text-black">
                    {member.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-black">{member.id}</td>
                  <td className="py-3 px-4 text-sm text-black">
                    {member.product}
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
                  <td className="py-3 px-4 text-sm text-black">
                    {member.activity}
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
            {Math.min(indexOfLastItem, members.length)} of {members.length}
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

export default Shares;
