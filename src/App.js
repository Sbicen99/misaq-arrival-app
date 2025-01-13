import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom"; // Corrected import
import Arrival from "./pages/arrivalPage";
import AdminPanel from "./pages/adminPanel";

function App() {
  return (
    <div>
      <Arrival></Arrival>
      <AdminPanel></AdminPanel>
    </div>
  );
}

export default App;
