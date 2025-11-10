import { Routes, Route, useLocation } from "react-router-dom";
import Layoutt from "./components/Layoutt";
import Dashboard from "./pages/Dashboard";
import Member from "./pages/Member";
import Loans from "./pages/Loans";
import View from "./pages/Member/View";
// import Settings from "./pages/Settings";
import AddNewMembers from "./pages/Member/AddNewMembers";
import LoanApplicationForm from "./pages/Member/LoanApplicationForm";
import Savings from "./pages/Savings";
import Shares from "./pages/Shares";
import Transactions from "./pages/Transactions";
import LoanSettings from "./pages/Member/LoanSettings";
import AddNewSharePlan from "./pages/Member/AddNewSharePlan";
import RecordDeposit from "./pages/Member/RecordDeposit";
import RecordWithdrawal from "./pages/Member/RecordWithdrawal";

function App() {
  const location = useLocation();

  // Dynamic titles per page
  const getNavbarTitle = () => {
    switch (location.pathname) {
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
      case "/settings":
        return "System Settings";
      case "/members/view":
        return "Edit Member";
      case "/members/AddNewMembers":
        return "Add New Members";
      case "/loans/LoanApplicationForm":
        return "Loan Application Form";
      default:
        return "Dashboard";
    }
  };

  return (
    <Layoutt navbarTitle={getNavbarTitle()}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Member />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/members/view" element={<View />} />
        <Route path="/members/AddNewMembers" element={<AddNewMembers />} />
        <Route path="/loans/LoanSettings" element={<LoanSettings />} />
        <Route path="/Share/AddNewShareplan" element={<AddNewSharePlan />} />
        <Route
          path="/loans/LoanApplicationForm"
          element={<LoanApplicationForm />}
        />
        <Route path="/Savings/RecordDeposit" element={<RecordDeposit />} />
        <Route
          path="/Savings/RecordWithdrawal"
          element={<RecordWithdrawal />}
        />
        <Route path="/savings" element={<Savings />} />
        <Route path="/shares" element={<Shares />} />
        <Route path="/transactions" element={<Transactions />} />

        {/* <Route path="/settings" element={<Settings />} /> */}

        {/* <Route path="/settings" element={<Settings />} /> */}
      </Routes>
    </Layoutt>
  );
}

export default App;
