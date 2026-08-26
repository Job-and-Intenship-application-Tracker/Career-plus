import React from 'react';
import { BellRing, Mail, MapPin, DollarSign, Calendar, Clock, ExternalLink, User, Sparkles, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export default function FollowUpNotesView({ jobs = [], onSelectJob }) {
  // Filter applications that require follow-up (> 7 days inactive or marked for follow-up)
  const calculateDaysInactive = (appliedDateStr) => {
    if (!appliedDateStr) return 8; // default fallback days
    const appliedTime = new Date(appliedDateStr).getTime();
    if (isNaN(appliedTime)) return 8;
    const diffDays = Math.floor((Date.now() - appliedTime) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 8;
  };

  // Applications needing follow-up
  const followUpJobs = jobs.length > 0 
    ? jobs.filter(j => calculateDaysInactive(j.appliedDate || j.dateApplied || j.createdAt) >= 7)
    : [
        {
          id: 101,
          jobTitle: 'Senior React Developer',
          companyName: 'TechCorp Solutions',
          location: 'Bangalore, India',
          workMode: 'Remote',
          applicationType: 'Full-time',
          offeredSalary: '14 LPA',
          appliedDate: '2026-08-15',
          status: 'applied',
          recruiterName: 'Ananya Sharma (Senior HR)',
          recruiterEmail: 'ananya@techcorp.io',
          resumeName: 'sangavi_fullstack.pdf',
          skillsRequired: 'React, Node.js, TypeScript'
        },
        {
          id: 102,
          jobTitle: 'Full Stack Software Engineer',
          companyName: 'Stripe Global',
          location: 'Hyderabad, India',
          workMode: 'Hybrid',
          applicationType: 'Full-time',
          offeredSalary: '18 LPA',
          appliedDate: '2026-08-12',
          status: 'interviewing',
          recruiterName: 'Rohan Mehta (Tech Recruiter)',
          recruiterEmail: 'rohan.m@stripe.com',
          resumeName: 'sangavi_fullstack.pdf',
          skillsRequired: 'Java, Spring Boot, React'
        },
        {
          id: 103,
          jobTitle: 'Frontend Architect',
          companyName: 'Razorpay',
          location: 'Bangalore, India',
          workMode: 'Remote',
          applicationType: 'Full-time',
          offeredSalary: '22 LPA',
          appliedDate: '2026-08-10',
          status: 'applied',
          recruiterName: 'Kavita Roy (Lead Talent Partner)',
          recruiterEmail: 'kavita@razorpay.com',
          resumeName: 'sangavi_lead_dev.pdf',
          skillsRequired: 'React, Redux, System Design'
        },
        {
          id: 104,
          jobTitle: 'Backend Engineer (Spring Boot)',
          companyName: 'Infosys Innovation Labs',
          location: 'Chennai, India',
          workMode: 'On-site',
          applicationType: 'Full-time',
          offeredSalary: '12 LPA',
          appliedDate: '2026-08-08',
          status: 'applied',
          recruiterName: 'Vikram Patel (HR Lead)',
          recruiterEmail: 'vikram.p@infosys.com',
          resumeName: 'sangavi_backend_java.pdf',
          skillsRequired: 'Java, Spring Boot, SQLite'
        }
      ];

  const handleSendEmail = (e, job) => {
    e.stopPropagation();
    const email = job.recruiterEmail || 'recruiter@company.com';
    const subject = encodeURIComponent(`Follow-up regarding my application for ${job.jobTitle || job.title} position`);
    const body = encodeURIComponent(`Hi ${job.recruiterName || 'Hiring Manager'},\n\nI hope this email finds you well. I submitted my application for the ${job.jobTitle || job.title} role at ${job.companyName || job.company} a few days ago and wanted to express my continued enthusiasm for the opportunity.\n\nPlease let me know if you need any additional information or updated resume details.\n\nBest regards,\nCandidate`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Follow-Up Workspace Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/30 border border-indigo-400/40 px-3 py-1 rounded-full text-xs font-black text-indigo-200">
              <BellRing className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>&gt; 7-Day Inactivity Recruiter Alerts</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Recruiter Follow-up Workspace
            </h2>
            <p className="text-xs md:text-sm text-indigo-200 leading-relaxed font-medium">
              Below are all job applications with no status updates for more than 7 days. Send quick follow-ups to hiring managers to boost your response rate.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center space-x-4 self-start md:self-auto">
            <div className="text-center">
              <p className="text-3xl font-black text-amber-400">{followUpJobs.length}</p>
              <p className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">Action Needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All Follow-Up Application Cards (> 7 Days Inactive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {followUpJobs.map((job) => {
          const daysInactive = calculateDaysInactive(job.appliedDate || job.dateApplied || job.createdAt);
          const company = job.companyName || job.company || 'Company';
          const title = job.jobTitle || job.title || 'Untitled Role';
          const logo = company.charAt(0).toUpperCase();

          return (
            <div
              key={job.id}
              onClick={() => onSelectJob && onSelectJob(job)}
              className="bg-white rounded-3xl p-6 border-2 border-indigo-100 hover:border-indigo-400 shadow-sm hover:shadow-xl transition-all duration-300 relative space-y-4 cursor-pointer group"
            >
              {/* Card Header & Avatar */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                    {logo}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {title}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mt-0.5 flex items-center">
                      <span>{company}</span>
                      <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px]">
                        {job.workMode || 'Remote'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Days Inactive Warning Pill */}
                <div className="flex-shrink-0">
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1 shadow-2xs animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mr-1" />
                    <span>{daysInactive} Days Inactive</span>
                  </span>
                </div>
              </div>

              {/* Details Rows Container */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                
                {/* Offered Salary */}
                <div className="bg-emerald-50/80 border border-emerald-200/80 p-2.5 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Salary Band</span>
                  <p className="text-xs font-black text-emerald-900">
                    ₹ {job.offeredSalary || job.salary || '12 LPA'}
                  </p>
                </div>

                {/* Recruiter Info */}
                <div className="bg-indigo-50/80 border border-indigo-200/80 p-2.5 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">Recruiter Contact</span>
                  <p className="text-xs font-bold text-indigo-900 truncate">
                    {job.recruiterName || 'Hiring Manager'}
                  </p>
                </div>

                {/* Location */}
                <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Location</span>
                  <p className="text-xs font-bold text-slate-800 truncate flex items-center">
                    <MapPin className="w-3 h-3 text-violet-500 mr-1" />
                    <span>{job.location || 'Remote'}</span>
                  </p>
                </div>

                {/* Resume Attached */}
                <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Attached Resume</span>
                  <p className="text-xs font-bold text-slate-800 truncate flex items-center">
                    <FileText className="w-3 h-3 text-violet-600 mr-1" />
                    <span>{job.resumeName || 'profile_resume.pdf'}</span>
                  </p>
                </div>

              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={(e) => handleSendEmail(e, job)}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-colors shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Recruiter</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onSelectJob && onSelectJob(job); }}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
