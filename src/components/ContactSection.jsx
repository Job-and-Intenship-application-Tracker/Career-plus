import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Copy, ExternalLink, RefreshCw } from 'lucide-react';

export default function ContactSection({ onGetStarted }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sentDirectly, setSentDirectly] = useState(false);
  const [copied, setCopied] = useState(false);

  const supportEmail = 'careerplus.support@gmail.com';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) return;

    const mailSubject = formData.subject ? `[CareerPlus Support] ${formData.subject}` : `[CareerPlus Support] Query from ${formData.fullName}`;
    const mailBody = `Name: ${formData.fullName}\nEmail: ${formData.email}\n\nQuery / Issue Details:\n${formData.message}`;

    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    // Immediately open Gmail webmail compose window with original message pre-filled
    try {
      window.open(gmailUrl, '_blank');
    } catch(err) {}

    setSubmittedData({
      ...formData,
      mailtoUrl,
      gmailUrl,
      mailSubject,
      mailBody
    });
  };

  const handleCopyQuery = () => {
    if (!submittedData) return;
    const textToCopy = `To: ${supportEmail}\nFrom: ${submittedData.fullName} (${submittedData.email})\nSubject: ${submittedData.mailSubject}\n\n${submittedData.message}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="contact" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-violet-700 bg-violet-100/80 px-3.5 py-1.5 rounded-full border border-violet-200 shadow-2xs">
            Contact Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Have Questions? We'd Love to Hear From You.
          </h2>
          <p className="text-sm text-slate-600">
            If you encounter any problem or have queries, send your request directly to our dedicated support email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Details Column */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
              <div className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                <Mail className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">CareerPlus Support Email</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Direct Helpdesk &amp; Technical Assistance</p>
                <a 
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${supportEmail}&su=${encodeURIComponent('CareerPlus Candidate Support & Complaint Request')}&body=${encodeURIComponent('Hi CareerPlus Support Team,\n\nI would like to raise a support query / complaint regarding:\n\n')}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-xs font-black text-violet-600 hover:text-violet-800 hover:underline mt-2.5 inline-flex items-center space-x-1 break-all bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-xl border border-violet-200/80 transition-colors cursor-pointer"
                  title="Click to open Gmail and raise a support complaint"
                >
                  <span>{supportEmail}</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <MessageSquare className="w-5.5 h-5.5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">Quick Response Time</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Queries reviewed &amp; answered daily</p>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg mt-2 inline-block">
                  ✓ Active Helpdesk Support
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form & Real Mail Submission Confirmation */}
          <div className="lg:col-span-2 bg-slate-50 p-8 rounded-3xl border border-slate-200/90 shadow-sm">
            {submittedData ? (
              <div className="py-8 space-y-6 animate-in fade-in">
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/80">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-900">Support Request Prepared!</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Your query has been formatted to send directly to <strong>{supportEmail}</strong>
                    </p>
                  </div>
                </div>

                {/* Submitted Query Card Details */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 text-xs space-y-3 font-medium">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Destination Email:</span>
                    <span className="font-extrabold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-md">{supportEmail}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-500">From Candidate:</span>
                    <span className="font-bold text-slate-800">{submittedData.fullName} ({submittedData.email})</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Subject:</span>
                    <span className="font-bold text-slate-800">{submittedData.mailSubject}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Query Details:</span>
                    <p className="p-3 bg-slate-50 rounded-xl text-slate-800 whitespace-pre-wrap font-sans border border-slate-200/60">
                      {submittedData.message}
                    </p>
                  </div>
                </div>

                {/* Real Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={submittedData.gmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-violet-600/20 inline-flex items-center justify-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>Send via Gmail Webmail</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>

                  <a
                    href={submittedData.mailtoUrl}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl inline-flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-violet-600" />
                    <span>Open Mail App</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyQuery}
                    className="px-4 py-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-xs rounded-xl inline-flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-violet-600" />
                    <span>{copied ? '✓ Query Copied!' : 'Copy Query Text'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedData(null);
                      setFormData({ fullName: '', email: '', subject: '', message: '' });
                      setSentDirectly(false);
                    }}
                    className="px-4 py-3 text-slate-500 hover:text-slate-800 text-xs font-bold inline-flex items-center justify-center space-x-1 cursor-pointer ml-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Send Another Query</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Sangavi S"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. candidate@gmail.com"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Issue with Application Tracking or Resume Upload"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Query / Message Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your issue or query for the CareerPlus support team..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-medium">
                    Sends directly to: <strong className="text-violet-700">{supportEmail}</strong>
                  </span>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-black text-xs shadow-md shadow-violet-600/25 flex items-center justify-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>Send Message to Support</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Big Banner CTA */}
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-600 to-cyan-600 p-8 sm:p-12 text-white text-center shadow-2xl shadow-violet-600/30 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Accelerate Your Job Search?
            </h3>
            <p className="text-sm text-violet-100 font-medium">
              Join candidates who organize their applications and land offers faster with CareerPlus.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onGetStarted}
                className="px-8 py-3.5 rounded-2xl bg-white text-violet-700 hover:bg-violet-50 font-extrabold text-base shadow-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                Launch Dashboard Demo
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
