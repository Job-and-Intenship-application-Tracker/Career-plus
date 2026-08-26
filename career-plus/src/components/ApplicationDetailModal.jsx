import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, Calendar, User, DollarSign, Clock, ShieldAlert, FileText, Trash2, RefreshCw, Send, Globe, Mail, Phone, Plus, Pencil, CheckCircle2 } from 'lucide-react';

export default function ApplicationDetailModal({ isOpen, onClose, job, onUpdateStatus, onDeleteJob, onAddNote, onEditJob }) {
  const [noteText, setNoteText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(job?.status || 'applied');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingNotesDrawer, setIsEditingNotesDrawer] = useState(false);

  // Pre-populate notes in drawer when job changes or drawer opens
  useEffect(() => {
    if (job) {
      setNoteText(job.notes || job.jobDescription || '');
    }
  }, [job, isEditingNotesDrawer]);

  if (!isOpen || !job) return null;

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(job.id, newStatus);
    }
    setIsEditingStatus(false);
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
  const notesContent = job.notes || job.jobDescription;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
              {company.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  job.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                  job.status === 'interviewing' ? 'bg-amber-100 text-amber-800' :
                  job.status === 'offered' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {job.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">{company} • {job.location || 'Remote'} • {job.applicationType || 'Full-time'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
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
              <p className="font-bold text-slate-800 mt-0.5">{job.appliedDate || 'Recently'}</p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Offered Salary</p>
              <p className="font-bold text-emerald-700 mt-0.5">{job.offeredSalary || 'N/A'}</p>
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

            {/* Interview Details */}
            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Interview Date</p>
              <p className="font-bold text-slate-800 mt-0.5">{job.interviewDate || 'Not Scheduled'}</p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Interview Round</p>
              <p className="font-bold text-slate-800 mt-0.5">{job.interviewRound || 'Technical Round'}</p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Interview Type</p>
              <p className="font-bold text-slate-800 mt-0.5">{job.interviewType || 'Online'}</p>
            </div>

            <div>
              <p className="text-slate-400 font-semibold uppercase text-[10px]">Follow-up Date</p>
              <p className="font-bold text-indigo-700 mt-0.5">{job.followUpDate || 'None Set'}</p>
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

            {notesContent ? (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans shadow-2xs">
                {notesContent}
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/50 text-xs text-slate-400 italic">
                no notes are available
              </div>
            )}
          </div>

          {/* Inline Edit Notes Form Drawer */}
          {isEditingNotesDrawer && (
            <form onSubmit={handleSaveNotesSubmit} className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Edit / Add Application Notes</span>
                <button
                  type="button"
                  onClick={() => setIsEditingNotesDrawer(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <textarea
                rows={4}
                required
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Edit existing notes or type new application logs..."
                className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-sans leading-relaxed"
              ></textarea>

              <div className="flex justify-end space-x-2">
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
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* Update Status */}
              <button
                type="button"
                onClick={() => setIsEditingStatus(!isEditingStatus)}
                className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center space-x-1.5 border border-blue-200 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>

              {/* Edit Notes (Replaced Add Note) */}
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

            {/* Inline Status Selection Drawer */}
            {isEditingStatus && (
              <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-around gap-2 animate-in fade-in">
                {['applied', 'interviewing', 'offered', 'rejected'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize cursor-pointer transition-all ${
                      job.status === st ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
