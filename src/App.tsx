import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import Layoutt from "./components/Layoutt";
import Dashboard from "./pages/Dashboard";
import Savings from "./pages/Savings";
import Shares from "./pages/Shares";
import Transactions from "./pages/Transactions";
import Kyc from "./pages/Kyc";
import Report from "./pages/Report";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

import Login from "./screens/Login/Login";
import VerifyLogin from "./screens/Login/VerifyLogin";
import ForgotPassword from "./screens/Login/ForgotPassword";
import Signup from "./screens/Register/Signup";

 // import CreateCooperative from "./pages/CreateCooperative";
import UpgradePlan from "./pages/UpgradePlan";
import { Toaster } from "sonner";
import VerifyEmail from "./screens/Register/VerifyEmail";
import Layout from "./screens/protected/layout";
import ChoosePlan from "./screens/CreateCooperative/SelectPlan";
import CooperativeSelection from "./screens/CreateCooperative/CooperativeSelection";
import RouteProtected from "./screens/Register/RouteProtected";
import CreateCooperative from "./screens/CreateCooperative/CreateCooperative";
import ProtectedRoute from "./screens/ProtectedRoute";
import BranchesManagement from "./screens/protected/branches/Branches";
import Members from "./screens/protected/members/Members";
import AddMember from "./screens/protected/members/AddMember";
import ViewMember from "./screens/protected/members/member/View";
import LoansPage from "./screens/protected/loans/Loans";
import LoanSettingsPage from "./screens/protected/loans/LoanPageSetting";
import SavingsSettingsPage from "./screens/protected/savings/SavingsSettingPage";
 
function App() {
  const location = useLocation();

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
      "/upgrade": "Upgrade Plan",
    };
    return titles[location.pathname] || "Dashboard";
  };

  // const getNavbarTitle = () => {
  //   switch (location.pathname) {
  //     case "/":
  //     case "/dashboard":
  //       return "Welcome, Admin";
  //     case "/members":
  //       return "Members Overview";
  //     case "/loans":
  //       return "Loans Management";
  //     case "/savings":
  //       return "Savings Management";
  //     case "/shares":
  //       return "Shares Management";
  //     case "/transactions":
  //       return "Transactions";
  //     case "/kyc":
  //       return "KYC";
  //     case "/report":
  //       return "Reports";
  //     case "/user":
  //       return "Users Management";
  //     case "/settings":
  //       return "System Settings";
  //     default:
  //       return "Dashboard";
  //   }
  // };

  const isAuthPage = [
    "/login",

    "/forgot-password",
    "/signup",
    "/verify-email",

    "/verify-login",
    "/cooperative-selection",
    "/create-cooperative",
    "/choose-plan",
  ].includes(location.pathname);

  return (
    <>
      {isAuthPage ? (
        <>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route path="*" element={<Navigate to="/login" />} />

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
          </Routes>
        </>
      ) : (
        <ProtectedRoute requireCooperative={true}>
          <Layout navbarTitle={getNavbarTitle()}>
            <Routes>
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/branches" element={<BranchesManagement />} />
              <Route path="/members" element={<Members />} />
              <Route path="/add-member" element={<AddMember />} />
              <Route path="/members/:id" element={<ViewMember />} />
              <Route path="/loans" element={<LoansPage />} />
              <Route path="/loan-product" element={<LoanSettingsPage />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/savings-product" element={<SavingsSettingsPage /> } /> 

              <Route path="/shares" element={<Shares />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/kyc" element={<Kyc />} />
              <Route path="/report" element={<Report />} />
              <Route path="/user" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/upgrade" element={<UpgradePlan />} />

              {/* <Route
              path="/cooperative-selection"
              element={<CooperativeSelection />}
            />
            <Route path="/create-cooperative" element={<CreateCooperative />} />
            <Route path="/choose-plan" element={<ChoosePlan />} /> */}

              {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
            </Routes>
          </Layout>
        </ProtectedRoute>
      )}

      {/* <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes> */}
    </>
  );
}

export default App;
