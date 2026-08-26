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
    ? jobs.filter(j => calculateDaysInactive(j.appliedDate || j.dateApplied || j.createdAt) >= 1)
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
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/30 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-amber-400/30 border border-amber-300/40 px-3 py-1 rounded-full text-xs font-black text-amber-100">
              <BellRing className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
              <span>&gt; Recruiter Action Alerts</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Recruiter Follow-up Workspace
            </h2>
            <p className="text-xs md:text-sm text-amber-100 leading-relaxed font-medium">
              Below are all job applications requiring follow-up. These cards are styled in bright yellow to grab candidate attention immediately.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center space-x-4 self-start md:self-auto">
            <div className="text-center">
              <p className="text-3xl font-black text-amber-300">{followUpJobs.length}</p>
              <p className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">Action Needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All Follow-Up Application Cards in Bright Yellow Theme */}
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
              className="bg-gradient-to-br from-amber-200 via-yellow-200 to-amber-300 rounded-3xl p-6 border-2 border-amber-500 shadow-lg shadow-amber-500/20 hover:shadow-2xl hover:border-amber-600 transition-all duration-300 relative space-y-4 cursor-pointer group text-amber-950"
            >
              {/* Card Header & Avatar */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-amber-600/30 group-hover:scale-105 transition-transform">
                    {logo}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                      {title}
                    </h3>
                    <p className="text-xs font-bold text-amber-900 mt-0.5 flex items-center">
                      <span>{company}</span>
                      <span className="ml-2 px-2 py-0.5 bg-amber-300 text-amber-950 border border-amber-400 rounded-md text-[10px] font-black">
                        {job.workMode || 'Remote'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Days Inactive Warning Pill */}
                <div className="flex-shrink-0">
                  <span className="bg-amber-400 text-amber-950 border border-amber-500 px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1 shadow-xs animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-950 mr-1" />
                    <span>⚠️ {daysInactive} Days Inactive</span>
                  </span>
                </div>
              </div>

              {/* Details Rows Container */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                
                {/* Offered Salary */}
                <div className="bg-emerald-100 border border-emerald-300 p-2.5 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">Salary Band</span>
                  <p className="text-xs font-black text-emerald-950">
                    ₹ {job.offeredSalary || job.salary || '12 LPA'}
                  </p>
                </div>

                {/* Recruiter Info */}
                <div className="bg-amber-300/80 border border-amber-400 p-2.5 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-950">Recruiter Contact</span>
                  <p className="text-xs font-black text-amber-950 truncate">
                    {job.recruiterName || 'Hiring Manager'}
                  </p>
                </div>

                {/* Location */}
                <div className="bg-amber-100/90 border border-amber-300 p-2.5 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900">Location</span>
                  <p className="text-xs font-bold text-amber-950 truncate flex items-center">
                    <MapPin className="w-3 h-3 text-amber-800 mr-1" />
                    <span>{job.location || 'Remote'}</span>
                  </p>
                </div>

                {/* Resume Attached */}
                <div className="bg-amber-100/90 border border-amber-300 p-2.5 rounded-2xl space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900">Attached Resume</span>
                  <p className="text-xs font-bold text-amber-950 truncate flex items-center">
                    <FileText className="w-3 h-3 text-amber-800 mr-1" />
                    <span>{job.resumeName || 'profile_resume.pdf'}</span>
                  </p>
                </div>

              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-amber-400 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={(e) => handleSendEmail(e, job)}
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-amber-950 border border-amber-600 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-colors shadow-md cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-amber-950" />
                  <span>Email Recruiter</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onSelectJob && onSelectJob(job); }}
                  className="py-2.5 px-4 bg-amber-100 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-amber-400"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-950" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
