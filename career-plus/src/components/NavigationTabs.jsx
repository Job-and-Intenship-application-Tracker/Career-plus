import React from 'react';
import { LayoutGrid, Calendar, Zap, Bell, BarChart3 } from 'lucide-react';
import { apiService } from '../services/api';

export default function NavigationTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'kanban', label: 'Kanban Board', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'actions', label: "Today's Actions", icon: <Calendar className="w-4 h-4" /> },
    { id: 'priority', label: 'Priority Engine', icon: <Zap className="w-4 h-4" /> },
    { 
      id: 'reminders', 
      label: 'Reminders & Notes', 
      icon: <Bell className="w-4 h-4 text-amber-300 animate-bounce" />,
      badge: '⚡ Action Due' 
    },
    { id: 'analytics', label: 'Analytics & Insights', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleTabClick = async (tabId) => {
    setActiveTab(tabId);
    
    // Trigger REST API call through API Gateway (Port 8080) -> Microservice Port 8082
    try {
      if (tabId === 'kanban') {
        await apiService.getKanbanApplications();
      } else if (tabId === 'actions') {
        await apiService.getTodaysActions();
      } else if (tabId === 'priority') {
        await apiService.getPriorityApplications();
      } else if (tabId === 'reminders') {
        await apiService.getFollowUpApplications();
      } else if (tabId === 'analytics') {
        await apiService.getAnalyticsInsights();
      }
    } catch (err) {
      console.warn(`REST API call for ${tabId} tab:`, err);
    }
  };

  return (
    <div className="bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 min-w-max py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer relative ${
              isActive
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25 scale-[1.02]'
                : tab.badge 
                ? 'bg-gradient-to-r from-indigo-900 to-violet-900 text-white shadow-sm hover:opacity-95'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400 text-slate-900 animate-pulse">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
