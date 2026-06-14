import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Pricing from './pages/Pricing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AppPage from './pages/AppPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/app" element={<AppPage />} />
    </Routes>
  );
}

export default App;
