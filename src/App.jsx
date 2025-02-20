import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import AccountsPayable from "./accountspayable/AccountsPayable";
import AccountsReceivable from "./accountsreceivable/AccountsReceivable";
import Reports from "./reports/Reports";
import Payments from "./payments/Payments";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payables" element={<AccountsPayable />} />
          <Route path="/receivables" element={<AccountsReceivable />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/payments" element={<Payments/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
