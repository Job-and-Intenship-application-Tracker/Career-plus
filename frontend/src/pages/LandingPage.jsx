import React from 'react';
import LandingNavbar from '../components/LandingNavbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import LandingFooter from '../components/LandingFooter';

export default function LandingPage({ currentUser, onNavigateDashboard, onNavigateLogin, onNavigateSignUp, onLogout }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-violet-500 selection:text-white">
      {/* Navigation Bar */}
      <LandingNavbar 
        currentUser={currentUser}
        onNavigateDashboard={onNavigateDashboard}
        onNavigateLogin={onNavigateLogin}
        onNavigateSignUp={onNavigateSignUp}
        onLogout={onLogout}
      />

      {/* Hero Section */}
      <HeroSection 
        currentUser={currentUser}
        onGetStarted={currentUser ? onNavigateDashboard : onNavigateSignUp}
        onLogin={currentUser ? onNavigateDashboard : onNavigateLogin}
      />

      {/* Showcase Features Section (4 Cards) */}
      <FeaturesSection />

      {/* About Section */}
      <AboutSection onGetStarted={currentUser ? onNavigateDashboard : onNavigateSignUp} />

      {/* Contact Section */}
      <ContactSection onGetStarted={currentUser ? onNavigateDashboard : onNavigateSignUp} />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
