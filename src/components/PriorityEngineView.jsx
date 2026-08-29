import React from 'react';
import { ShieldAlert, Zap, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function PriorityEngineView({ jobs = [] }) {
  // Priority calculation helper
  const getPriorityInfo = (job) => {
    let score = 30; // base score
    if (job.status === 'interviewing') score += 40;
    if (job.status === 'applied') score += 20;
    if (job.status === 'offered') score += 10;
    if (job.interviewDate) score += 25;

    let level = 'LOW';
    let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    let dot = 'bg-emerald-500';

    if (score >= 70) {
      level = 'HIGH';
      badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';
      dot = 'bg-rose-500';
    } else if (score >= 40) {
      level = 'MEDIUM';
      badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
      dot = 'bg-amber-500';
    }

    return { score, level, badgeBg, dot };
  };

  const prioritizedJobs = jobs.map(j => ({
    ...j,
    priority: getPriorityInfo(j)
  })).sort((a, b) => b.priority.score - a.priority.score);

  return (
    <div className="space-y-8">
      
      {/* Priority Engine Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Priority Engine Overview</h3>
              <p className="text-xs text-slate-500">Automated scoring based on days since applied, status weight, and interview dates</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-xs font-bold">
            <div className="flex items-center space-x-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>High (Score ≥ 70)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl border border-amber-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Medium (40 - 69)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Low (&lt; 40)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prioritized Applications List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h4 className="text-sm font-bold text-slate-800">Scored Application Rankings</h4>
          <span className="text-xs text-slate-500 font-medium">{prioritizedJobs.length} Applications Evaluated</span>
        </div>

        {prioritizedJobs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {prioritizedJobs.map((job) => (
              <div key={job.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                    {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{job.title}</h5>
                    <p className="text-xs text-slate-500">{job.company} • {job.location || 'Remote'}</p>
                  </div>
                </div>

                {/* Score & Priority Pill */}
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500">Priority Score</p>
                    <p className="text-lg font-black text-slate-900">{job.priority.score} / 100</p>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${job.priority.badgeBg} flex items-center space-x-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${job.priority.dot}`}></span>
                    <span>{job.priority.level} PRIORITY</span>
                  </span>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No applications found to evaluate. Add a new application to trigger the Priority Engine.
          </div>
        )}
      </div>

    </div>
  );
}
