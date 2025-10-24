import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage.jsx";
import Layout from "./components/Layout.jsx";
import Dashboard from "./components/Dashboard.jsx";
import SoilRecommendation from "./components/SoilRecommendation.jsx";
import IrrigationForecast from "./components/IrrigationForecast.jsx";

function App() {
  return (
    <div className="w-screen min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/soil" element={<SoilRecommendation />} />
            <Route path="/irrigation-forecast" element={<IrrigationForecast />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;