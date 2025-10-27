// src/App.jsx - FIXED VERSION
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

// Import your components with correct paths (they're in src/components/)
import AuthPage from './components/AuthPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SoilRecommendation from './components/SoilRecommendation';
import IrrigationForecast from './components/IrrigationForecast';
import GovtSchemes from './components/GovtSchemes';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="soil" element={<SoilRecommendation />} />
            <Route path="irrigation-forecast" element={<IrrigationForecast />} />
            <Route path="govt-schemes" element={<GovtSchemes />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;