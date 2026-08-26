import React from 'react';
import { BarChart3, TrendingUp, Award, Send, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AnalyticsView({ jobs = [] }) {
  const total = jobs.length;
  const appliedCount = jobs.filter(j => j.status === 'applied').length;
  const interviewingCount = jobs.filter(j => j.status === 'interviewing').length;
  const offeredCount = jobs.filter(j => j.status === 'offered').length;
  const rejectedCount = jobs.filter(j => j.status === 'rejected').length;

  const totalInterviews = interviewingCount + offeredCount;
  const appliedToInterviewRate = total > 0 ? Math.round((totalInterviews / total) * 100) : 0;
  const interviewToOfferRate = totalInterviews > 0 ? Math.round((offeredCount / totalInterviews) * 100) : 0;
  const overallSuccessRate = total > 0 ? Math.round((offeredCount / total) * 100) : 0;

  return (
    <div className="space-y-8">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Applied → Interview Rate</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{appliedToInterviewRate}%</p>
          <p className="text-xs text-slate-500">Conversion to interview round</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Interview → Offer Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600">{interviewToOfferRate}%</p>
          <p className="text-xs text-slate-500">Interview final round conversion</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Overall Win Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600">{overallSuccessRate}%</p>
          <p className="text-xs text-slate-500">Offer success percentage</p>
        </div>

      </div>

      {/* Conversion Funnel Breakdown */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <h4 className="text-lg font-extrabold text-slate-900">Application Conversion Funnel</h4>
          <p className="text-xs text-slate-500">Visual progress breakdown across all pipeline stages</p>
        </div>

        <div className="space-y-5">
          {/* Stage 1: Applied */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-blue-700">1. Applied Stage</span>
              <span className="text-slate-700">{appliedCount} Applications</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${total > 0 ? (appliedCount / total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Stage 2: Interviewing */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-amber-700">2. Interviewing Stage</span>
              <span className="text-slate-700">{interviewingCount} Active Interviews</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${total > 0 ? (interviewingCount / total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Stage 3: Offered */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-700">3. Offered Stage</span>
              <span className="text-slate-700">{offeredCount} Offers Received</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${total > 0 ? (offeredCount / total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
