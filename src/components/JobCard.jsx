import React from 'react';
import { MapPin, DollarSign, MoreHorizontal, Clock, ExternalLink, User, Calendar, Bell, FileText, Globe, Tag, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';

const formatDateString = (dateVal) => {
  if (!dateVal || dateVal === 'Recently' || dateVal === 'N/A' || dateVal === 'Not Scheduled' || dateVal === 'None Set') {
    return dateVal || 'Recently';
  }
  let str = String(dateVal).trim();
  let timestamp = Number(str);
  if (!isNaN(timestamp) && timestamp > 1000000000) {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return str;
};

const getFlowDates = (job) => {
  if (!job) return { applied: null, interviewing: null, offered: null, rejected: null };
  const status = (job.status || 'applied').toLowerCase().trim();

  let applied = job.appliedDate || job.dateApplied || job.statusHistory?.applied || null;
  let interviewing = job.interviewingDate || job.interviewDate || job.statusHistory?.interviewing || null;
  let offered = job.offeredDate || job.statusHistory?.offered || null;
  let rejected = job.rejectedDate || job.statusHistory?.rejected || null;

  if (status === 'applied') {
    if (!applied) applied = job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    interviewing = null;
    offered = null;
    rejected = null;
  } else if (status === 'interviewing') {
    if (!applied) applied = job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : '2026-08-26';
    if (!interviewing) interviewing = job.lastStatusChangeDate || new Date().toISOString().split('T')[0];
    offered = null;
    rejected = null;
  } else if (status === 'offered') {
    if (!applied) applied = job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : '2026-08-26';
    if (!offered) offered = job.lastStatusChangeDate || new Date().toISOString().split('T')[0];
    rejected = null;
  } else if (status === 'rejected') {
    if (!applied) applied = job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : '2026-08-26';
    if (!rejected) rejected = job.lastStatusChangeDate || new Date().toISOString().split('T')[0];
  }

  return { applied, interviewing, offered, rejected };
};

export default function JobCard({ job, onClick }) {
  if (!job) return null;

  const company = job.companyName || job.company || 'Company';
  const title = job.jobTitle || job.title || 'Untitled Role';
  const logo = job.logo ? job.logo : company.charAt(0).toUpperCase();

  // Inactivity Calculation (STRICTLY > 7 Days Inactive from current date = Yellow Follow-up Card)
  const calculateDaysInactive = () => {
    const d = job.lastStatusChangeDate || job.updatedAt || job.appliedDate || job.dateApplied || job.createdAt;
    if (!d || d === 'Recently') return 0;
    let timestamp = Number(d);
    let timeMs = !isNaN(timestamp) && timestamp > 1000000000 ? timestamp : new Date(d).getTime();
    if (isNaN(timeMs)) return 0;
    const diffDays = Math.floor((Date.now() - timeMs) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysInactive = calculateDaysInactive();
  const status = (job.status || 'applied').toLowerCase().trim();
  const isFollowUp = (status !== 'offered' && status !== 'rejected') && (daysInactive >= 7 || job.isFollowUp === true);

  const avatarGradients = [
    'from-violet-600 to-indigo-600 text-white shadow-violet-500/25',
    'from-cyan-500 to-blue-600 text-white shadow-cyan-500/25',
    'from-fuchsia-600 to-purple-600 text-white shadow-fuchsia-500/25',
    'from-emerald-500 to-teal-600 text-white shadow-emerald-500/25',
    'from-amber-500 to-orange-600 text-white shadow-amber-500/25',
  ];

  const avatarIndex = company.length % avatarGradients.length;
  const avatarStyle = avatarGradients[avatarIndex];

  // Tags processing with safe typeof string check
  const tags = typeof job.skillsRequired === 'string' 
    ? job.skillsRequired.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3) 
    : (Array.isArray(job.tags) && job.tags.length > 0 ? job.tags.slice(0, 3) : [job.applicationType || 'Full-time']);

  const salaryDisplay = job.offeredSalary || job.salary || job.expectedSalary;
  
  const flowDates = getFlowDates(job);
  
  const appliedDateFormatted = flowDates.applied ? formatDateString(flowDates.applied) : null;
  const interviewDateFormatted = flowDates.interviewing ? formatDateString(flowDates.interviewing) : null;
  const offeredDateFormatted = flowDates.offered ? formatDateString(flowDates.offered) : null;
  const rejectedDateFormatted = flowDates.rejected ? formatDateString(flowDates.rejected) : null;
  const lastUpdatedFormatted = formatDateString(job.lastStatusChangeDate || job.updatedAt || job.appliedDate || new Date().toISOString().split('T')[0]);

  return (
    <div 
      onClick={() => onClick && onClick(job)}
      className={`group rounded-2xl p-4 transition-all duration-300 relative cursor-pointer transform hover:-translate-y-1 h-[390px] flex flex-col justify-between ${
        isFollowUp 
          ? 'bg-amber-50/95 border-2 border-amber-400 shadow-md shadow-amber-500/15 hover:shadow-xl hover:border-amber-500 ring-2 ring-amber-400/20' 
          : 'bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-violet-400/80'
      }`}
    >
      {/* Follow-up Yellow Attention Badge Pill */}
      {isFollowUp && (
        <div className="mb-2.5 flex items-center justify-between">
          <span className="bg-amber-200/90 text-amber-950 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center shadow-2xs animate-pulse">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-800" />
            <span>Follow-up Due ({daysInactive > 0 ? `${daysInactive}d` : '>7d'})</span>
          </span>
          <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">Action Needed</span>
        </div>
      )}

      {/* Top Header: Avatar Logo, Title & Company */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center space-x-3 truncate">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarStyle} flex items-center justify-center font-black text-base shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
            {logo}
          </div>
          <div className="truncate">
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1 leading-snug">
              {title}
            </h4>
            <p className="text-xs font-bold text-slate-500 truncate flex items-center mt-0.5">
              <span>{company}</span>
              {job.workMode && (
                <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                  isFollowUp ? 'bg-amber-100/80 text-amber-900' : 'bg-slate-100 text-slate-600'
                }`}>
                  {job.workMode}
                </span>
              )}
            </p>
          </div>
        </div>

        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick && onClick(job); }}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0 cursor-pointer"
          title="View Details"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Meta Information Cards Container */}
      <div className="space-y-2 my-3 text-xs">
        
        {/* Row 1: Location & Work Type */}
        <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] ${
          isFollowUp ? 'bg-amber-100/60 border-amber-200/80 text-amber-900' : 'bg-slate-50/80 border-slate-200/50 text-slate-600'
        }`}>
          <div className="flex items-center space-x-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
            <span className="truncate font-medium">{job.location || 'Remote'}</span>
          </div>
          <span className="font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md flex-shrink-0">
            {job.applicationType || 'Full-time'}
          </span>
        </div>
        
        {/* Row 2: Offered Salary (LPA / Per Annum) */}
        {salaryDisplay && salaryDisplay !== 'N/A' && (
          <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 px-2.5 py-1.5 rounded-xl text-[11px]">
            <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Salary:</span>
            <div className="flex items-center text-emerald-800 font-black">
              <span className="mr-1 text-emerald-600 font-bold">₹</span>
              <span>{salaryDisplay}</span>
            </div>
          </div>
        )}

        {/* Row 3: Recruiter Contact Info */}
        {job.recruiterName && (
          <div className="flex items-center space-x-1.5 text-slate-600 text-[11px] px-1">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">Contact: <strong>{job.recruiterName}</strong></span>
          </div>
        )}

        {/* Row 4: Attached Resume File Pill */}
        {job.resumeName && (
          <div className="flex items-center space-x-1.5 text-violet-700 bg-violet-50/60 border border-violet-200/60 px-2.5 py-1 rounded-xl text-[11px] font-semibold truncate">
            <FileText className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
            <span className="truncate">{job.resumeName}</span>
          </div>
        )}

        {/* Row 5: Added Notes & Description Display */}
        {job.notes && String(job.notes).trim() && (
          <div className="flex items-start space-x-1.5 bg-slate-50/90 border border-slate-200/80 p-2 rounded-xl text-[11px]">
            <FileText className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2 text-[10.5px] italic text-slate-700 font-semibold leading-tight">
              "{String(job.notes).trim()}"
            </span>
          </div>
        )}

      </div>

      {/* Skills Badges Row */}
      <div className="flex flex-wrap items-center gap-1.5 my-3">
        {tags.map((tag, idx) => (
          <span 
            key={idx}
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border transition-colors ${
              isFollowUp 
                ? 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200' 
                : 'bg-slate-100 text-slate-700 border-slate-200/70 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Date Breakdown Container: Applied, Interviewing, Last Updated */}
      <div className={`my-2 p-2.5 rounded-xl border text-[10px] space-y-1 min-h-[96px] max-h-[96px] overflow-y-auto custom-scrollbar flex flex-col justify-center ${
        isFollowUp ? 'bg-amber-100/70 border-amber-300 text-amber-950' : 'bg-slate-50 border-slate-200/70 text-slate-600'
      }`}>
        {appliedDateFormatted && (
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-500 flex items-center">
              <Clock className="w-3 h-3 mr-1 text-slate-400" /> Applied Date:
            </span>
            <span className="font-bold text-slate-800">{appliedDateFormatted}</span>
          </div>
        )}

        {interviewDateFormatted && (
          <div className="flex items-center justify-between">
            <span className="font-medium text-amber-700 flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-amber-600" /> Interviewing Date:
            </span>
            <span className="font-bold text-amber-900">{interviewDateFormatted}</span>
          </div>
        )}

        {offeredDateFormatted && (
          <div className="flex items-center justify-between">
            <span className="font-medium text-emerald-700 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-emerald-600" /> Offered Date:
            </span>
            <span className="font-bold text-emerald-900">{offeredDateFormatted}</span>
          </div>
        )}

        {rejectedDateFormatted && (
          <div className="flex items-center justify-between">
            <span className="font-medium text-rose-700 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" /> Rejected Date:
            </span>
            <span className="font-bold text-rose-900">{rejectedDateFormatted}</span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-200/60 pt-1 mt-1">
          <span className="font-bold text-violet-600 flex items-center">
            <RefreshCw className="w-3 h-3 mr-1 text-violet-500" /> Last Updated:
          </span>
          <span className="font-black text-violet-800">{lastUpdatedFormatted}</span>
        </div>
      </div>

      {/* Footer: Details Action */}
      <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
        isFollowUp ? 'border-amber-200/80 text-amber-900' : 'border-slate-100 text-slate-400'
      }`}>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status: {job.status || 'applied'}</span>
        
        <span className="text-violet-600 font-extrabold flex items-center group-hover:translate-x-1 transition-transform">
          Details <ExternalLink className="w-3 h-3 ml-1" />
        </span>
      </div>

    </div>
  );
}
