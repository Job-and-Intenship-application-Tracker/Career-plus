import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, Calendar, User, DollarSign, Clock, ShieldAlert, FileText, Trash2, RefreshCw, Send, Globe, Mail, Phone, Plus, Pencil, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const formatDateString = (dateVal) => {
  if (!dateVal || dateVal === 'Recently' || dateVal === 'N/A' || dateVal === 'Not Scheduled' || dateVal === 'None Set' || dateVal === 'Not Reached') {
    return dateVal || 'Not Reached';
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

export default function ApplicationDetailModal({ isOpen, onClose, job, onUpdateStatus, onDeleteJob, onAddNote, onEditJob }) {
  const [noteText, setNoteText] = useState('');
  const [isEditingNotesDrawer, setIsEditingNotesDrawer] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];

  // Status transition prompt modal state
  const [statusPrompt, setStatusPrompt] = useState({
    isOpen: false,
    targetStatus: '',
    transitionDate: todayStr
  });

  // Pre-populate notes in drawer when job changes or drawer opens
  useEffect(() => {
    if (job) {
      setNoteText(job.notes || job.notesAndDescription || job.description || job.jobDescription || job.notesText || '');
    }
  }, [job, isEditingNotesDrawer]);

  if (!isOpen || !job) return null;

  const flowDates = getFlowDates(job);

  const handleOpenStatusPrompt = (newStatus) => {
    if (newStatus === job.status) return;
    setStatusPrompt({
      isOpen: true,
      targetStatus: newStatus,
      transitionDate: todayStr
    });
  };

  const confirmStatusTransition = () => {
    if (onUpdateStatus && statusPrompt.targetStatus) {
      onUpdateStatus(job.id, statusPrompt.targetStatus, statusPrompt.transitionDate);
    }
    setStatusPrompt({ isOpen: false, targetStatus: '', transitionDate: todayStr });
  };

  const handleSaveNotesSubmit = (e) => {
    e.preventDefault();
    if (onAddNote) {
      onAddNote(job.id, noteText.trim());
    }
    setIsEditingNotesDrawer(false);
  };

  const company = job.companyName || job.company || 'Company';
  const title = job.jobTitle || job.title || 'Role';
  const priorityScore = job.priorityScore || job.priority?.score || 45;
  const priorityLevel = job.priorityLevel || job.priority?.level || (priorityScore >= 70 ? 'HIGH' : priorityScore >= 40 ? 'MEDIUM' : 'LOW');

  const statusThemes = {
    applied: { bg: 'bg-violet-100 text-violet-800 border-violet-200', text: 'APPLIED' },
    interviewing: { bg: 'bg-amber-100 text-amber-800 border-amber-200', text: 'INTERVIEWING' },
    offered: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'OFFERED' },
    rejected: { bg: 'bg-rose-100 text-rose-800 border-rose-200', text: 'REJECTED' },
  };
  const theme = statusThemes[(job.status || 'applied').toLowerCase()] || statusThemes.applied;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl overflow-hidden my-8 transform transition-all relative">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-md">
              {company.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{title}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${theme.bg}`}>
                  {theme.text}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {company} • {job.location || 'Remote'} • {job.applicationType || 'Full-time'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Quick Meta Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {job.companyWebsite && (
              <a href={job.companyWebsite} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold transition-colors">
                <Globe className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Website
              </a>
            )}
            <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 rounded-xl text-slate-600 font-semibold">
              Source: {job.applicationSource || 'LinkedIn'}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 rounded-xl text-slate-600 font-semibold">
              Work Mode: {job.workMode || 'Remote'}
            </span>
          </div>

          {/* Application Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs">
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Applied Date</p>
              <p className="font-bold text-slate-800 mt-0.5">{formatDateString(flowDates.applied)}</p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Last Updated Date</p>
              <p className="font-extrabold text-violet-700 mt-0.5">
                {formatDateString(job.lastStatusChangeDate || job.updatedAt || job.appliedDate || todayStr)}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Priority Score</p>
              <p className="font-black text-slate-900 mt-0.5">{priorityScore} / 100 ({priorityLevel})</p>
            </div>

            {/* Recruiter Section */}
            <div className="sm:col-span-2">
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Recruiter Contact</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {job.recruiterName || 'Hiring Manager'}
                {job.recruiterEmail && <span className="text-slate-500 font-normal"> ({job.recruiterEmail})</span>}
              </p>
            </div>

            {/* Attached Resume */}
            <div className="sm:col-span-2">
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Attached Resume</p>
              <p className="font-bold text-blue-700 mt-0.5 flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                <span className="truncate">{job.resumeName || 'Standard Candidate Resume.pdf'}</span>
              </p>
            </div>


          </div>

          {/* Progressive Status Transition Flow Timeline */}
          <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Status Transition Dates History Flow
              </h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sequential Flow</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
              
              {/* Step 1: Applied Date */}
              <div className={`p-2.5 rounded-xl border transition-all ${
                flowDates.applied
                  ? 'bg-blue-50/90 border-blue-300 text-slate-800 shadow-2xs'
                  : 'bg-slate-100/80 border-slate-200/60 opacity-40 filter grayscale cursor-not-allowed'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  flowDates.applied ? 'text-blue-700' : 'text-slate-400'
                }`}>
                  📌 Applied Date
                </span>
                <p className="font-extrabold text-slate-900 mt-0.5">
                  {formatDateString(flowDates.applied) || 'Not Reached'}
                </p>
              </div>

              {/* Step 2: Interviewing Date */}
              <div className={`p-2.5 rounded-xl border transition-all ${
                flowDates.interviewing
                  ? 'bg-amber-50/90 border-amber-300 text-slate-800 shadow-2xs'
                  : 'bg-slate-100/80 border-slate-200/60 opacity-40 filter grayscale cursor-not-allowed'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  flowDates.interviewing ? 'text-amber-700' : 'text-slate-400'
                }`}>
                  ⏰ Interviewing Date
                </span>
                <p className="font-extrabold text-slate-900 mt-0.5">
                  {formatDateString(flowDates.interviewing) || 'Not Reached'}
                </p>
              </div>

              {/* Step 3: Offered Date */}
              <div className={`p-2.5 rounded-xl border transition-all ${
                flowDates.offered
                  ? 'bg-emerald-50/90 border-emerald-300 text-slate-800 shadow-2xs'
                  : 'bg-slate-100/80 border-slate-200/60 opacity-40 filter grayscale cursor-not-allowed'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  flowDates.offered ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  🏆 Offered Date
                </span>
                <p className="font-extrabold text-slate-900 mt-0.5">
                  {formatDateString(flowDates.offered) || 'Not Reached'}
                </p>
              </div>

              {/* Step 4: Rejected Date */}
              <div className={`p-2.5 rounded-xl border transition-all ${
                flowDates.rejected
                  ? 'bg-rose-50/90 border-rose-300 text-slate-800 shadow-2xs'
                  : 'bg-slate-100/80 border-slate-200/60 opacity-40 filter grayscale cursor-not-allowed'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-wider block ${
                  flowDates.rejected ? 'text-rose-700' : 'text-slate-400'
                }`}>
                  ❌ Rejected Date
                </span>
                <p className="font-extrabold text-slate-900 mt-0.5">
                  {formatDateString(flowDates.rejected) || 'Not Reached'}
                </p>
              </div>

            </div>
          </div>

          {/* Skills Required */}
          {job.skillsRequired && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Skills Required</h4>
              <div className="flex flex-wrap gap-1.5">
                {job.skillsRequired.split(',').map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Real-time Notes & Description Panel with Edit Notes Link */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Notes &amp; Description</h4>
              <button
                type="button"
                onClick={() => setIsEditingNotesDrawer(!isEditingNotesDrawer)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Notes</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
              {job.notes || job.jobDescription || <span className="text-slate-400 italic">no notes are available</span>}
            </div>
          </div>

          {/* Inline Edit Notes Form Drawer */}
          {isEditingNotesDrawer && (
            <form onSubmit={handleSaveNotesSubmit} className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200/80 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center">
                  <Pencil className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                  Edit Notes for {company}
                </label>
                <span className="text-[11px] text-indigo-600 font-medium">Real-time Auto Sync</span>
              </div>
              <textarea
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type preparation notes, recruiter contacts, or referral details..."
                className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none shadow-2xs"
              />
              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditingNotesDrawer(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>
            </form>
          )}

          {/* Action Buttons Row */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Actions</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              
              {/* Update Status Dropdown Select Menu */}
              <div className="relative col-span-1">
                <select
                  value={job.status || 'applied'}
                  onChange={(e) => handleOpenStatusPrompt(e.target.value)}
                  className="w-full py-2.5 pl-3 pr-8 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs appearance-none transition-all"
                >
                  <option value="applied">Status: Applied 📌</option>
                  <option value="interviewing">Status: Interviewing ⏰</option>
                  <option value="offered">Status: Offered 🏆</option>
                  <option value="rejected">Status: Rejected ❌</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-blue-600">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Edit Notes */}
              <button
                type="button"
                onClick={() => setIsEditingNotesDrawer(!isEditingNotesDrawer)}
                className="py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center space-x-1.5 border border-indigo-200 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Notes</span>
              </button>

              {/* Edit Application */}
              <button
                type="button"
                onClick={() => {
                  if (onEditJob) onEditJob(job);
                }}
                className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center space-x-1.5 border border-amber-200 transition-colors cursor-pointer"
                title="Edit Application Details in Form"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Application</span>
              </button>

              {/* Remove Entry */}
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete application for ${company}?`)) {
                    if (onDeleteJob) onDeleteJob(job.id);
                    onClose();
                  }
                }}
                className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center space-x-1.5 border border-rose-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Entry</span>
              </button>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

        {/* Interactive Status Transition Date Modal Prompt */}
        {statusPrompt.isOpen && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    Update Status to "{statusPrompt.targetStatus.toUpperCase()}"
                  </h3>
                </div>
                <button 
                  type="button" 
                  onClick={() => setStatusPrompt({ isOpen: false, targetStatus: '', transitionDate: todayStr })}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                Please enter the date when this application reached the <strong>{statusPrompt.targetStatus}</strong> stage:
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {statusPrompt.targetStatus.toUpperCase()} Stage Date
                </label>
                <input
                  type="date"
                  value={statusPrompt.transitionDate}
                  onChange={(e) => setStatusPrompt(prev => ({ ...prev, transitionDate: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setStatusPrompt({ isOpen: false, targetStatus: '', transitionDate: todayStr })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmStatusTransition}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Save Status &amp; Date Flow
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
