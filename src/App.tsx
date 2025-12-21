// App.tsx – Fixed: 404 renders only once (clean full-page, no Layout sidebar)
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

// Public / Auth pages
import Login from "./screens/Login/Login";
import VerifyLogin from "./screens/Login/VerifyLogin";
import ForgotPassword from "./screens/Login/ForgotPassword";
import Signup from "./screens/Register/Signup";
import VerifyEmail from "./screens/Register/VerifyEmail";

// Cooperative selection flow
import CooperativeSelection from "./screens/CreateCooperative/CooperativeSelection";
import CreateCooperative from "./screens/CreateCooperative/CreateCooperative";
import ChoosePlan from "./screens/CreateCooperative/SelectPlan";

// Protected layout & pages
import Layout from "./screens/protected/layout";
import ProtectedRoute from "./screens/ProtectedRoute";
import RouteProtected from "./screens/Register/RouteProtected";

// All protected pages
import DashboardPage from "./screens/protected/dashboard/Dashboard";
import BranchesManagement from "./screens/protected/branches/Branches";
import Members from "./screens/protected/members/Members";
import AddMember from "./screens/protected/members/AddMember";
import ViewMember from "./screens/protected/members/member/View";
import LoansPage from "./screens/protected/loans/Loans";
import CreateLoanPage from "./screens/protected/loans/CreateLoan";
import LoanDetailPage from "./screens/protected/loans/LoanViewDetails";
import LoanSettingsPage from "./screens/protected/loans/LoanPageSetting";
import Savings from "./screens/protected/savings/Savings";
import SavingsSettingsPage from "./screens/protected/savings/SavingsSettingPage";
import SavingsAccountDetail from "./screens/protected/savings/SavingsAccountDetail";
import MemberShareAccountsPage from "./screens/protected/shares/Shares";
import SharesPlansPage from "./screens/protected/shares/SharesProductSetting";
import TransactionsPage from "./screens/protected/transactions/Transactions";
import Kyc from "./pages/Kyc";
import ReportsPage from "./screens/protected/ReportPage/ReportPage";
import TenantUsersPage from "./screens/protected/users/Users";
import Settings from "./screens/protected/settings/Settings";
import WalletPage from "./screens/protected/wallets/Wallet";
import ProfilePage from "./screens/protected/proflle/Profile";
import ExpensesManagementPage from "./screens/protected/expenses/Expenses";
import AuditLogPage from "./screens/protected/auditLog/AuditLog";
import DividendsPage from "./screens/protected/dividends/Dividends";
import UpcomingPaymentsPage from "./screens/protected/upcomingPayments/UpcomingPaymentsPage";
import LoanRepaymentPage from "./screens/protected/loanRepayment/LoanRepaymentPage";

// Billing pages
import BillingPage from "./screens/protected/billing/Billing";
import UpgradePlanPage from "./screens/protected/billing/Upgrade";

// 404 Page (full page, no Layout)
import NotFound from "./screens/NotFound";

function App() {
  const location = useLocation();

  const authPaths = [
    "/login",
    "/forgot-password",
    "/signup",
    "/verify-email",
    "/verify-login",
    "/cooperative-selection",
    "/create-cooperative",
    "/choose-plan",
  ];

  const isAuthPage = authPaths.includes(location.pathname);

  const getNavbarTitle = () => {
    const titles: Record<string, string> = {
      "/dashboard": "Welcome Back",
      "/members": "Members Overview",
      "/loans": "Loans Management",
      "/savings": "Savings Management",
      "/shares": "Shares & Investments",
      "/transactions": "All Transactions",
      "/kyc": "KYC Verification",
      "/report": "Reports & Analytics",
      "/user": "Users Management",
      "/settings": "System Settings",
      "/billing": "Billing & Subscription",
      "/billing/upgrade": "Upgrade Plan",
    };
    return titles[location.pathname] || "Dashboard";
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      {/* Auth / Public Routes – no Layout */}
      {isAuthPage ? (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route
            path="/verify-login"
            element={
              <RouteProtected>
                <VerifyLogin />
              </RouteProtected>
            }
          />
          <Route
            path="/cooperative-selection"
            element={
              <RouteProtected>
                <CooperativeSelection />
              </RouteProtected>
            }
          />
          <Route
            path="/create-cooperative"
            element={
              <RouteProtected>
                <CreateCooperative />
              </RouteProtected>
            }
          />
          <Route
            path="/choose-plan"
            element={
              <RouteProtected>
                <ChoosePlan />
              </RouteProtected>
            }
          />

          {/* 404 for auth section */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        /* Protected Routes – wrapped in Layout */
        <ProtectedRoute requireCooperative={true}>
          <Layout navbarTitle={getNavbarTitle()}>
            <Routes>
              {/* All protected pages */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/branches" element={<BranchesManagement />} />
              <Route path="/members" element={<Members />} />
              <Route path="/add-member" element={<AddMember />} />
              <Route path="/members/:id" element={<ViewMember />} />

              <Route path="/loans" element={<LoansPage />} />
              <Route path="/loans/create" element={<CreateLoanPage />} />
              <Route path="/loans/:id" element={<LoanDetailPage />} />
              <Route path="/loan-products" element={<LoanSettingsPage />} />

              <Route path="/savings" element={<Savings />} />
              <Route path="/savings-products" element={<SavingsSettingsPage />} />
              <Route path="/savings/accounts/:id" element={<SavingsAccountDetail />} />

              <Route path="/shares" element={<MemberShareAccountsPage />} />
              <Route path="/shares-plan" element={<SharesPlansPage />} />

              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/kyc" element={<Kyc />} />
              <Route path="/report" element={<ReportsPage />} />
              <Route path="/user" element={<TenantUsersPage />} />
              <Route path="/settings" element={<Settings />} />

              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              <Route path="/expenses" element={<ExpensesManagementPage />} />
              <Route path="/audit-logs" element={<AuditLogPage />} />
              <Route path="/dividends" element={<DividendsPage />} />

              <Route path="/upcoming-payments" element={<UpcomingPaymentsPage />} />
              <Route path="/loan-repayments" element={<LoanRepaymentPage />} />

              {/* Billing */}
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/billing/upgrade" element={<UpgradePlanPage />} />

              {/* 404 inside protected area – renders inside Layout */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      )}

      {/* Global fallback 404 – renders full page (no Layout) for any unmatched route */}
      {/* This will only trigger if the URL doesn't match any of the above blocks */}
      {/* <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes> */}


    </>
  );
}

export default App;