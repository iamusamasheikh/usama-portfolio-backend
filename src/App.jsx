import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider } from './context/PortfolioContext';

import Header from './components/Header';
import Hero from './components/Hero';
import TelemetryPanels from './components/TelemetryPanels';
import Services from './components/Services';
import PortfolioHub from './components/PortfolioHub';
import BudgetEstimator from './components/BudgetEstimator';
import WhyUsama from './components/WhyUsama';
import TimelineBio from './components/TimelineBio';
import Testimonials from './components/Testimonials';
import ContactSection from './components/ContactSection';
import ProjectModal from './components/ProjectModal';
import AdminDashboard from './components/AdminDashboard';
import ScriptInjector from './components/ScriptInjector';
import Footer from './components/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <ScriptInjector />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Hero />
            <TelemetryPanels />
            <Services />
            <PortfolioHub />
            <BudgetEstimator />
            <WhyUsama />
            <TimelineBio />
            <Testimonials />
            <ContactSection />
          </main>
          <Footer />

          {/* Modals */}
          <ProjectModal />
          <AdminDashboard />
        </div>
      </PortfolioProvider>
    </ThemeProvider>
  );
}
