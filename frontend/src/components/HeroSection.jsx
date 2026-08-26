import React from 'react';
import { ArrowRight, LogIn, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function HeroSection({ onGetStarted, onLogin }) {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-violet-50/60 via-slate-50 to-white">
      
      {/* Background Mobility Ambient Blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-violet-500/20 via-indigo-500/15 to-cyan-400/20 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-violet-100/90 border border-violet-200 text-violet-900 text-xs font-black tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
            <span>#1 Job &amp; Internship Application Workspace</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Track Every Application. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Land Your Dream Career.
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Organize your job hunt seamlessly in one central workspace. Track applications, schedule interviews, set follow-up reminders, and analyze your offer metrics with ease.
          </p>

          {/* Prominent Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Get Started Button */}
            <button
              type="button"
              id="hero-get-started-btn"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-black text-base shadow-lg shadow-violet-600/30 hover:shadow-xl hover:shadow-violet-600/40 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Login Button */}
            <button
              type="button"
              id="hero-login-btn"
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base border border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <LogIn className="w-4.5 h-4.5 text-violet-600" />
              <span>Login Account</span>
            </button>

          </div>

          {/* Trust Badges / Social Proof */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Spring Boot REST API Integrated</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-violet-600" />
              <span>SQLite Database Storage</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              <span>Google OAuth 2.0 Auth</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
