import React from 'react';
import { Target, Zap, Shield, CheckCircle } from 'lucide-react';

export default function AboutSection({ onGetStarted }) {
  return (
    <section id="about" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Story */}
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
              Why Career Plus
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Designed for Job Seekers Who Demand Organization and Results.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Applying to dozens of jobs and internships across LinkedIn, Indeed, and company portals can quickly turn chaotic. Career Plus replaces messy spreadsheets with an intelligent, visual command center.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Structured Pipeline</h4>
                  <p className="text-xs text-slate-500">Know exactly where every application stands at a glance.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Zero Setup Hassle</h4>
                  <p className="text-xs text-slate-500">Start organizing your application pipeline in under 60 seconds.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Data Privacy First</h4>
                  <p className="text-xs text-slate-500">Your job search information remains encrypted and strictly private.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onGetStarted}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
              >
                Experience Career Plus
              </button>
            </div>
          </div>

          {/* Right Column: Key Stats Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-2xl font-black text-slate-900 mb-1">Impact at a Glance</h3>
              <p className="text-xs text-slate-500">Proven results for students and seasoned professionals</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">50K+</p>
                <p className="text-xs font-semibold text-slate-700">Applications Tracked</p>
                <p className="text-[11px] text-slate-400">Across 120+ countries</p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">3.2x</p>
                <p className="text-xs font-semibold text-slate-700">Higher Interview Rate</p>
                <p className="text-[11px] text-slate-400">With timely follow-ups</p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-amber-500">98%</p>
                <p className="text-xs font-semibold text-slate-700">User Satisfaction</p>
                <p className="text-[11px] text-slate-400">Based on candidate reviews</p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">4.9/5</p>
                <p className="text-xs font-semibold text-slate-700">Average Rating</p>
                <p className="text-[11px] text-slate-400">From job seekers</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
