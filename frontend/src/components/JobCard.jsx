import React from 'react';
import { MapPin, DollarSign, MoreHorizontal, Clock, ExternalLink, User, Calendar, Bell, FileText, Globe, Tag, Sparkles, AlertTriangle } from 'lucide-react';

export default function JobCard({ job, onClick }) {
  if (!job) return null;

  const company = job.companyName || job.company || 'Company';
  const title = job.jobTitle || job.title || 'Untitled Role';
  const logo = job.logo ? job.logo : company.charAt(0).toUpperCase();

  // Inactivity & Follow-up Detection
  const calculateDaysInactive = () => {
    const d = job.appliedDate || job.dateApplied || job.createdAt;
    if (!d) return 8; // Default fallback to trigger follow-up if date not set
    const appliedTime = new Date(d).getTime();
    if (isNaN(appliedTime)) return 8;
    const diffDays = Math.floor((Date.now() - appliedTime) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 8;
  };

  const daysInactive = calculateDaysInactive();
  // Mark as follow-up card if inactive >= 1 day or status is interviewing/applied or flagged
  const isFollowUp = daysInactive >= 1 || job.isFollowUp === true || (job.status || '').toLowerCase() === 'interviewing';

  const avatarGradients = [
    'from-amber-600 to-yellow-600 text-white shadow-amber-500/30',
    'from-yellow-500 to-amber-700 text-white shadow-yellow-500/30',
    'from-orange-500 to-amber-600 text-white shadow-orange-500/30',
    'from-violet-600 to-indigo-600 text-white shadow-violet-500/25',
    'from-cyan-500 to-blue-600 text-white shadow-cyan-500/25',
  ];

  const avatarIndex = company.length % avatarGradients.length;
  const avatarStyle = avatarGradients[avatarIndex];

  // Tags processing
  const tags = job.skillsRequired 
    ? job.skillsRequired.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3) 
    : (Array.isArray(job.tags) && job.tags.length > 0 ? job.tags.slice(0, 3) : [job.applicationType || 'Full-time']);

  const salaryDisplay = job.offeredSalary || job.salary || job.expectedSalary;

  return (
    <div 
      onClick={() => onClick && onClick(job)}
      className={`group rounded-2xl p-4 transition-all duration-300 relative cursor-pointer transform hover:-translate-y-1 ${
        isFollowUp 
          ? 'bg-amber-200/90 border-2 border-amber-500 shadow-md shadow-amber-500/25 hover:shadow-xl hover:bg-amber-200 ring-2 ring-amber-400/40 text-amber-950' 
          : 'bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-violet-400/80'
      }`}
    >
      {/* Bright Yellow Attention Badge Pill */}
      {isFollowUp && (
        <div className="mb-2.5 flex items-center justify-between">
          <span className="bg-amber-400 text-amber-950 border border-amber-500 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center shadow-xs animate-pulse">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-950" />
            <span>⚠️ Follow-up Due ({daysInactive}d)</span>
          </span>
          <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider">Action Needed</span>
        </div>
      )}

      {/* Top Header: Avatar Logo, Title & Company */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center space-x-3 truncate">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarStyle} flex items-center justify-center font-black text-base shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}>
            {logo}
          </div>
          <div className="truncate">
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-900 transition-colors line-clamp-1 leading-snug">
              {title}
            </h4>
            <p className="text-xs font-bold text-slate-600 truncate flex items-center mt-0.5">
              <span>{company}</span>
              {job.workMode && (
                <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                  isFollowUp ? 'bg-amber-300/80 text-amber-950 border border-amber-400' : 'bg-slate-100 text-slate-600'
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
          className="text-slate-500 hover:text-slate-900 p-1.5 rounded-xl hover:bg-amber-300/60 transition-colors flex-shrink-0 cursor-pointer"
          title="View Details"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Meta Information Cards Container */}
      <div className="space-y-2 my-3 text-xs">
        
        {/* Row 1: Location & Work Type */}
        <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] ${
          isFollowUp ? 'bg-amber-100/90 border-amber-300 text-amber-950 font-bold' : 'bg-slate-50/80 border-slate-200/50 text-slate-600'
        }`}>
          <div className="flex items-center space-x-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-amber-800 flex-shrink-0" />
            <span className="truncate font-medium">{job.location || 'Remote'}</span>
          </div>
          <span className="font-bold text-amber-950 bg-amber-300 px-2 py-0.5 rounded-md flex-shrink-0 border border-amber-400">
            {job.applicationType || 'Full-time'}
          </span>
        </div>
        
        {/* Row 2: Offered Salary (LPA / Per Annum) */}
        {salaryDisplay && salaryDisplay !== 'N/A' && (
          <div className="flex items-center justify-between bg-emerald-100/90 border border-emerald-300 px-2.5 py-1.5 rounded-xl text-[11px]">
            <span className="text-emerald-800 font-bold text-[10px] uppercase tracking-wider">Salary:</span>
            <div className="flex items-center text-emerald-950 font-black">
              <span className="mr-1 text-emerald-700 font-bold">₹</span>
              <span>{salaryDisplay}</span>
            </div>
          </div>
        )}

        {/* Row 3: Recruiter Contact Info */}
        {job.recruiterName && (
          <div className="flex items-center space-x-1.5 text-amber-950 text-[11px] px-1 font-semibold">
            <User className="w-3.5 h-3.5 text-amber-800 flex-shrink-0" />
            <span className="truncate">Contact: <strong>{job.recruiterName}</strong></span>
          </div>
        )}

        {/* Row 4: Attached Resume File Pill */}
        {job.resumeName && (
          <div className="flex items-center space-x-1.5 text-amber-950 bg-amber-300/70 border border-amber-400 px-2.5 py-1 rounded-xl text-[11px] font-bold truncate">
            <FileText className="w-3.5 h-3.5 text-amber-900 flex-shrink-0" />
            <span className="truncate">{job.resumeName}</span>
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
                ? 'bg-amber-300 text-amber-950 border-amber-400 hover:bg-amber-400' 
                : 'bg-slate-100 text-slate-700 border-slate-200/70 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: Date Applied & Details Action */}
      <div className={`pt-2.5 border-t flex items-center justify-between text-[11px] ${
        isFollowUp ? 'border-amber-300 text-amber-950 font-bold' : 'border-slate-100 text-slate-400'
      }`}>
        <div className="flex items-center space-x-1 text-slate-700 font-semibold">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{job.appliedDate || 'Recently'}</span>
        </div>
        
        <span className="text-amber-950 font-black flex items-center group-hover:translate-x-1 transition-transform">
          Details <ExternalLink className="w-3 h-3 ml-1" />
        </span>
      </div>

    </div>
  );
}
