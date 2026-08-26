import React from 'react';
import JobCard from './JobCard';
import { Plus, Inbox, CheckCircle2, Clock, XCircle, FileText, Sparkles } from 'lucide-react';

export default function KanbanColumn({ title, statusKey, count, jobs = [], colorTheme, onAddCard, onSelectJob, isFocused = false, isDimmed = false }) {
  const headerThemes = {
    applied: {
      dot: 'bg-violet-600',
      badgeBg: 'bg-violet-100 text-violet-800 border border-violet-200',
      topLine: 'bg-violet-600',
      colBg: 'bg-slate-100/70 border-slate-200/80',
      focusedBorder: 'border-violet-500 ring-violet-500/20 text-violet-700',
      icon: <FileText className="w-4 h-4 text-violet-600" />
    },
    interviewing: {
      dot: 'bg-amber-500',
      badgeBg: 'bg-amber-100 text-amber-800 border border-amber-200',
      topLine: 'bg-amber-500',
      colBg: 'bg-slate-100/70 border-slate-200/80',
      focusedBorder: 'border-amber-500 ring-amber-500/20 text-amber-700',
      icon: <Clock className="w-4 h-4 text-amber-500" />
    },
    offered: {
      dot: 'bg-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      topLine: 'bg-emerald-600',
      colBg: 'bg-slate-100/70 border-slate-200/80',
      focusedBorder: 'border-emerald-500 ring-emerald-500/20 text-emerald-700',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />
    },
    rejected: {
      dot: 'bg-rose-500',
      badgeBg: 'bg-rose-100 text-rose-800 border border-rose-200',
      topLine: 'bg-rose-500',
      colBg: 'bg-slate-100/70 border-slate-200/80',
      focusedBorder: 'border-rose-500 ring-rose-500/20 text-rose-700',
      icon: <XCircle className="w-4 h-4 text-rose-500" />
    }
  };

  const theme = headerThemes[statusKey] || headerThemes.applied;

  return (
    <div 
      className={`flex flex-col rounded-3xl border min-h-[580px] p-4 transition-all duration-300 relative ${
        isFocused 
          ? `bg-white border-2 ${theme.focusedBorder} shadow-2xl scale-[1.03] z-30 ring-4 ring-offset-2` 
          : isDimmed 
          ? `opacity-35 scale-[0.97] filter blur-[0.2px] hover:opacity-90 hover:scale-100 ${theme.colBg} shadow-2xs` 
          : `${theme.colBg} shadow-xs`
      }`}
    >
      
      {/* Top Line Accent */}
      <div className={`absolute top-0 left-6 right-6 h-1.5 ${theme.topLine} rounded-b-md`}></div>

      {/* Focus Mode Active Header Badge */}
      {isFocused && (
        <div className="mb-2 flex items-center justify-center">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.badgeBg} flex items-center space-x-1 shadow-xs animate-pulse`}>
            <Sparkles className="w-3 h-3 mr-1" />
            <span>FOCUS MODE ACTIVE</span>
          </span>
        </div>
      )}

      {/* Column Header */}
      <div className="flex items-center justify-between pt-1 pb-3 px-1 mb-2 border-b border-slate-200/60">
        <div className="flex items-center space-x-2">
          {theme.icon}
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">{title}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${theme.badgeBg}`}>
            {jobs.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onAddCard}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
          title={`Add card to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Container */}
      <div className="flex-1 space-y-3 custom-scrollbar overflow-y-auto pr-0.5">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onClick={onSelectJob} />
          ))
        ) : (
          <div className="h-48 border-2 border-dashed border-slate-200/80 rounded-2xl flex flex-col items-center justify-center p-4 text-center bg-white/40 my-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-600">No Applications</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[180px]">
              Click + Add Application to track new opportunities
            </p>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <button
        type="button"
        onClick={onAddCard}
        className="mt-3 w-full py-2.5 px-3 bg-white/80 hover:bg-white border border-slate-200/80 hover:border-violet-300 rounded-2xl text-xs font-bold text-slate-600 hover:text-violet-700 flex items-center justify-center space-x-1.5 transition-all group cursor-pointer shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition-colors" />
        <span>Add Card</span>
      </button>

    </div>
  );
}
