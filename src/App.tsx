import { Routes, Route, useLocation } from "react-router-dom";
import Layoutt from "./components/Layoutt";
import Dashboard from "./pages/Dashboard";
import Member from "./pages/Member";
import Loans from "./pages/Loans";
import Savings from "./pages/Savings";
import Shares from "./pages/Shares";
import Transactions from "./pages/Transactions";
// import Settings from "./pages/Settings";

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
        <Route path="/savings" element={<Savings />} />
        <Route path="/shares" element={<Shares />} />
        <Route path="/transactions" element={<Transactions />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Routes>
    </Layoutt>
  );
}

export default App;
