import React, { useState, useEffect } from 'react';
import { X, Briefcase, Building2, Globe, MapPin, User, Mail, Phone, DollarSign, Calendar, Clock, FileText, ArrowRight, ArrowLeft, CheckCircle2, Upload, FileCheck, ShieldCheck, Pencil } from 'lucide-react';

export default function AddApplicationModal({ isOpen, onClose, onAddJob, userResumes = [], onAddResume, editJobData = null }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Job | 2: Recruiter | 3: Resume | 4: Interview | 5: Notes | 6: Review
  const [resumeUploadMode, setResumeUploadMode] = useState('select'); // 'select' | 'upload'
  const [uploadedFileName, setUploadedFileName] = useState('');
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    jobTitle: '',
    applicationType: 'Full-time',
    location: '',
    workMode: 'Remote',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'applied',
    applicationSource: 'LinkedIn',
    recruiterName: '',
    recruiterEmail: '',
    recruiterPhone: '',
    offeredSalary: '',
    interviewDate: '',
    interviewTime: '',
    interviewRound: '', // Manually typed text input field
    interviewType: 'Online',
    skillsRequired: '',
    notes: '',
    followUpDate: '',
    resumeName: ''
  });

  const [errors, setErrors] = useState({});

  // Pre-populate form fields when editJobData changes or modal opens in Edit Mode
  useEffect(() => {
    if (editJobData && isOpen) {
      setFormData({
        companyName: editJobData.companyName || editJobData.company || '',
        companyWebsite: editJobData.companyWebsite || '',
        jobTitle: editJobData.jobTitle || editJobData.title || '',
        applicationType: editJobData.applicationType || 'Full-time',
        location: editJobData.location || '',
        workMode: editJobData.workMode || 'Remote',
        appliedDate: editJobData.appliedDate || new Date().toISOString().split('T')[0],
        status: editJobData.status || 'applied',
        applicationSource: editJobData.applicationSource || 'LinkedIn',
        recruiterName: editJobData.recruiterName || '',
        recruiterEmail: editJobData.recruiterEmail || '',
        recruiterPhone: editJobData.recruiterPhone || '',
        offeredSalary: editJobData.offeredSalary || '',
        interviewDate: editJobData.interviewDate || '',
        interviewTime: editJobData.interviewTime || '',
        interviewRound: editJobData.interviewRound || '',
        interviewType: editJobData.interviewType || 'Online',
        skillsRequired: editJobData.skillsRequired || (Array.isArray(editJobData.tags) ? editJobData.tags.join(', ') : ''),
        notes: editJobData.notes || editJobData.jobDescription || '',
        followUpDate: editJobData.followUpDate || '',
        resumeName: editJobData.resumeName || ''
      });
      setCurrentStep(1);
    }
  }, [editJobData, isOpen]);

  // Auto-select first stored profile resume if resumeName is empty
  useEffect(() => {
    if (userResumes && userResumes.length > 0 && (!formData.resumeName || formData.resumeName === '') && !editJobData) {
      const firstRes = userResumes[0];
      const formatted = `${firstRes.title} (${firstRes.fileName})`;
      setFormData(prev => ({ ...prev, resumeName: formatted }));
    }
  }, [userResumes, isOpen, editJobData]);

  if (!isOpen) return null;

  const isEditMode = !!editJobData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Manual Resume File Upload (.pdf, .doc, .docx)
  const handleManualFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileNameStr = file.name;
      const fileSizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const resumeTitle = fileNameStr.replace(/\.[^/.]+$/, "").replaceAll('_', ' ');

      setUploadedFileName(fileNameStr);
      const formattedResumeName = `${resumeTitle} (${fileNameStr})`;
      setFormData(prev => ({ ...prev, resumeName: formattedResumeName }));

      // Save to user profile resumes if callback exists
      if (onAddResume) {
        onAddResume({
          id: 'res-' + Date.now(),
          title: resumeTitle,
          fileName: fileNameStr,
          fileSize: fileSizeStr,
          createdAt: 'Just now'
        });
      }
    }
  };

  const validateUrl = (url) => {
    if (!url) return true;
    return /^https?:\/\/.+/.test(url);
  };

  const validateEmail = (email) => {
    if (!email) return true;
    return /\S+@\S+\.\S+/.test(email);
  };

  // Validate Current Step before moving Next
  const handleNextStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Company Name is required';
      }
      if (!formData.jobTitle.trim()) {
        newErrors.jobTitle = 'Job Title is required';
      }
      if (formData.companyWebsite && !validateUrl(formData.companyWebsite)) {
        newErrors.companyWebsite = 'Website URL must start with http:// or https://';
      }
    } else if (currentStep === 2) {
      if (formData.recruiterEmail && !validateEmail(formData.recruiterEmail)) {
        newErrors.recruiterEmail = 'Please enter a valid recruiter email address';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const handlePrevStep = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Final Submission / Update on Step 6
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final check for step 1 required fields
    if (!formData.companyName.trim() || !formData.jobTitle.trim()) {
      setCurrentStep(1);
      setErrors({
        companyName: !formData.companyName.trim() ? 'Company Name is required' : '',
        jobTitle: !formData.jobTitle.trim() ? 'Job Title is required' : ''
      });
      return;
    }

    const tagsArray = formData.skillsRequired
      ? formData.skillsRequired.split(',').map(t => t.trim()).filter(Boolean)
      : ['Full-time'];

    const jobPayload = {
      id: isEditMode ? editJobData.id : 'job-' + Date.now(),
      title: formData.jobTitle.trim(),
      company: formData.companyName.trim(),
      companyName: formData.companyName.trim(),
      companyWebsite: formData.companyWebsite.trim(),
      jobTitle: formData.jobTitle.trim(),
      applicationType: formData.applicationType,
      location: formData.location.trim() || 'Remote',
      workMode: formData.workMode,
      appliedDate: formData.appliedDate || 'Recently',
      status: formData.status,
      applicationSource: formData.applicationSource,
      recruiterName: formData.recruiterName.trim() || 'Hiring Manager',
      recruiterEmail: formData.recruiterEmail.trim(),
      recruiterPhone: formData.recruiterPhone.trim(),
      offeredSalary: formData.offeredSalary.trim(),
      interviewDate: formData.interviewDate,
      interviewTime: formData.interviewTime,
      interviewRound: formData.interviewRound.trim() || 'Technical Round',
      interviewType: formData.interviewType,
      skillsRequired: formData.skillsRequired.trim(),
      notes: formData.notes.trim(),
      followUpDate: formData.followUpDate,
      resumeName: formData.resumeName || (userResumes[0]?.title ? `${userResumes[0].title} (${userResumes[0].fileName})` : 'Standard Candidate Resume.pdf'),
      tags: tagsArray,
      logo: formData.companyName.charAt(0).toUpperCase()
    };

    onAddJob(jobPayload);
    
    // Reset form
    setFormData({
      companyName: '',
      companyWebsite: '',
      jobTitle: '',
      applicationType: 'Full-time',
      location: '',
      workMode: 'Remote',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'applied',
      applicationSource: 'LinkedIn',
      recruiterName: '',
      recruiterEmail: '',
      recruiterPhone: '',
      offeredSalary: '',
      interviewDate: '',
      interviewTime: '',
      interviewRound: '',
      interviewType: 'Online',
      skillsRequired: '',
      notes: '',
      followUpDate: '',
      resumeName: ''
    });
    setUploadedFileName('');
    setCurrentStep(1);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl ${isEditMode ? 'bg-amber-600' : 'bg-blue-600'} text-white flex items-center justify-center shadow-md`}>
              {isEditMode ? <Pencil className="w-5.5 h-5.5" /> : <Briefcase className="w-5.5 h-5.5" />}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {isEditMode ? `Edit Application: ${formData.companyName || 'Job'}` : 'Add Application'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentStep === 6 ? 'Step 6 of 6 • Review & Finish Application' : `Step ${currentStep} of 6 • Sequential Application Wizard`}
              </p>
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

        {/* Step Indicator Progress Bar (6 Steps) */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200/60 flex items-center justify-between gap-1 overflow-x-auto custom-scrollbar">
          {[
            { stepNum: 1, label: 'Job' },
            { stepNum: 2, label: 'Recruiter' },
            { stepNum: 3, label: 'Resume' },
            { stepNum: 4, label: 'Interview' },
            { stepNum: 5, label: 'Notes' },
            { stepNum: 6, label: 'Review' },
          ].map(s => (
            <div key={s.stepNum} className="flex-1 flex items-center space-x-1.5 min-w-max">
              <div className={`w-6.5 h-6.5 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                currentStep === s.stepNum ? 'bg-blue-600 text-white shadow-xs scale-105' :
                currentStep > s.stepNum ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > s.stepNum ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.stepNum}
              </div>
              <span className={`text-[11px] font-semibold hidden sm:inline ${
                currentStep === s.stepNum ? 'text-blue-700 font-bold' : 'text-slate-500'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">
          
          {/* STEP 1: Company & Job Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Step 1: Company &amp; Job Details
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company Name <span className="text-rose-500 font-black">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Google, Stripe, Microsoft"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border ${
                        errors.companyName ? 'border-rose-400 ring-2 ring-rose-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none`}
                    />
                  </div>
                  {errors.companyName && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.companyName}</p>}
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Job Title <span className="text-rose-500 font-black">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="jobTitle"
                      required
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Engineer"
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border ${
                        errors.jobTitle ? 'border-rose-400 ring-2 ring-rose-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none`}
                    />
                  </div>
                  {errors.jobTitle && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.jobTitle}</p>}
                </div>
              </div>

              {/* Company Website */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Website (URL)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                {errors.companyWebsite && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.companyWebsite}</p>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Application Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    App Type
                  </label>
                  <select
                    name="applicationType"
                    value={formData.applicationType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Work Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Work Mode
                  </label>
                  <select
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                {/* Application Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Stage Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                  >
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Application Source */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Source
                  </label>
                  <select
                    name="applicationSource"
                    value={formData.applicationSource}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Company Website">Company Website</option>
                    <option value="Indeed">Indeed</option>
                    <option value="Referral">Referral</option>
                    <option value="College Placement">College Placement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Application Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Application Date
                  </label>
                  <input
                    type="date"
                    name="appliedDate"
                    value={formData.appliedDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Recruiter Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Step 2: Recruiter Contact Information
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Recruiter / Contact Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="recruiterName"
                    value={formData.recruiterName}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Connor"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recruiter Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Recruiter Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      name="recruiterEmail"
                      value={formData.recruiterEmail}
                      onChange={handleChange}
                      placeholder="sarah@company.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  {errors.recruiterEmail && <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.recruiterEmail}</p>}
                </div>

                {/* Recruiter Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Recruiter Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      name="recruiterPhone"
                      value={formData.recruiterPhone}
                      onChange={handleChange}
                      placeholder="+1 (555) 019-2834"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Compensation & Resume */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Step 3: Compensation &amp; Attached Resume
              </h4>

              {/* Offered Salary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Offered Salary (LPA / Per Annum)
                </label>
                <div className="relative">
                  <div className="w-4 h-4 absolute left-3.5 top-3 font-black text-emerald-700 text-xs flex items-center justify-center pointer-events-none">
                    ₹
                  </div>
                  <input
                    type="text"
                    name="offeredSalary"
                    value={formData.offeredSalary}
                    onChange={handleChange}
                    placeholder="e.g. 12 LPA (Lakhs Per Annum)"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Resume Mode Toggle Tabs */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Attach Candidate Resume
                </label>
                
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setResumeUploadMode('select')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      resumeUploadMode === 'select' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Select Stored Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeUploadMode('upload')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 ${
                      resumeUploadMode === 'upload' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File Manually</span>
                  </button>
                </div>

                {/* Mode A: Select Stored Profile Resume */}
                {resumeUploadMode === 'select' && (
                  <div>
                    <select
                      name="resumeName"
                      value={formData.resumeName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    >
                      {userResumes && userResumes.length > 0 ? (
                        userResumes.map(res => {
                          const optionVal = `${res.title} (${res.fileName})`;
                          return (
                            <option key={res.id} value={optionVal}>
                              📄 {res.title} ({res.fileName})
                            </option>
                          );
                        })
                      ) : (
                        <option value="Standard Candidate Resume.pdf">📄 Standard Candidate Resume.pdf</option>
                      )}
                    </select>
                  </div>
                )}

                {/* Mode B: Manual Resume File Picker */}
                {resumeUploadMode === 'upload' && (
                  <div className="space-y-2">
                    <label className="block p-4 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 rounded-2xl cursor-pointer text-center transition-all">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleManualFileUpload}
                        className="hidden"
                      />
                      <div className="space-y-1">
                        <Upload className="w-6 h-6 text-blue-600 mx-auto" />
                        <p className="text-xs font-bold text-slate-800">
                          {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click to Browse & Upload Resume File'}
                        </p>
                        <p className="text-[11px] text-slate-500">Supports PDF, DOC, or DOCX formats</p>
                      </div>
                    </label>

                    {uploadedFileName && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs font-semibold text-emerald-800">
                        <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Resume attached: <strong>{uploadedFileName}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* STEP 4: Interview & Reminders */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Step 4: Interview Details &amp; Follow-up
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Interview Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    name="interviewDate"
                    value={formData.interviewDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Interview Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Interview Time
                  </label>
                  <input
                    type="time"
                    name="interviewTime"
                    value={formData.interviewTime}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Interview Round - MANUALLY TYPED TEXT FIELD */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Interview Round Name / Details (Manually Typed Text)
                </label>
                <input
                  type="text"
                  name="interviewRound"
                  value={formData.interviewRound}
                  onChange={handleChange}
                  placeholder="e.g. Technical System Design Round 2, HR Culture Screen, Technical Coding"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Interview Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Interview Location Type
                  </label>
                  <select
                    name="interviewType"
                    value={formData.interviewType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Online">Online Video Call</option>
                    <option value="Offline">Offline On-site</option>
                    <option value="Phone">Phone Screen</option>
                  </select>
                </div>

                {/* Follow-up Reminder Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Follow-up Reminder Date
                  </label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Skills & Notes */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Step 5: Skills &amp; Notes Log
              </h4>

              {/* Skills Required */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Skills Required (Comma Separated)
                </label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  placeholder="e.g. React, TypeScript, Node.js, REST API"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Private Application Notes &amp; Preparation Logs
                </label>
                <textarea
                  rows={4}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add notes about key questions, recruiter feedback, technical preparation..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 6: Final Review & Confirmation Summary Screen */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center space-x-2 text-xs text-blue-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Review all application details below before clicking <strong>{isEditMode ? 'Finish & Update Application' : 'Finish & Submit Application'}</strong>.</span>
              </div>

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Card 1: Job & Company */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-blue-600" /> Company &amp; Role
                  </h5>
                  <p><strong className="text-slate-900">{formData.jobTitle || 'Role'}</strong> at <strong>{formData.companyName || 'Company'}</strong></p>
                  <p className="text-slate-500">{formData.location || 'Remote'} • {formData.applicationType} • {formData.workMode}</p>
                  <p className="text-slate-500">Source: {formData.applicationSource} • Applied: {formData.appliedDate}</p>
                </div>

                {/* Card 2: Recruiter Contact */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-blue-600" /> Recruiter Details
                  </h5>
                  <p><strong>{formData.recruiterName || 'Hiring Manager'}</strong></p>
                  <p className="text-slate-500">{formData.recruiterEmail || 'No email provided'}</p>
                  <p className="text-slate-500">{formData.recruiterPhone || 'No phone provided'}</p>
                </div>

                {/* Card 3: Salary & Attached Resume */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center">
                    <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Salary &amp; Resume
                  </h5>
                  <p>Offered Salary: <strong className="text-emerald-700">{formData.offeredSalary || 'N/A'}</strong></p>
                  <p className="text-blue-700 font-bold flex items-center truncate">
                    <FileText className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{formData.resumeName || 'Standard Candidate Resume.pdf'}</span>
                  </p>
                </div>

                {/* Card 4: Interview Schedule */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-amber-600" /> Interview &amp; Reminders
                  </h5>
                  <p>Date &amp; Time: <strong>{formData.interviewDate || 'Not set'} {formData.interviewTime}</strong></p>
                  <p>Round: <strong>{formData.interviewRound || 'Technical Round'}</strong> ({formData.interviewType})</p>
                  <p className="text-indigo-700">Follow-up Date: {formData.followUpDate || 'None'}</p>
                </div>

              </div>

              {/* Skills & Notes Summary */}
              {(formData.skillsRequired || formData.notes) && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  {formData.skillsRequired && (
                    <p><strong>Skills:</strong> {formData.skillsRequired}</p>
                  )}
                  {formData.notes && (
                    <p className="text-slate-600 italic">"{formData.notes}"</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Wizard Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-xs font-black text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditMode ? 'Finish & Update Application' : 'Finish & Submit Application'}</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
