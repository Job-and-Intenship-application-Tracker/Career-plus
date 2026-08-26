import React from 'react';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ searchQuery, statusFilter = 'all', jobs = [], onAddCard, onSelectJob }) {
  // Filter jobs dynamically based on search query
  const filteredJobs = jobs.filter(job => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    const title = (job.jobTitle || job.title || '').toLowerCase();
    const company = (job.companyName || job.company || '').toLowerCase();
    const location = (job.location || '').toLowerCase();
    const skills = (job.skillsRequired || '').toLowerCase();
    const tags = Array.isArray(job.tags) ? job.tags.join(' ').toLowerCase() : '';

    return (
      title.includes(query) ||
      company.includes(query) ||
      location.includes(query) ||
      skills.includes(query) ||
      tags.includes(query)
    );
  });

  const columns = [
    { title: 'Applied', key: 'applied', colorTheme: 'blue' },
    { title: 'Interviewing', key: 'interviewing', colorTheme: 'amber' },
    { title: 'Offered', key: 'offered', colorTheme: 'emerald' },
    { title: 'Rejected', key: 'rejected', colorTheme: 'rose' },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {columns.map((col) => {
          const isFocused = statusFilter !== 'all' && statusFilter.toLowerCase().trim() === col.key.toLowerCase();
          const isDimmed = statusFilter !== 'all' && !isFocused;
          const colJobs = filteredJobs.filter(j => (j.status || 'applied').toLowerCase().trim() === col.key.toLowerCase());

          return (
            <KanbanColumn
              key={col.key}
              title={col.title}
              statusKey={col.key}
              count={colJobs.length}
              jobs={colJobs}
              colorTheme={col.colorTheme}
              onAddCard={onAddCard}
              onSelectJob={onSelectJob}
              isFocused={isFocused}
              isDimmed={isDimmed}
            />
          );
        })}
      </div>
    </div>
  );
}
