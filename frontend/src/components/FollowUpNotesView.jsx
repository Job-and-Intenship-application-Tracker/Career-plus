import React, { useState } from 'react';
import { BellRing, FileText, Calendar, Plus, Clock, CheckCircle2 } from 'lucide-react';

export default function FollowUpNotesView({ jobs = [] }) {
  const [activeNotesJobId, setActiveNotesJobId] = useState(jobs[0]?.id || null);
  const [notesInput, setNotesInput] = useState('');
  const [notesList, setNotesList] = useState([
    { id: 1, text: 'Sent follow-up email to technical recruiter.', date: '2 days ago' },
    { id: 2, text: 'Completed System Design assessment challenge.', date: '4 days ago' }
  ]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!notesInput.trim()) return;
    setNotesList(prev => [{ id: Date.now(), text: notesInput, date: 'Just now' }, ...prev]);
    setNotesInput('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* 7-Day Inactivity & Reminders Column */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Inactivity Alert Box */}
        <div className="bg-indigo-50/80 rounded-3xl p-6 border border-indigo-200 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-sm">
            <BellRing className="w-4.5 h-4.5" />
            <span>7-Day Inactivity Reminder</span>
          </div>
          <p className="text-xs text-indigo-900 leading-relaxed">
            Applications with no status updates for more than 7 days trigger automatic reminder alerts to maintain high response rates.
          </p>
        </div>

        {/* Reminders Panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Scheduled Reminders
          </h4>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Due Tomorrow
                </span>
                <p className="text-xs font-bold text-slate-900">Recruiter Check-in</p>
                <p className="text-[11px] text-slate-500">TechCorp • Senior React Dev</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-slate-400 hover:text-emerald-600 cursor-pointer" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  In 3 Days
                </span>
                <p className="text-xs font-bold text-slate-900">Prepare System Design Deck</p>
                <p className="text-[11px] text-slate-500">Stripe • Product Engineer</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-slate-400 hover:text-emerald-600 cursor-pointer" />
            </div>
          </div>
        </div>

      </div>

      {/* Application Notes Panel */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Per-Application Notes Panel</h4>
              <p className="text-xs text-slate-500">Keep private logs, recruiter contact details, and interview takeaways</p>
            </div>
          </div>
        </div>

        {/* Add Note Input Form */}
        <form onSubmit={handleAddNote} className="space-y-3">
          <textarea
            rows={3}
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            placeholder="Type a new note (e.g. Recruiter mentioned salary band is $145k-$165k)..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          ></textarea>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Log Note</span>
            </button>
          </div>
        </form>

        {/* Notes Log Feed */}
        <div className="space-y-3 pt-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Notes Log History</h5>
          
          <div className="space-y-3">
            {notesList.map((note) => (
              <div key={note.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-800 leading-relaxed">{note.text}</p>
                  <p className="text-[10px] text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Logged {note.date}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
