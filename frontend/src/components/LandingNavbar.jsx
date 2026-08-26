import React from 'react';
import { Briefcase, LogIn, UserPlus, Sparkles, LayoutDashboard } from 'lucide-react';

export default function LandingNavbar({ onNavigateDashboard, onNavigateLogin, onNavigateSignUp }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateDashboard}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 transform hover:scale-105 transition-transform">
              <Briefcase className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Career<span className="text-violet-600 font-extrabold">Plus</span>
                </span>
                <span className="bg-violet-100 text-violet-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center">
                  <Sparkles className="w-3 h-3 mr-0.5" /> Tracker
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Job &amp; Internship Application Dashboard
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
            <a href="#home" className="hover:text-violet-600 transition-colors">Home</a>
            <a href="#features" className="hover:text-violet-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-violet-600 transition-colors">About</a>
            <a href="#contact" className="hover:text-violet-600 transition-colors">Contact</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            
            {/* Demo Workspace Link */}
            <button
              type="button"
              onClick={onNavigateDashboard}
              className="hidden lg:inline-flex items-center text-xs font-bold text-slate-600 hover:text-violet-600 bg-slate-100 hover:bg-violet-50 px-3.5 py-2 rounded-xl border border-slate-200/80 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5 mr-1 text-violet-600" />
              <span>Demo</span>
            </button>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-violet-600 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 mr-1 text-violet-600" />
              <span>Sign In</span>
            </button>

            {/* Sign Up Free Button */}
            <button
              type="button"
              onClick={onNavigateSignUp}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-2xl text-xs font-black text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 shadow-md shadow-violet-600/25 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              <span>Sign Up Free</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
