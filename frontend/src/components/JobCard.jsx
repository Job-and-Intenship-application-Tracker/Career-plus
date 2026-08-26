import React from 'react';
import { MapPin, DollarSign, MoreHorizontal, Clock, ExternalLink, User, Calendar, Bell, FileText, Globe, Tag, Sparkles } from 'lucide-react';

export default function JobCard({ job, onClick }) {
  if (!job) return null;

  const company = job.companyName || job.company || 'Company';
  const title = job.jobTitle || job.title || 'Untitled Role';
  const logo = job.logo ? job.logo : company.charAt(0).toUpperCase();

  const avatarGradients = [
    'from-violet-600 to-indigo-600 text-white shadow-violet-500/25',
    'from-cyan-500 to-blue-600 text-white shadow-cyan-500/25',
    'from-fuchsia-600 to-purple-600 text-white shadow-fuchsia-500/25',
    'from-emerald-500 to-teal-600 text-white shadow-emerald-500/25',
    'from-amber-500 to-orange-600 text-white shadow-amber-500/25',
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
      className="group bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-violet-400/80 transition-all duration-300 relative cursor-pointer transform hover:-translate-y-1"
    >
      
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
                <span className="ml-1.5 px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
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
        <div className="flex items-center justify-between text-slate-600 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200/50 text-[11px]">
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

      </div>

      {/* Skills Badges Row */}
      <div className="flex flex-wrap items-center gap-1.5 my-3">
        {tags.map((tag, idx) => (
          <span 
            key={idx}
            className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/70 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: Date Applied & Details Action */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1 text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{job.appliedDate || 'Recently'}</span>
        </div>
        
        <span className="text-violet-600 font-extrabold flex items-center group-hover:translate-x-1 transition-transform">
          Details <ExternalLink className="w-3 h-3 ml-1" />
        </span>
      </div>

    </div>
  );
}
