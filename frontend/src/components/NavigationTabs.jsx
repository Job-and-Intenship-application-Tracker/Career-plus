import React from 'react';
import { LayoutGrid, Calendar, Zap, Bell, BarChart3 } from 'lucide-react';

export default function NavigationTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'kanban', label: 'Kanban Board', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'actions', label: "Today's Actions", icon: <Calendar className="w-4 h-4" /> },
    { id: 'priority', label: 'Priority Engine', icon: <Zap className="w-4 h-4" /> },
    { id: 'reminders', label: 'Reminders & Notes', icon: <Bell className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Insights', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-max py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              isActive
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
