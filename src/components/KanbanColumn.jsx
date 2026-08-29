import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { Plus, Inbox, CheckCircle2, Clock, XCircle, FileText, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function KanbanColumn({ title, statusKey, count, jobs = [], colorTheme, onAddCard, onSelectJob, isFocused = false, isDimmed = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 1; // Strictly 1 card per column page so every card gets its own clean page!

  // Reset to page 1 whenever jobs filter or list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [jobs.length, statusKey]);

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE) || 1;

  // Clamp current page if totalPages shrinks
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleJobs = jobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      className={`flex flex-col justify-between rounded-3xl border h-full min-h-[500px] p-4 transition-all duration-300 relative ${
        isFocused 
          ? `bg-white border-2 ${theme.focusedBorder} shadow-2xl scale-[1.03] z-30 ring-4 ring-offset-2` 
          : isDimmed 
          ? `opacity-35 scale-[0.97] filter blur-[0.2px] hover:opacity-90 hover:scale-100 ${theme.colBg} shadow-2xs` 
          : `${theme.colBg} shadow-xs`
      }`}
    >
      
      {/* Top Section: Header Accent + Column Title */}
      <div>
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
        <div className="flex items-center justify-between pt-1 pb-3 px-1 mb-3 border-b border-slate-200/60">
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

        {/* Paginated Cards Container (1 Card Per Column Page) */}
        <div className="space-y-3 custom-scrollbar overflow-y-auto pr-0.5 min-h-[400px] flex flex-col justify-start">
          {visibleJobs.length > 0 ? (
            visibleJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={onSelectJob} />
            ))
          ) : (
            <div className="h-64 border-2 border-dashed border-slate-200/80 rounded-2xl flex flex-col items-center justify-center p-4 text-center bg-white/40 my-2">
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
      </div>

      {/* Bottom Footer Controls Container (Aligned Pagination + Add Card Button) */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/70 space-y-2 flex flex-col justify-end">
        
        {/* Pagination Bar Container (Preserves fixed height for perfect bottom alignment) */}
        <div className={`flex items-center justify-between text-xs px-2 py-1.5 rounded-2xl transition-all ${
          totalPages > 1 
            ? 'bg-white/90 border border-slate-200/80 shadow-2xs' 
            : 'bg-white/30 border border-transparent opacity-40 select-none'
        }`}>
          <button
            type="button"
            disabled={safePage === 1 || totalPages <= 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer shadow-2xs transition-all text-[11px]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="text-[11px] font-black text-slate-700 tracking-wider">
            Page {safePage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={safePage === totalPages || totalPages <= 1}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer shadow-2xs transition-all text-[11px]"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer Add Card Button */}
        <button
          type="button"
          onClick={onAddCard}
          className="w-full py-2.5 px-3 bg-white/80 hover:bg-white border border-slate-200/80 hover:border-violet-300 rounded-2xl text-xs font-bold text-slate-600 hover:text-violet-700 flex items-center justify-center space-x-1.5 transition-all group cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 transition-colors" />
          <span>Add Card</span>
        </button>

      </div>

    </div>
  );
}
