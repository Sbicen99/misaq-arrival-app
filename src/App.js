import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom"; // Corrected import
import Arrival from "./pages/arrivalPage";
import AdminPanel from "./pages/adminPanel";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Use `element` instead of `component` */}
        <Route path="/" element={<Arrival />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
