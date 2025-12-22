import React, { useState, useMemo } from "react";
import {
  Info,
  Save,
  Users,
  Landmark,
  PiggyBank,
  IdCard,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  CreditCard,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserSavings from "./UserSavings";
import UserLoan from "./Userloan";

const View = () => {
  const [image, setImage] = useState<string>(
    "/public/images/ppic.jpg" // default profile
  );
  const [showModal, setShowModal] = useState(false);

  // Function to handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const [activeTab, setActiveTab] = useState("organization");

  const [form, setForm] = useState({
    firstName: "Rhaenyra",
    secondName: "Targaryen",
    lastName: "Beargar",
    dateOfBirth: "1988-09-26",
    placeOfBirth: "Delta State",
    nin: "GER10654",
    maritalStatus: "Single",
    religion: "Christian",
    employementStatus: "Employed",
    occupation: "Businesswoman",
    phone1: "09056789327",
    phone2: "09022553388",
    email: "nicholasswatz@gmail.com",
    address: "390 Market Street, Suite 200",
    lga: "Ughelli North",
    state: "Delta State",
    nationality: "Nigerian",
    accountNo: "0123456789",
    accountType: "Premium Savings",
    memberId: "MS-23-23",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Saved:", form);
    alert("Profile updated successfully!");
  };

  const tabs = [
    { key: "organization", label: "Personal Info" },
    { key: "banking", label: "Contact Info" },
    { key: "fees", label: "Address Info" },
    { key: "roles", label: "Account Details" },
    { key: "notifications", label: "History" },
    { key: "security", label: "Savings" },
    { key: "theme", label: "Loan" },
  ];

  const [filters, setFilters] = useState({
    search: "",
    type: "All",
    fromDate: "",
    toDate: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const transactions = [
    {
      id: "TXN-20251101-001",
      type: "Deposit",
      amount: 2500,
      date: "2025-11-01",
      time: "10:45 AM",
      status: "Completed",
      channel: "Bank Transfer",
    },
    {
      id: "TXN-20251102-002",
      type: "Withdrawal",
      amount: 1200.5,
      date: "2025-11-02",
      time: "3:20 PM",
      status: "Pending",
      channel: "ATM",
    },
    {
      id: "TXN-20251103-003",
      type: "Deposit",
      amount: 3500.75,
      date: "2025-11-03",
      time: "9:10 AM",
      status: "Completed",
      channel: "Mobile App",
    },
    {
      id: "TXN-20251104-004",
      type: "Transfer",
      amount: 1000,
      date: "2025-11-04",
      time: "12:15 PM",
      status: "Failed",
      channel: "Online Banking",
    },
    {
      id: "TXN-20251105-005",
      type: "Deposit",
      amount: 7000,
      date: "2025-11-05",
      time: "1:00 PM",
      status: "Completed",
      channel: "POS",
    },
    {
      id: "TXN-20251106-006",
      type: "Withdrawal",
      amount: 2300,
      date: "2025-11-06",
      time: "2:15 PM",
      status: "Completed",
      channel: "ATM",
    },
    {
      id: "TXN-20251107-007",
      type: "Transfer",
      amount: 900,
      date: "2025-11-07",
      time: "9:30 AM",
      status: "Pending",
      channel: "Online Banking",
    },
    {
      id: "TXN-20251108-008",
      type: "Deposit",
      amount: 1500,
      date: "2025-11-08",
      time: "10:20 AM",
      status: "Completed",
      channel: "Bank Transfer",
    },
    {
      id: "TXN-20251109-009",
      type: "Transfer",
      amount: 2200,
      date: "2025-11-09",
      time: "3:10 PM",
      status: "Completed",
      channel: "Mobile App",
    },
    {
      id: "TXN-20251110-010",
      type: "Withdrawal",
      amount: 500,
      date: "2025-11-10",
      time: "8:50 AM",
      status: "Failed",
      channel: "ATM",
    },
  ];

  // --- Filtering Logic ---
  const filteredTxns = useMemo(() => {
    return transactions.filter((txn) => {
      const matchSearch =
        txn.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        txn.type.toLowerCase().includes(filters.search.toLowerCase()) ||
        txn.channel.toLowerCase().includes(filters.search.toLowerCase());

      const matchType = filters.type === "All" || txn.type === filters.type;
      const matchFrom = !filters.fromDate || txn.date >= filters.fromDate;
      const matchTo = !filters.toDate || txn.date <= filters.toDate;

      return matchSearch && matchType && matchFrom && matchTo;
    });
  }, [filters, transactions]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredTxns.length / pageSize);
  const paginatedTxns = filteredTxns.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const showingFrom = (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, filteredTxns.length);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="">
      {/* Banner */}
      <div className="b"></div>
      <div className="relative h-40 bg-gradient-to-r from-gray-700 to-black rounded-t-xl mt-4">
        <img
          src="/public/images/bgpic3.jpg"
          alt="Balance background"
          className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
        />
        <div className="absolute inset-0 bg-black opacity-70 rounded-t-xl"></div>
        {/* Profile Image */}
        <div className="absolute -bottom-12 left-6">
          <div className="relative group">
            <img
              src={image}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white object-cover cursor-pointer transition-transform hover:scale-105"
              onClick={() => setShowModal(true)}
            />
            {/* Edit icon overlay */}
            <label
              htmlFor="upload"
              className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
            >
              ✎
            </label>
            <input
              id="upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-14 pb-6 px-6 text-left">
        <h2 className="text-xl font-semibold text-gray-900">
          Rhaenyra Targaryen
        </h2>
        <p className="text-gray-500 text-sm">MS-23-23</p>
      </div>

      {/* Animated Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="relative bg-white p-4 rounded-lg shadow-lg"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={image}
                alt="Large Profile"
                className="w-80 h-80 object-cover rounded-full border-4 border-gray-300"
              />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-black text-xl font-bold"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105">
          <Users className="text-gray-700 mb-2" size={20} />
          <p className="text-sm text-gray-800">Current account balance</p>
          <h1 className="text-2xl text-black font-bold mt-2">$294,000,000</h1>
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
          <p className="text-sm  text-gray-800">Total withdraw</p>
          <h1 className="text-2xl text-black font-bold mt-2">101</h1>
          <span className="text-red-500 text-xs font-medium">
            -3% This Month
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="md:w-64 w-full bg-white border-b md:border-b-0 md:border-r shadow-sm rounded-lg">
          <div className="flex items-center gap-2 px-5 py-4 border-b md:border-none">
            <Info className="text-gray-800" />
            <h2 className="font-semibold text-gray-800 text-sm md:text-base">
              User Profile
            </h2>
          </div>

          <nav className="flex overflow-x-auto md:overflow-visible border-b md:border-none">
            <div className="flex md:flex-col w-max md:w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 text-sm text-left whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? "bg-gray-100 border-l-4 border-gray-700 text-gray-800 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="hidden md:block mt-auto px-5 py-4 border-t">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:px-6 md:py-0 overflow-y-auto space-y-10">
          {activeTab === "organization" && (
            <Section title="Personal Information">
              <InputField
                label="First Name"
                value={form.firstName}
                onChange={(v) => handleChange("firstName", v)}
              />
              <InputField
                label="Second Name"
                value={form.secondName}
                onChange={(v) => handleChange("secondName", v)}
              />
              <InputField
                label="Last Name"
                value={form.lastName}
                onChange={(v) => handleChange("lastName", v)}
              />
              <InputField
                type="date"
                label="Date of Birth"
                value={form.dateOfBirth}
                onChange={(v) => handleChange("dateOfBirth", v)}
              />
              <InputField
                label="Place of Birth"
                value={form.placeOfBirth}
                onChange={(v) => handleChange("placeOfBirth", v)}
              />
              <InputField
                label="National ID Number"
                value={form.nin}
                onChange={(v) => handleChange("nin", v)}
              />
              <InputField
                label="Marital Status"
                value={form.maritalStatus}
                onChange={(v) => handleChange("maritalStatus", v)}
              />
              <InputField
                label="Religion"
                value={form.religion}
                onChange={(v) => handleChange("religion", v)}
              />
              <InputField
                label="Religion"
                value={form.employementStatus}
                onChange={(v) => handleChange("employementStatus", v)}
              />
              <InputField
                label="Religion"
                value={form.occupation}
                onChange={(v) => handleChange("occupation", v)}
              />
            </Section>
          )}

          {activeTab === "banking" && (
            <Section title="Contact Information">
              <InputField
                label="Phone 1"
                value={form.phone1}
                onChange={(v) => handleChange("phone1", v)}
              />
              <InputField
                label="Phone 2"
                value={form.phone2}
                onChange={(v) => handleChange("phone2", v)}
              />
              <InputField
                type="email"
                label="Email Address"
                value={form.email}
                onChange={(v) => handleChange("email", v)}
              />
            </Section>
          )}

          {activeTab === "fees" && (
            <Section title="Address Information">
              <InputField
                label="Street Address"
                value={form.address}
                onChange={(v) => handleChange("address", v)}
              />
              <InputField
                label="Local Govt Area"
                value={form.lga}
                onChange={(v) => handleChange("lga", v)}
              />
              <InputField
                label="State"
                value={form.state}
                onChange={(v) => handleChange("state", v)}
              />
              <InputField
                label="Nationality"
                value={form.nationality}
                onChange={(v) => handleChange("nationality", v)}
              />
            </Section>
          )}

          {activeTab === "roles" && (
            <Section title="Account Details">
              <InputField
                label="Account Number"
                value={form.accountNo}
                onChange={(v) => handleChange("accountNo", v)}
              />
              <InputField
                label="Account Type"
                value={form.accountType}
                onChange={(v) => handleChange("accountType", v)}
              />
              <InputField
                label="Member ID"
                value={form.memberId}
                onChange={(v) => handleChange("memberId", v)}
              />
            </Section>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <h2 className="text-xl font-bold text-gray-800">
                    Transaction History
                  </h2>
                  <button className="text-sm text-blue-600 hover:underline">
                    Export CSV
                  </button>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-3 md:items-end mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by ID, type, or channel..."
                      className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Type
                    </label>
                    <select
                      className="border border-gray-300 rounded-md p-2 text-sm text-gray-600 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                      value={filters.type}
                      onChange={(e) =>
                        setFilters({ ...filters, type: e.target.value })
                      }
                    >
                      <option>All</option>
                      <option>Deposit</option>
                      <option>Withdrawal</option>
                      <option>Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      From
                    </label>
                    <input
                      type="date"
                      className="border border-gray-300 rounded-md p-2 text-sm text-gray-800 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                      value={filters.fromDate}
                      onChange={(e) =>
                        setFilters({ ...filters, fromDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      To
                    </label>
                    <input
                      type="date"
                      className="border border-gray-300 rounded-md p-2 text-sm text-gray-800 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                      value={filters.toDate}
                      onChange={(e) =>
                        setFilters({ ...filters, toDate: e.target.value })
                      }
                    />
                  </div>

                  <button
                    onClick={() =>
                      setFilters({
                        search: "",
                        type: "All",
                        fromDate: "",
                        toDate: "",
                      })
                    }
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200 transition"
                  >
                    <Filter className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b text-gray-600 bg-gray-50">
                        <th className="py-3 px-4 font-semibold">Type</th>
                        <th className="py-3 px-4 font-semibold">
                          Transaction ID
                        </th>
                        <th className="py-3 px-4 font-semibold">Channel</th>
                        <th className="py-3 px-4 font-semibold">Date & Time</th>
                        <th className="py-3 px-4 font-semibold">Amount</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTxns.length > 0 ? (
                        paginatedTxns.map((txn, idx) => (
                          <tr
                            key={idx}
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 flex items-center gap-2 font-medium text-gray-800">
                              {txn.type === "Deposit" ? (
                                <ArrowDownRight className="text-green-500 w-4 h-4" />
                              ) : txn.type === "Withdrawal" ? (
                                <ArrowUpRight className="text-red-500 w-4 h-4" />
                              ) : (
                                <CreditCard className="text-blue-500 w-4 h-4" />
                              )}
                              {txn.type}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {txn.id}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {txn.channel}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {txn.date}{" "}
                              <span className="text-gray-400">
                                ({txn.time})
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-gray-800">
                              ₦{txn.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge status={txn.status} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center text-gray-500 py-6 italic"
                          >
                            No transactions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredTxns.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-5 text-sm text-gray-600 gap-3">
                    <p>
                      Showing <strong>{showingFrom}</strong>–
                      <strong>{showingTo}</strong> of{" "}
                      <strong>{filteredTxns.length}</strong> transactions
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="p-2 rounded-md border disabled:opacity-40 hover:bg-gray-100"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <span className="px-3 py-1 border rounded-md bg-gray-50">
                        Page {page} of {totalPages}
                      </span>

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="p-2 rounded-md border disabled:opacity-40 hover:bg-gray-100"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div>
              <UserSavings />
            </div>
          )}

          {/* Theme & Customization */}
          {activeTab === "theme" && (
            <div>
              <UserLoan />
            </div>
          )}
        </main>

        <button
          onClick={handleSave}
          className="md:hidden fixed bottom-4 right-4 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800"
        >
          <Save size={20} />
        </button>
      </div>
    </div>
  );
};

/* --- Section Wrapper --- */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

/* --- Input Field --- */
function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base =
    "px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1 w-fit";
  switch (status) {
    case "Completed":
      return (
        <span className={`${base} bg-green-100 text-green-700`}>
          <Clock size={12} /> Completed
        </span>
      );
    case "Pending":
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>
          <Clock size={12} /> Pending
        </span>
      );
    case "Failed":
      return (
        <span className={`${base} bg-red-100 text-red-700`}>
          <Clock size={12} /> Failed
        </span>
      );
    default:
      return (
        <span className={`${base} bg-gray-100 text-gray-700`}>
          <Clock size={12} /> Unknown
        </span>
      );
  }
}

export default View;
