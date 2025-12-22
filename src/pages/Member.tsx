import React, { useState } from "react";
import { Users, Landmark, PiggyBank, IdCard, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Members = () => {
  const members = [
    {
      name: "Sophia Clark",
      id: "MS-23-23",
      email: "sophia@example.com",
      kyc: "Pending",
      contribution: "$4,400",
    },
    {
      name: "Liam Foster",
      id: "MS-23-24",
      email: "liam@example.com",
      kyc: "Verified",
      contribution: "$3,900",
    },
    {
      name: "Emma Brown",
      id: "MS-23-25",
      email: "emma@example.com",
      kyc: "Pending",
      contribution: "$5,200",
    },
    {
      name: "Ava Hughes",
      id: "MS-23-26",
      email: "ava@example.com",
      kyc: "Verified",
      contribution: "$4,700",
    },
    {
      name: "Noah Reed",
      id: "MS-23-27",
      email: "noah@example.com",
      kyc: "Pending",
      contribution: "$4,000",
    },
    {
      name: "Mason Green",
      id: "MS-23-28",
      email: "mason@example.com",
      kyc: "Verified",
      contribution: "$3,800",
    },
    {
      name: "Olivia Bennett",
      id: "MS-23-29",
      email: "olivia@example.com",
      kyc: "Pending",
      contribution: "$4,600",
    },
    {
      name: "Ethan Carter",
      id: "MS-23-30",
      email: "ethan@example.com",
      kyc: "Verified",
      contribution: "$4,200",
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
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105">
          <Users className="text-gray-700 mb-2" size={20} />
          <p className="text-sm text-gray-800">Total Members</p>
          <h1 className="text-2xl text-black font-bold mt-2">5,233</h1>
          <span className="text-green-500 text-xs font-medium">
            +11% This Month
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105">
          <Landmark className="text-gray-700 mb-2" size={20} />
          <p className="text-sm text-gray-800">Active Loans</p>
          <h1 className="text-2xl text-black font-bold mt-2">350</h1>
          <span className="text-green-500 text-xs font-medium">
            +5% This Month
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105">
          <PiggyBank className="text-gray-700 mb-2" size={20} />
          <p className="text-sm text-gray-800">Total Savings</p>
          <h1 className="text-2xl text-black font-bold mt-2">$5,233</h1>
          <span className="text-green-500 text-xs font-medium">
            +15% This Month
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105">
          <IdCard className="text-gray-700 mb-2" size={20} />
          <p className="text-sm  text-gray-800">Pending KYC</p>
          <h1 className="text-2xl text-black font-bold mt-2">101</h1>
          <span className="text-red-500 text-xs font-medium">
            -3% This Month
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mt-8 md:flex items-center justify-between">
        <div className="relative w-full md:w-2/3">
          <input
            type="text"
            placeholder="Search members by name, ID, or contact info"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none text-sm text-black"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        <Link
          to="/members/AddNewMembers"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
        >
          + Add New Member
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white text-black p-6 rounded-xl border border-gray-200 mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-3 px-4 text-sm font-semibold ">Name</th>
                <th className="py-3 px-4 text-sm font-semibold ">Member ID</th>
                <th className="py-3 px-4 text-sm font-semibold ">
                  Contact Info
                </th>
                <th className="py-3 px-4 text-sm font-semibold ">KYC Status</th>
                <th className="py-3 px-4 text-sm font-semibold ">
                  Contribution
                </th>
                <th className="py-3 px-4 text-sm font-semibold ">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((member, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-sm">{member.name}</td>
                  <td className="py-3 px-4 text-sm">{member.id}</td>
                  <td className="py-3 px-4 text-sm">{member.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        member.kyc === "Verified"
                          ? "bg-green-500/20 text-green-700"
                          : "bg-yellow-500/20 text-yellow-700"
                      }`}
                    >
                      {member.kyc}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-bold">
                    {member.contribution}
                  </td>
                  <td className="py-3 px-4 text-sm text-blue-500">
                    <a href="/members/view">View/Edit</a>
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
  );
};

export default Members;
