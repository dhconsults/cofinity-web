import { Routes, Route, useLocation } from "react-router-dom";
import Layoutt from "./components/Layoutt";
import Dashboard from "./pages/Dashboard";
import Member from "./pages/Member";
import Loans from "./pages/Loans";
import View from "./pages/Member/View";
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
      case "/settings":
        return "System Settings";
      case "/members/view":
        return "Edit Member";
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
        {/* <Route path="/settings" element={<Settings />} /> */}
      </Routes>
    </Layoutt>
  );
}

export default App;
