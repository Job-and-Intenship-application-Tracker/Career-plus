import React, { useState, useEffect } from 'react';
import { X, Briefcase, Building2, Globe, MapPin, User, Mail, Phone, DollarSign, Calendar, Clock, FileText, ArrowRight, ArrowLeft, CheckCircle2, Upload, FileCheck, ShieldCheck, Pencil } from 'lucide-react';

export default function AddApplicationModal({ isOpen, onClose, onAddJob, userResumes = [], onAddResume, editJobData = null }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Job | 2: Recruiter | 3: Resume | 4: Interview | 5: Notes & Finish
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

  // Final Submission / Update Handler (Directly called on Step 5 or Finish)
  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
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
    
    // Reset form & close modal automatically
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

  // Validate Current Step before moving Next
  const handleNextStep = (e) => {
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
    if (currentStep === 5) {
      handleSubmit(e);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden my-8 transform transition-all">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {isEditMode ? <Pencil className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {isEditMode ? 'Edit Application Details' : 'Add New Job Application'}
              </h3>
              <p className="text-xs text-slate-500">
                Step {currentStep} of 5 • Sequential Application Wizard
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

        {/* Step Indicator Progress Bar (5 Steps - Review Step Removed) */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200/60 flex items-center justify-between gap-1 overflow-x-auto custom-scrollbar">
          {[
            { stepNum: 1, label: 'Job' },
            { stepNum: 2, label: 'Recruiter' },
            { stepNum: 3, label: 'Resume' },
            { stepNum: 4, label: 'Interview' },
            { stepNum: 5, label: 'Notes & Finish' },
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Google, Microsoft, Amazon"
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border ${errors.companyName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'} rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 transition-all`}
                    />
                  </div>
                  {errors.companyName && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Title <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Engineer"
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border ${errors.jobTitle ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'} rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 transition-all`}
                    />
                  </div>
                  {errors.jobTitle && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.jobTitle}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Website</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      placeholder="https://careers.company.com"
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border ${errors.companyWebsite ? 'border-rose-400' : 'border-slate-200'} rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all`}
                    />
                  </div>
                  {errors.companyWebsite && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.companyWebsite}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location &amp; Work Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Coimbatore / Remote"
                        className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <select
                      name="workMode"
                      value={formData.workMode}
                      onChange={handleChange}
                      className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employment Type</label>
                  <select
                    name="applicationType"
                    value={formData.applicationType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Application Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  >
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source / Channel</label>
                  <select
                    name="applicationSource"
                    value={formData.applicationSource}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
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
            </div>
          )}

          {/* STEP 2: Recruiter Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Step 2: Recruiter &amp; HR Contact Details
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter / HR Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="recruiterName"
                    value={formData.recruiterName}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins (Talent Acquisition Lead)"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      name="recruiterEmail"
                      value={formData.recruiterEmail}
                      onChange={handleChange}
                      placeholder="sarah.j@company.com"
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border ${errors.recruiterEmail ? 'border-rose-400' : 'border-slate-200'} rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all`}
                    />
                  </div>
                  {errors.recruiterEmail && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.recruiterEmail}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="recruiterPhone"
                      value={formData.recruiterPhone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offered / Expected Salary (CTC)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="offeredSalary"
                    value={formData.offeredSalary}
                    onChange={handleChange}
                    placeholder="e.g. ₹6,50,000 / annum or $85,000"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Resume Selection */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Step 3: Resume Version Submitted
              </h4>

              {/* Mode Toggle Buttons */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setResumeUploadMode('select')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    resumeUploadMode === 'select'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Choose From Profile Resumes ({userResumes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setResumeUploadMode('upload')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    resumeUploadMode === 'upload'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload New PDF / DOCX
                </button>
              </div>

              {resumeUploadMode === 'select' ? (
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-bold text-slate-700">Select Resume File</label>
                  {userResumes.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {userResumes.map(res => {
                        const formattedName = `${res.title} (${res.fileName})`;
                        const isSelected = formData.resumeName === formattedName;
                        return (
                          <div
                            key={res.id}
                            onClick={() => setFormData(prev => ({ ...prev, resumeName: formattedName }))}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <FileCheck className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                              <div>
                                <p className="text-xs font-bold">{res.title}</p>
                                <p className="text-[11px] text-slate-500">{res.fileName} • {res.fileSize || 'PDF'}</p>
                              </div>
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800">
                      No saved resumes found in user profile. Please switch to the "Upload New PDF / DOCX" tab above to attach your resume file.
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-1 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">Upload Local File (.pdf, .doc, .docx)</label>
                  <div className="border-2 border-dashed border-blue-300/80 bg-blue-50/30 hover:bg-blue-50/60 p-6 rounded-2xl text-center transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleManualFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-slate-800">Click to browse or drag and drop your resume file</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-1">Supports PDF, DOC, DOCX up to 10 MB</p>
                  </div>

                  {uploadedFileName && (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center space-x-2 text-xs font-bold text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Attached: {uploadedFileName}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Interview & Reminders */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Step 4: Interview Schedule &amp; Follow-up Reminder
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Interview Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      name="interviewDate"
                      value={formData.interviewDate}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Interview Time</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="time"
                      name="interviewTime"
                      value={formData.interviewTime}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Interview Round (Custom Text Input)</label>
                  <input
                    type="text"
                    name="interviewRound"
                    value={formData.interviewRound}
                    onChange={handleChange}
                    placeholder="e.g. Technical Round 1, System Design, HR Screening"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Interview Format</label>
                  <select
                    name="interviewType"
                    value={formData.interviewType}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  >
                    <option value="Online">Online Video Call (Google Meet / Zoom)</option>
                    <option value="Offline">Offline / In-person Office Visit</option>
                    <option value="Phone">Phone Telephonic Call</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Date Reminder</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Set a reminder date to email the recruiter if you haven't received a response.</p>
              </div>
            </div>
          )}

          {/* STEP 5: Skills & Notes */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Step 5: Required Skills &amp; Notes
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Tech Stack / Skills (Comma Separated)</label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  placeholder="e.g. React.js, Java, Spring Boot, PostgreSQL, Docker"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Application Notes / Description</label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add custom notes about the job, referral details, or preparation checklist..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none"
                />
              </div>
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

            {currentStep < 5 ? (
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
                <span>{isEditMode ? 'Finish & Update Application' : 'Finish & Save Application'}</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
