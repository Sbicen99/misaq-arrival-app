import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Use BrowserRouter (not Router)
import Arrival from "./pages/arrivalPage";
import AdminPanel from "./pages/adminPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Arrival />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
