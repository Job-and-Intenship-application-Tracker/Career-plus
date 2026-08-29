import React, { useState } from 'react';
import { AlertCircle, Calendar, CheckCircle2, Clock, ArrowRight, Send, MessageSquare, X, Mail, Phone, User, FileText } from 'lucide-react';

export default function TodaysActionsView({ jobs = [], onAddCard, onSelectJob }) {
  const [activeActionModal, setActiveActionModal] = useState(null); // { type: 'followup' | 'prep', job: Object }

  // Group jobs dynamically by action type
  const highPriorityFollowUps = jobs.filter(j => 
    j.status === 'applied' || (j.priorityScore && j.priorityScore >= 70)
  );

  const prepareForInterview = jobs.filter(j => 
    j.status === 'interviewing' || j.interviewDate
  );

  const noActionRequired = jobs.filter(j => 
    j.status === 'offered' || j.status === 'rejected'
  );

  const handleOpenAction = (type, job) => {
    if (onSelectJob) {
      onSelectJob(job);
    } else {
      setActiveActionModal({ type, job });
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-blue-50 to-indigo-50 p-6 rounded-3xl border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></span>
            Today's Action List
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Prioritized tasks grouped by urgency: follow up on applications, prepare for interviews, and review progress.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl border border-amber-200 shadow-2xs">
          <span className="text-2xl font-black text-amber-600">
            {highPriorityFollowUps.length + prepareForInterview.length}
          </span>
          <span className="text-xs font-bold text-slate-700 leading-tight">
            Actions <br />Pending
          </span>
        </div>
      </div>

      {/* Group 1: 🔴 Follow Up (High Priority) */}
      <div className="bg-white rounded-3xl p-6 border border-rose-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <h4 className="text-base font-bold text-slate-900">1. High Priority Follow-ups</h4>
            <span className="bg-rose-100 text-rose-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {highPriorityFollowUps.length} Overdue
            </span>
          </div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
            Immediate Action Required
          </span>
        </div>

        {highPriorityFollowUps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highPriorityFollowUps.map(job => (
              <div 
                key={job.id} 
                onClick={() => handleOpenAction('followup', job)}
                className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/60 flex items-center justify-between gap-4 hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                    Follow-up Needed
                  </span>
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors">{job.jobTitle || job.title}</h5>
                  <p className="text-xs text-slate-500">{job.companyName || job.company} • {job.appliedDate || 'Applied recently'}</p>
                </div>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleOpenAction('followup', job); }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 flex-shrink-0 cursor-pointer transition-transform transform group-hover:scale-105"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Follow Up</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3 text-center">No overdue follow-ups pending!</p>
        )}
      </div>

      {/* Group 2: 🟡 Prepare for Interview */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <h4 className="text-base font-bold text-slate-900">2. Prepare for Upcoming Interviews</h4>
            <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {prepareForInterview.length} Scheduled
            </span>
          </div>
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
            Interview Preparation
          </span>
        </div>

        {prepareForInterview.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prepareForInterview.map(job => (
              <div 
                key={job.id} 
                onClick={() => handleOpenAction('prep', job)}
                className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex items-center justify-between gap-4 hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    {job.interviewRound || 'Technical Round'}
                  </span>
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{job.jobTitle || job.title}</h5>
                  <p className="text-xs text-slate-500">{job.companyName || job.company} • {job.interviewDate || 'Upcoming Schedule'}</p>
                </div>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleOpenAction('prep', job); }}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 flex-shrink-0 cursor-pointer transition-transform transform group-hover:scale-105"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Prep Notes</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3 text-center">No active interview preparations scheduled.</p>
        )}
      </div>

      {/* Group 3: 🟢 No Action Required */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h4 className="text-base font-bold text-slate-900">3. Informational / Completed</h4>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {noActionRequired.length} Completed
            </span>
          </div>
        </div>

        {noActionRequired.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {noActionRequired.map(job => (
              <div 
                key={job.id} 
                onClick={() => handleOpenAction('info', job)}
                className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-200/50 flex items-center justify-between cursor-pointer hover:bg-emerald-50/60 transition-all"
              >
                <div>
                  <h5 className="text-sm font-bold text-slate-900">{job.jobTitle || job.title}</h5>
                  <p className="text-xs text-slate-500">{job.companyName || job.company} • Status: {job.status}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                  {job.status === 'offered' ? 'Offer Received' : 'Archived'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3 text-center">No informational items.</p>
        )}
      </div>

      {/* Fallback Action Popup Modal Window */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                {activeActionModal.type === 'followup' ? '🚀 Follow Up & Recruiter Action' : '📅 Interview Preparation Notes'}
              </h3>
              <button 
                type="button" 
                onClick={() => setActiveActionModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <p className="font-bold text-slate-800 text-sm">{activeActionModal.job.jobTitle || activeActionModal.job.title}</p>
                <p className="text-slate-500">{activeActionModal.job.companyName || activeActionModal.job.company} • {activeActionModal.job.location || 'Remote'}</p>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-1.5">
                <p className="font-bold text-blue-900 flex items-center"><User className="w-3.5 h-3.5 mr-1 text-blue-600" /> Recruiter: {activeActionModal.job.recruiterName || 'Hiring Manager'}</p>
                {activeActionModal.job.recruiterEmail && <p className="text-slate-600 flex items-center"><Mail className="w-3.5 h-3.5 mr-1 text-slate-500" /> {activeActionModal.job.recruiterEmail}</p>}
                {activeActionModal.job.recruiterPhone && <p className="text-slate-600 flex items-center"><Phone className="w-3.5 h-3.5 mr-1 text-slate-500" /> {activeActionModal.job.recruiterPhone}</p>}
              </div>

              {activeActionModal.job.notes && (
                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-1">
                  <p className="font-bold text-amber-900 flex items-center"><FileText className="w-3.5 h-3.5 mr-1 text-amber-600" /> Preparation Notes:</p>
                  <p className="text-slate-700 italic">"{activeActionModal.job.notes}"</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="button" 
                onClick={() => setActiveActionModal(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
