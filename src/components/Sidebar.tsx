import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

import {
  Home,
  Users,
  DollarSign,
  FileText,
  Settings,
  PiggyBank,
  Coins,
  Receipt,
  Shield,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, href: "/dashboard" },

    { name: "Wallet", icon: <Home size={18} />, href: "/wallet" },

    { name: "Branches", icon: <Home size={18} />, href: "/branches" },
    { name: "Members", icon: <Users size={18} />, href: "/members" },
    { name: "Loans", icon: <DollarSign size={18} />, href: "/loans" },
    { name: "Savings", icon: <PiggyBank size={18} />, href: "/savings" },
    { name: "Shares", icon: <Coins size={18} />, href: "/shares" },
    { name: "Dividends", icon: <Coins size={18} />, href: "/dividends" },
    {
      name: "Upcoming Payments",
      icon: <DollarSign size={18} />,
      href: "/upcoming-payments",
    },
    {
      name: "Loan Repayment",
      icon: <DollarSign size={18} />,
      href: "/loan-repayments",
    },

    {
      name: "Transactions",
      icon: <Receipt size={18} />,
      href: "/transactions",
    },
    { name: "Expenses", icon: <Shield size={18} />, href: "/expenses" },
    { name: "Broadcast Message", icon: <Home size={18} />, href: "/broadcast" },

    { name: "Report", icon: <FileText size={18} />, href: "/report" },
    { name: "Users", icon: <Users size={18} />, href: "/user" },
    { name: "Settings", icon: <Settings size={18} />, href: "/settings" },
  ];

  const handleLogout = () => {
    // Clear authentication/session data
    localStorage.removeItem("token"); // example: remove JWT token
    // Optionally, clear other user data if needed
    localStorage.removeItem("user");

    // Navigate to login page
    navigate("/login", { replace: true });
  };

  return (
    <>
      <aside
        className={`bg-black text-white w-64 p-6 flex flex-col justify-between fixed h-screen lg:static inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div>
          <div className="hidden lg:flex items-center gap-3 mb-8">
            <img
              className="w-40 h-auto"
              src="/images/Cofinitylogo6.png"
              alt=""
            />

            {/* <svg
              className="w-8 h-8 text-primary"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z"
                fill="currentColor"
              />
            </svg>
            <h1 className="text-xl font-bold">Cofinity</h1> */}
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition ${
                    isActive
                      ? "bg-gray-800 text-gray-50"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span
                    className={`${
                      isActive ? "text-gray-50" : "text-gray-500"
                    } transition`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800 transition font-semibold flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Log out
        </button>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
