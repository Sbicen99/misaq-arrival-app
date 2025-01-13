import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  HashRouter,
} from "react-router-dom"; // Use BrowserRouter (not Router)
import Arrival from "./pages/arrivalPage";
import AdminPanel from "./pages/adminPanel";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" component={Arrival} />
        <Route path="/admin" component={AdminPanel} />
      </Routes>
    </HashRouter>
  );
}

export default App;
