// app/(protected)/layout.tsx
"use client";

import { useState, type ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { getData } from "@/lib/storageHelper";

interface ProtectedLayoutProps {
  children: ReactNode;
  navbarTitle: string;        // ← ADD THIS LINE
}


export default function ProtectedLayout({ children, navbarTitle }: ProtectedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoading, isAuthenticated } = useAuth();
  const router = useNavigate();

  //check if user has verify login ? 

      const res = getData('isLoginVerified');
 


  // Redirect to login when the auth state is known and the user is unauthenticated.
  // Do this inside useEffect so we don't perform navigation during render
  // (which causes the "Cannot update a component while rendering a different component" error).
  useEffect(() => {



    if (!isLoading && !isAuthenticated) {
      router("/login", { replace: true });
    }



 

  if(res == false || res == null &&  !isLoading){ 
    router('verify-login', {replace:true})
  }
  

  }, [isLoading, isAuthenticated, router, res]);

  const getNavbarTitle = () => {
    // This matches your original App.tsx logic
    const pathname = window.location.pathname;
    switch (pathname) {
      case "/":
      case "/dashboard":
        return "Welcome, Admin";
      case "/members":
        return "Members Overview";
      case "/loans":
        return "Loans Management";
      case "/savings":
        return "Savings Management";
      case "/shares":
        return "Shares Management";
      case "/transactions":
        return "Transactions";
      case "/kyc":
        return "KYC";
      case "/report":
        return "Reports";
      case "/user":
        return "Users Management";
      case "/settings":
        return "System Settings";
      default:
        return "Dashboard";
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // While unauthenticated (and after loading completes) render nothing; the
  // effect above will perform the navigation to the login route.
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform bg-white transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-64`}
      >
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar
          setSidebarOpen={setSidebarOpen}
          title={getNavbarTitle()}
          rightContent={null}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto px-4 bg-gray-50">
          {children}
        </main>
      </div>

      {/* Toaster */}
      <Toaster position="top-right" richColors />
    </div>
  );
}