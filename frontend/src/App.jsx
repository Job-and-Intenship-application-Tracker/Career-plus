import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import SearchBar from './components/SearchBar';
import KanbanBoard from './components/KanbanBoard';
import NavigationTabs from './components/NavigationTabs';
import TodaysActionsView from './components/TodaysActionsView';
import PriorityEngineView from './components/PriorityEngineView';
import FollowUpNotesView from './components/FollowUpNotesView';
import AnalyticsView from './components/AnalyticsView';
import AddApplicationModal from './components/AddApplicationModal';
import ApplicationDetailModal from './components/ApplicationDetailModal';
import UserProfileModal from './components/UserProfileModal';
import { apiService } from './services/api';

// Helper function to normalize job objects for seamless UI rendering
const normalizeJob = (j) => {
  if (!j) return null;
  const company = j.companyName || j.company || 'Company';
  const title = j.jobTitle || j.title || 'Untitled Role';
  const status = (j.status || 'applied').toLowerCase().trim();
  const tags = j.skillsRequired 
    ? j.skillsRequired.split(',').map(s => s.trim()).filter(Boolean) 
    : (Array.isArray(j.tags) && j.tags.length > 0 ? j.tags : [j.applicationType || 'Full-time']);

  return {
    ...j,
    title,
    jobTitle: title,
    company,
    companyName: company,
    status,
    tags,
    logo: company.charAt(0).toUpperCase(),
    location: j.location || 'Remote',
    appliedDate: j.appliedDate || 'Recently',
    workMode: j.workMode || 'Remote',
    applicationType: j.applicationType || 'Full-time'
  };
};

