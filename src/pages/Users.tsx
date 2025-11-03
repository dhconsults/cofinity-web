import { Settings } from "lucide-react";
import React, { useState } from "react";

interface SubAdminItem {
  name: string;
  email: string;
  role: string;
  access: string;
  status: string;
  lastLogin: string;
}

const Users: React.FC = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [accessFilter, setAccessFilter] = useState("");

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);

  const [newData, setNewData] = useState({
    name: "",
    email: "",
    role: "",
    access: "",
    status: "Active",
  });

  const [selectedAdmin, setSelectedAdmin] = useState<SubAdminItem | null>(null);

  const subAdmins: SubAdminItem[] = [
    {
      name: "Grace Okoro",
      email: "grace@dhcoop.com",
      role: "Loan Officer",
      access: "Limited",
      status: "Active",
      lastLogin: "Oct 17, 2025",
    },
    {
      name: "Musa Bello",
      email: "musa@dhcoop.com",
      role: "KYC Manager",
      access: "Full",
      status: "Active",
      lastLogin: "Oct 12, 2025",
    },
    {
      name: "Ifeoma Dan",
      email: "ifeoma@dhcoop.com",
      role: "Transaction Monitor",
      access: "Limited",
      status: "Inactive",
      lastLogin: "Oct 03, 2025",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const filtered = subAdmins.filter(
    (s) =>
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter ? s.role === roleFilter : true) &&
      (statusFilter ? s.status === statusFilter : true) &&
      (accessFilter ? s.access === accessFilter : true)
  );

  return (
    <div className="p-6 text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sub-Admin Management</h1>
          <p className="text-sm text-gray-500">
            Manage cooperative sub-admin accounts, access levels, and
            permissions.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <button
            onClick={() => setIsAddDrawerOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Add Sub-Admin
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm mt-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Roles</option>
          <option value="KYC Manager">KYC Manager</option>
          <option value="Loan Officer">Loan Officer</option>
          <option value="Transaction Monitor">Transaction Monitor</option>
          <option value="Savings Manager">Savings Manager</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={accessFilter}
          onChange={(e) => setAccessFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Access</option>
          <option value="Full">Full</option>
          <option value="Limited">Limited</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Name",
                "Email",
                "Role",
                "Access Level",
                "Status",
                "Last Login",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filtered.map((admin) => (
              <tr key={admin.email}>
                <td className="px-6 py-4 text-gray-800">{admin.name}</td>
                <td className="px-6 py-4 text-gray-500">{admin.email}</td>
                <td className="px-6 py-4">{admin.role}</td>
                <td className="px-6 py-4">{admin.access}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      admin.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {admin.lastLogin}
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setIsViewDrawerOpen(true);
                    }}
                    className="text-indigo-600 hover:underline"
                  >
                    View
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <Settings size={16} />
                  </button>
                  <button className="text-red-600 hover:underline">
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No Sub-Admins found.
            <div>
              <button
                onClick={() => setIsAddDrawerOpen(true)}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Add New Sub-Admin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Drawer */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full sm:w-[420px] md:w-[500px] h-full p-6 overflow-y-auto shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 border-b pb-2 border-gray-100">
              <h2 className="text-xl font-semibold">Add Sub-Admin</h2>
              <button
                onClick={() => setIsAddDrawerOpen(false)}
                className="text-gray-600 hover:text-black"
              >
                ✖
              </button>
            </div>

            <div className="space-y-4">
              <form action="">
                <input
                  name="name"
                  value={newData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-full"
                />
                <input
                  name="email"
                  value={newData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="border border-gray-300 rounded-md px-3 mb-4 py-2 w-full"
                />

                <select
                  name="role"
                  value={newData.role}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 mb-4 py-2 w-full"
                >
                  <option value="">Select Role</option>
                  <option value="KYC Manager">KYC Manager</option>
                  <option value="Loan Officer">Loan Officer</option>
                  <option value="Transaction Monitor">
                    Transaction Monitor
                  </option>
                  <option value="Savings Manager">Savings Manager</option>
                </select>

                <select
                  name="access"
                  value={newData.access}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 mb-4 py-2 w-full"
                >
                  <option value="">Select Access Level</option>
                  <option value="Full">Full</option>
                  <option value="Limited">Limited</option>
                </select>
              </form>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Drawer */}
      {isViewDrawerOpen && selectedAdmin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full sm:w-[420px] md:w-[500px] h-full p-6 overflow-y-auto shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold">Sub-Admin Details</h2>
              <button
                onClick={() => setIsViewDrawerOpen(false)}
                className="text-gray-600 hover:text-black"
              >
                ✖
              </button>
            </div>

            <div className="space-y-3">
              <p>
                <strong>Name:</strong> {selectedAdmin.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedAdmin.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedAdmin.role}
              </p>
              <p>
                <strong>Access Level:</strong> {selectedAdmin.access}
              </p>
              <p>
                <strong>Status:</strong> {selectedAdmin.status}
              </p>
              <p>
                <strong>Last Login:</strong> {selectedAdmin.lastLogin}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsViewDrawerOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                Update Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
