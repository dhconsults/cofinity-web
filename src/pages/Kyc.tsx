import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Search,
  Eye,
} from "lucide-react";

interface KycUser {
  name: string;
  email: string;
  id: string;
  status: "Verified" | "Pending" | "Rejected";
  joinedDate: string;
  documents: string[];
  phone: string;
  address: string;
}

const KYC = () => {
  const [selectedUser, setSelectedUser] = useState<KycUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [tableView, setTableView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const kycData: KycUser[] = [
    {
      name: "Sophia Clark",
      email: "sophia@example.com",
      id: "KYC-101",
      status: "Pending",
      joinedDate: "21-01-2025",
      documents: ["ID Card", "Utility Bill"],
      phone: "+234 812 555 3344",
      address: "24 Main Street, Lagos",
    },
    {
      name: "Liam Foster",
      email: "liam@example.com",
      id: "KYC-102",
      status: "Verified",
      joinedDate: "12-02-2025",
      documents: ["ID Card", "Bank Statement"],
      phone: "+234 902 884 4455",
      address: "15 Victoria Ave, Abuja",
    },
    {
      name: "Emma Brown",
      email: "emma@example.com",
      id: "KYC-103",
      status: "Rejected",
      joinedDate: "09-03-2025",
      documents: ["ID Card"],
      phone: "+234 701 223 1190",
      address: "2 Opebi Rd, Lagos",
    },
    {
      name: "Noah Reed",
      email: "noah@example.com",
      id: "KYC-104",
      status: "Verified",
      joinedDate: "28-04-2025",
      documents: ["Passport", "Utility Bill"],
      phone: "+234 806 908 2213",
      address: "12 Allen Ave, Lagos",
    },
  ];

  const stats = [
    {
      title: "Total KYC",
      value: "1,245",
      change: "+8%",
      icon: <Users size={20} />,
      color: "text-green-500",
    },
    {
      title: "Verified",
      value: "842",
      change: "+5%",
      icon: <CheckCircle size={20} />,
      color: "text-green-500",
    },
    {
      title: "Pending",
      value: "303",
      change: "-2%",
      icon: <Clock size={20} />,
      color: "text-yellow-500",
    },
    {
      title: "Rejected",
      value: "100",
      change: "+1%",
      icon: <AlertTriangle size={20} />,
      color: "text-red-500",
    },
  ];

  // Pagination
  const totalPages = Math.ceil(kycData.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = kycData.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="p-4 text-black">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {stats.map((card, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md flex flex-col justify-between h-36 hover:scale-105 transition-transform duration-300"
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

      {/* Header Actions */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search KYC by name, ID or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none text-sm"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setTableView(!tableView)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            {tableView ? "Back to Cards" : "View All"}
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition">
            + Add New KYC
          </button>
        </div>
      </div>

      {/* Conditional View */}
      {!tableView ? (
        // === CARD VIEW ===
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {kycData.map((user) => (
            <div
              key={user.id}
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 relative group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=000000&color=ffffff`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <p className="text-gray-600">
                  <strong>ID:</strong> {user.id}
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {user.phone}
                </p>
                <p className="text-gray-600 truncate">
                  <strong>Address:</strong> {user.address}
                </p>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === "Verified"
                      ? "bg-green-100 text-green-700"
                      : user.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>

                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowModal(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white p-1.5 rounded-full"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // === TABLE VIEW ===
        <div className="mt-8 overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{user.email}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === "Verified"
                          ? "bg-green-100 text-green-700"
                          : user.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-700">{user.joinedDate}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="text-gray-700 hover:text-black"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end items-center p-4 border-t">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">KYC Details</h2>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  selectedUser.name
                )}&background=000000&color=ffffff`}
                alt={selectedUser.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>ID:</strong> {selectedUser.id}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address}
              </p>
              <p>
                <strong>Joined:</strong> {selectedUser.joinedDate}
              </p>
              <p>
                <strong>Documents:</strong> {selectedUser.documents.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYC;
