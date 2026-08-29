import React from 'react';
import { Target, Zap, Shield, CheckCircle, FileSpreadsheet, Kanban, BellRing, Lock } from 'lucide-react';

export default function AboutSection({ onGetStarted }) {
  return (
    <section id="about" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Core System Story */}
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-violet-700 bg-violet-100/80 px-3.5 py-1.5 rounded-full border border-violet-200 shadow-2xs">
              Why Career Plus
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Designed for Job Seekers Who Demand Organization and Results.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Applying to dozens of jobs across portals can quickly turn chaotic. CareerPlus replaces messy manual logs with a visual Kanban pipeline, automated follow-up alerts, and Excel progress reporting.
            </p>

            {/* Original Feature Capabilities */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start space-x-3">
                <Kanban className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">4-Stage Visual Kanban Pipeline</h4>
                  <p className="text-xs text-slate-500">Track roles seamlessly across Applied, Interviewing, Offered, and Rejected stages.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BellRing className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Automated 7-Day Follow-Up Alerts</h4>
                  <p className="text-xs text-slate-500">Highlight inactive applications with yellow attention badges after 7 days without updates.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Scoped Candidate Data Privacy</h4>
                  <p className="text-xs text-slate-500">Every candidate profile is 100% private with user-scoped storage isolation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileSpreadsheet className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">1-Click Excel Progress Exporter</h4>
                  <p className="text-xs text-slate-500">Export application details (Company, Stage, Role, Salary, Location) to CSV in seconds.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onGetStarted}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                Experience Career Plus
              </button>
            </div>
          </div>

          {/* Right Column: Original Real System Capabilities Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-2xl font-black text-slate-900 mb-1">Platform Architecture</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time tracker specifications &amp; core metrics</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-3xl sm:text-4xl font-black text-violet-600">4</p>
                <p className="text-xs font-bold text-slate-800">Workflow Stages</p>
                <p className="text-[11px] text-slate-500">Applied, Interview, Offer, Rejected</p>
              </div>

              <div className="space-y-1 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-3xl sm:text-4xl font-black text-amber-500">&gt; 7 Days</p>
                <p className="text-xs font-bold text-slate-800">Recruiter Follow-up</p>
                <p className="text-[11px] text-slate-500">Automated inactivity trigger</p>
              </div>

              <div className="space-y-1 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-3xl sm:text-4xl font-black text-emerald-600">100%</p>
                <p className="text-xs font-bold text-slate-800">Candidate Privacy</p>
                <p className="text-[11px] text-slate-500">User-scoped data isolation</p>
              </div>

              <div className="space-y-1 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-3xl sm:text-4xl font-black text-cyan-600">5 Fields</p>
                <p className="text-xs font-bold text-slate-800">Excel Exporter</p>
                <p className="text-[11px] text-slate-500">Company, Stage, Role, Salary, Location</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
