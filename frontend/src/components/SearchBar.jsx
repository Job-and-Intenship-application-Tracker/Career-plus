import React from 'react';
import { Search, Filter, SlidersHorizontal, LayoutGrid, ListFilter, Plus, X } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery, statusFilter = 'all', setStatusFilter, onOpenAddModal }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            id="dashboard-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applications by role, company, or technology..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls & Add Button */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          
          {/* Status Filter Select (Triggers Column Zoom & Focus Mode) */}
          <div className="relative">
            <select 
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter && setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 hover:border-violet-300 text-slate-800 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer transition-all shadow-2xs"
            >
              <option value="all">🔍 All Statuses</option>
              <option value="applied">🟪 Applied Column Focus</option>
              <option value="interviewing">🟧 Interviewing Column Focus</option>
              <option value="offered">🟩 Offered Column Focus</option>
              <option value="rejected">🟥 Rejected Column Focus</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-violet-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Select */}
          <div className="relative">
            <select 
              id="sort-select"
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="company">Sort: Company (A-Z)</option>
              <option value="salary">Sort: Highest Salary</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Switcher Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 ml-auto lg:ml-0">
            <button
              type="button"
              className="px-2.5 py-1.5 rounded-lg bg-white shadow-xs text-violet-600 text-xs font-bold flex items-center space-x-1"
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              type="button"
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center space-x-1 transition-colors"
              title="List View"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* Secondary Add Application Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="hidden sm:inline-flex items-center justify-center px-3 py-2.5 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>New Card</span>
          </button>

        </div>

      </div>
    </div>
  );
}
