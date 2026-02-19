import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import IntakeHub from './pages/IntakeHub';
import ClinicalDashboard from './pages/ClinicalDashboard';
import DeepDiveConsole from './pages/DeepDiveConsole';
import LandingPage from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import Layout from './components/shared/Layout';
import SettingsPage from './pages/SettingsPage';
import { gsap } from 'gsap';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Main App Layout Routes */}
        <Route path="/intake" element={<Layout><IntakeHub /></Layout>} />
        <Route path="/dashboard" element={<Layout><ClinicalDashboard /></Layout>} />
        <Route path="/deep-dive" element={<Layout><DeepDiveConsole /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
