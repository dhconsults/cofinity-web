import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  FileText,
  Download,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Bar,
  BarChart,
} from "recharts";
import jsPDF from "jspdf";
import Papa from "papaparse";

const Report = () => {
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  const stats = [
    {
      title: "Total Users",
      value: "2,450",
      change: "+5%",
      icon: <Users size={22} />,
      color: "text-blue-500",
    },
    {
      title: "Transactions",
      value: "8,932",
      change: "+12%",
      icon: <TrendingUp size={22} />,
      color: "text-green-500",
    },
    {
      title: "Active Loans",
      value: "1,102",
      change: "-3%",
      icon: <Activity size={22} />,
      color: "text-yellow-500",
    },
    {
      title: "Reports Generated",
      value: "842",
      change: "+2%",
      icon: <FileText size={22} />,
      color: "text-purple-500",
    },
  ];

  const trendData = [
    { month: "Jan", users: 400 },
    { month: "Feb", users: 600 },
    { month: "Mar", users: 800 },
    { month: "Apr", users: 750 },
    { month: "May", users: 900 },
    { month: "Jun", users: 1200 },
  ];

  const pieData = [
    { name: "Loans", value: 40 },
    { name: "Savings", value: 30 },
    { name: "Transactions", value: 20 },
    { name: "Others", value: 10 },
  ];

  const barData = [
    { category: "Loans", revenue: 45000 },
    { category: "Savings", revenue: 30000 },
    { category: "Investments", revenue: 25000 },
    { category: "Transfers", revenue: 15000 },
  ];

  const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444"];

  const reports = [
    {
      id: "RPT-001",
      title: "Monthly Financial Summary",
      date: "12 Oct 2025",
      status: "Completed",
    },
    {
      id: "RPT-002",
      title: "User Growth Analysis",
      date: "14 Oct 2025",
      status: "Pending",
    },
    {
      id: "RPT-003",
      title: "Loan Distribution Report",
      date: "18 Oct 2025",
      status: "Completed",
    },
    {
      id: "RPT-004",
      title: "Revenue Breakdown",
      date: "21 Oct 2025",
      status: "In Progress",
    },
    {
      id: "RPT-005",
      title: "KYC Verification Audit",
      date: "25 Oct 2025",
      status: "Completed",
    },
    {
      id: "RPT-006",
      title: "Savings Trend Report",
      date: "30 Oct 2025",
      status: "Pending",
    },
  ];

  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = reports.slice(indexOfFirst, indexOfLast);

  // Export CSV
  const exportCSV = () => {
    const csv = Papa.unparse(reports);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Reports.csv";
    link.click();
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("System Reports", 20, 20);
    doc.setFont("helvetica", "normal");
    let y = 40;
    reports.forEach((r) => {
      doc.text(`ID: ${r.id}`, 20, y);
      doc.text(`Title: ${r.title}`, 60, y);
      doc.text(`Date: ${r.date}`, 130, y);
      doc.text(`Status: ${r.status}`, 180, y);
      y += 10;
    });
    doc.save("Reports.pdf");
  };

  return (
    <div className="p-4 text-black">
      {/* Header and Export Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
          >
            <Download size={16} /> CSV
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
          >
            <Download size={16} /> PDF
          </button>
          <button
            onClick={() => setShowTable(!showTable)}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <BarChart3 size={16} />
            {showTable ? "Hide Reports" : "View Reports"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((card, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center hover:scale-[1.02] transition-all duration-300"
          >
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
              <span className={`${card.color} text-xs font-semibold`}>
                {card.change} this month
              </span>
            </div>
            <div
              className={`p-3 rounded-lg bg-gray-50 ${card.color} bg-opacity-10`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            User Growth Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Report Category Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Extra Analytics Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Revenue Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="category" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#111827" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reports Table (toggle) */}
      {showTable && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Report ID</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {report.id}
                  </td>
                  <td className="px-6 py-3">{report.title}</td>
                  <td className="px-6 py-3">{report.date}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : report.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4 p-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