export default function App() {
  // Views: 'landing' | 'signup' | 'login' | 'dashboard'
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('kanban'); // kanban | actions | priority | reminders | analytics
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'applied' | 'interviewing' | 'offered' | 'rejected'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'company-asc' | 'company-desc' | 'role-asc' | 'salary-desc' | 'salary-asc' | 'priority'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [backendStatus, setBackendStatus] = useState('connecting'); // connecting | connected | offline

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('careerplus_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Candidate Resumes State
  const [userResumes, setUserResumes] = useState(() => {
    const saved = localStorage.getItem('careerplus_resumes');
    return saved ? JSON.parse(saved) : [
      { id: 'res-1', title: 'Full Stack Engineer Resume (2026)', fileName: 'john_doe_fullstack_2026.pdf', fileSize: '1.4 MB', createdAt: 'Active' },
      { id: 'res-2', title: 'Frontend Specialist Resume', fileName: 'john_doe_frontend_specialist.pdf', fileSize: '1.1 MB', createdAt: 'Active' },
      { id: 'res-3', title: 'Product & Tech Lead Resume', fileName: 'john_doe_tech_lead.pdf', fileSize: '1.6 MB', createdAt: 'Active' }
    ];
  });

  // Jobs Applications State
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('careerplus_jobs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(normalizeJob).filter(Boolean) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Fetch live applications & resumes from Spring Boot Port 8080 on dashboard mount
  useEffect(() => {
    if (currentView === 'dashboard') {
      const loadBackendData = async () => {
        setBackendStatus('connecting');
        const remoteApps = await apiService.getApplications();
        const remoteResumes = await apiService.getResumes();

        if (remoteApps && Array.isArray(remoteApps)) {
          const normalizedApps = remoteApps.map(normalizeJob).filter(Boolean);
          setJobs(normalizedApps);
          localStorage.setItem('careerplus_jobs', JSON.stringify(normalizedApps));
          setBackendStatus('connected');
        } else {
          setBackendStatus('offline');
        }

        if (remoteResumes && Array.isArray(remoteResumes) && remoteResumes.length > 0) {
          setUserResumes(remoteResumes);
          localStorage.setItem('careerplus_resumes', JSON.stringify(remoteResumes));
        }
      };

      loadBackendData();
    }
  }, [currentView]);

  // Save jobs to localStorage
  useEffect(() => {
    localStorage.setItem('careerplus_jobs', JSON.stringify(jobs));
  }, [jobs]);

  // Save resumes to localStorage
  useEffect(() => {
    localStorage.setItem('careerplus_resumes', JSON.stringify(userResumes));
  }, [userResumes]);

  // Resume handlers synced with Spring Boot 8080
  const handleAddResume = async (newResume) => {
    setUserResumes(prev => [newResume, ...prev]);
    await apiService.createResume(newResume);
  };

  const handleDeleteResume = async (resumeId) => {
    setUserResumes(prev => prev.filter(r => r.id !== resumeId));
    await apiService.deleteResume(resumeId);
  };

  // Navigate to Dashboard & set user
  const handleAuthenticated = (userData) => {
    if (userData) {
      setCurrentUser(userData);
      localStorage.setItem('careerplus_user', JSON.stringify(userData));
    }
    setCurrentView('dashboard');
  };

  // Add / Edit application job card handler synced with Spring Boot 8080
  const handleSaveJob = async (jobPayload) => {
    const normalizedPayload = normalizeJob(jobPayload);

    if (editingJob) {
      // EDIT MODE: Update existing job
      const updatedId = editingJob.id;
      setJobs(prev => prev.map(j => j.id === updatedId ? { ...normalizedPayload, id: updatedId } : j));
      if (selectedJob && selectedJob.id === updatedId) {
        setSelectedJob({ ...normalizedPayload, id: updatedId });
      }
      setEditingJob(null);
      await apiService.updateApplication(updatedId, normalizedPayload);
    } else {
      // CREATE MODE: Add new job & capture real database ID from SQLite
      setJobs(prev => [normalizedPayload, ...prev]);
      const createdRemote = await apiService.createApplication(normalizedPayload);
      if (createdRemote && createdRemote.id) {
        const finalNormalized = normalizeJob(createdRemote);
        setJobs(prev => prev.map(j => j.id === normalizedPayload.id ? finalNormalized : j));
      }
    }
  };

  // Open Edit Mode Modal
  const handleOpenEditModal = (jobToEdit) => {
    setSelectedJob(null);
    setEditingJob(jobToEdit);
    setIsAddModalOpen(true);
  };

  // Open Add Mode Modal
  const handleOpenAddModal = () => {
    setEditingJob(null);
    setIsAddModalOpen(true);
  };

  // Update status synced with Spring Boot 8080
  const handleUpdateStatus = async (jobId, newStatus) => {
    const cleanStatus = newStatus.toLowerCase().trim();
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: cleanStatus } : j));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({ ...prev, status: cleanStatus }));
    }
    await apiService.updateApplication(jobId, { status: cleanStatus });
  };

  // Delete job synced with Spring Boot 8080
  const handleDeleteJob = async (jobId) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    setSelectedJob(null);
    await apiService.deleteApplication(jobId);
  };

  // Save notes handler synced with Spring Boot 8080 & SQLite
  const handleAddNote = async (jobId, newNotesText) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, notes: newNotesText };
      }
      return j;
    }));

    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({ ...prev, notes: newNotesText }));
    }

    await apiService.updateApplication(jobId, { notes: newNotesText });
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('careerplus_user');
    localStorage.removeItem('careerplus_jwt_token');
    setCurrentView('landing');
  };

  // 7 Top Stat Summary Cards
  const totalApplications = jobs.length;
  const appliedCount = jobs.filter(j => j.status === 'applied').length;
  const interviewingCount = jobs.filter(j => j.status === 'interviewing').length;
  const offersCount = jobs.filter(j => j.status === 'offered').length;
  const rejectedCount = jobs.filter(j => j.status === 'rejected').length;
  const followUpDueCount = jobs.filter(j => j.status === 'applied' || (j.priorityScore && j.priorityScore >= 70)).length;

  // Render Landing Page
  if (currentView === 'landing') {
    return (
      <LandingPage
        onNavigateDashboard={() => setCurrentView(currentUser ? 'dashboard' : 'login')}
        onNavigateLogin={() => setCurrentView('login')}
        onNavigateSignUp={() => setCurrentView('signup')}
      />
    );
  }

  // Render Sign Up Page
  if (currentView === 'signup') {
    return (
      <SignUpPage
        onNavigateLogin={() => setCurrentView('login')}
        onNavigateDashboard={handleAuthenticated}
        onNavigateHome={() => setCurrentView('landing')}
      />
    );
  }

  // Render Login Page
  if (currentView === 'login') {
    return (
      <LoginPage
        onNavigateSignUp={() => setCurrentView('signup')}
        onNavigateDashboard={handleAuthenticated}
        onNavigateHome={() => setCurrentView('landing')}
      />
    );
  }

  // Render Main Dashboard Workspace
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Dashboard Top Navigation Bar */}
      <Navbar 
        currentUser={currentUser}
        onOpenAddModal={handleOpenAddModal} 
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header & Spring Boot Port 8080 Connection Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, <span className="text-violet-600">{currentUser?.fullName || currentUser?.name || 'Candidate'}</span>
              </h2>
              <span className="bg-violet-100 text-violet-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-violet-200">
                Spring Boot REST API Integrated
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Job &amp; Internship Application Tracker • Port 8080 Spring Boot &amp; SQLite Backend
            </p>
          </div>

          {/* Spring Boot Port 8080 Connection Indicator Pill */}
          <div className="flex items-center space-x-2 bg-white p-2 px-3.5 rounded-xl border border-slate-200/80 shadow-2xs self-start sm:self-auto">
            <span className={`w-2.5 h-2.5 rounded-full ${
              backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
              backendStatus === 'connecting' ? 'bg-amber-500 animate-ping' : 'bg-rose-500'
            }`}></span>
            <span className="text-xs font-bold text-slate-700">
              {backendStatus === 'connected' ? 'Spring Boot 8080 Connected (SQLite)' :
               backendStatus === 'connecting' ? 'Connecting to Port 8080...' : 'Spring Boot 8080 Offline (Local Mode)'}
            </span>
          </div>
        </div>

        {/* Top Summary Cards Bar */}
        <section aria-label="Dashboard Overview Stat Cards">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Card 1: Applied Stage */}
            <div className="bg-white p-4 rounded-2xl border border-violet-200/80 shadow-2xs hover:shadow-md transition-all space-y-1.5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-violet-600"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-700">Applied</span>
                <span className="w-7 h-7 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-xs">
                  📄
                </span>
              </div>
              <p className="text-2xl font-black text-violet-900">{appliedCount}</p>
              <p className="text-[11px] font-bold text-violet-600">Active Stage</p>
            </div>

            {/* Card 2: Interviewing Stage */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs hover:shadow-md transition-all space-y-1.5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">Interviewing</span>
                <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  ⏰
                </span>
              </div>
              <p className="text-2xl font-black text-amber-900">{interviewingCount}</p>
              <p className="text-[11px] font-bold text-amber-600">In Progress</p>
            </div>

            {/* Card 3: Offers Won */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-2xs hover:shadow-md transition-all space-y-1.5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">Offers</span>
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  🏆
                </span>
              </div>
              <p className="text-2xl font-black text-emerald-900">{offersCount}</p>
              <p className="text-[11px] font-bold text-emerald-600">Won Offers</p>
            </div>

            {/* Card 4: Rejected Stage */}
            <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-2xs hover:shadow-md transition-all space-y-1.5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700">Rejected</span>
                <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                  📁
                </span>
              </div>
              <p className="text-2xl font-black text-rose-900">{rejectedCount}</p>
              <p className="text-[11px] font-bold text-rose-600">Archived</p>
            </div>

            {/* Card 5: Total Applications */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-1.5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-600"></div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">Total Count</span>
                <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  📊
                </span>
              </div>
              <p className="text-2xl font-black text-slate-900">{totalApplications}</p>
              <p className="text-[11px] font-bold text-slate-500">Total Applications</p>
            </div>

            {/* Card 6: Follow-up Due (Attention-Grabbing Spotlight Card) */}
            <div 
              onClick={() => setActiveTab('reminders')}
              className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white p-4 rounded-2xl border-2 border-indigo-400 shadow-2xl shadow-indigo-600/40 ring-4 ring-indigo-500/40 animate-pulse hover:animate-none hover:scale-[1.03] transition-all duration-300 space-y-1.5 relative overflow-hidden cursor-pointer group"
              title="Click to view all pending recruiter follow-ups"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"></div>
              
              {/* Top Attention Badge Pill */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 bg-white/20 px-2 py-0.5 rounded-full border border-white/30 flex items-center space-x-1">
                  <span>⚡ ACTION REQUIRED</span>
                </span>
                <span className="w-7 h-7 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:rotate-12 transition-transform">
                  🔔
                </span>
              </div>

              <p className="text-2.5xl font-black text-white tracking-tight">{followUpDueCount} Due</p>
              <div className="flex items-center justify-between text-[11px] font-extrabold text-indigo-200 pt-0.5">
                <span>Pending Recruiter Notes</span>
                <span className="underline decoration-indigo-300 group-hover:translate-x-1 transition-transform">View →</span>
              </div>
            </div>

          </div>
        </section>

        {/* 5-Module Navigation Tabs Bar */}
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab 1: Kanban Board View */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onOpenAddModal={handleOpenAddModal}
            />
            <KanbanBoard 
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              sortBy={sortBy}
              jobs={jobs}
              onAddCard={handleOpenAddModal}
              onSelectJob={(job) => setSelectedJob(job)}
            />
          </div>
        )}

        {/* Tab 2: Today's Actions View */}
        {activeTab === 'actions' && (
          <TodaysActionsView jobs={jobs} onAddCard={handleOpenAddModal} />
        )}

        {/* Tab 3: Priority Engine View */}
        {activeTab === 'priority' && (
          <PriorityEngineView jobs={jobs} />
        )}

        {/* Tab 4: Follow-ups & Notes View */}
        {activeTab === 'reminders' && (
          <FollowUpNotesView jobs={jobs} onSelectJob={(job) => setSelectedJob(job)} />
        )}

        {/* Tab 5: Analytics & Insights View */}
        {activeTab === 'analytics' && (
          <AnalyticsView jobs={jobs} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">JobTrack • Career Plus</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <button 
            type="button"
            onClick={() => setCurrentView('landing')} 
            className="hover:text-blue-600 font-medium transition-colors"
          >
            ← Return to Landing Page
          </button>
        </div>
      </footer>

      {/* Modal for "+ Add / Edit Application" */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingJob(null);
        }}
        onAddJob={handleSaveJob}
        userResumes={userResumes}
        onAddResume={handleAddResume}
        editJobData={editingJob}
      />

      {/* Module 5: Application Details (View / Update / Edit) Drawer Modal */}
      <ApplicationDetailModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
        onUpdateStatus={handleUpdateStatus}
        onDeleteJob={handleDeleteJob}
        onAddNote={handleAddNote}
        onEditJob={handleOpenEditModal}
      />

      {/* User Profile & Multiple Resumes Management Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        userResumes={userResumes}
        onAddResume={handleAddResume}
        onDeleteResume={handleDeleteResume}
      />

    </div>
  );
}
