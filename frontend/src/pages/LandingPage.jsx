import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import LandingFooter from '../components/LandingFooter';

export default function LandingPage({ onNavigateDashboard, onNavigateLogin, onNavigateSignUp }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation Bar */}
      <LandingNavbar 
        onNavigateDashboard={onNavigateDashboard}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
      />

      {/* Hero Section */}
      <HeroSection 
        onGetStarted={onNavigateSignUp}
        onLogin={onNavigateLogin}
      />

      {/* Showcase Features Section (4 Cards) */}
      <FeaturesSection />

      {/* About Section */}
      <AboutSection onGetStarted={onNavigateSignUp} />

      {/* Contact Section */}
      <ContactSection onGetStarted={onNavigateSignUp} />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
