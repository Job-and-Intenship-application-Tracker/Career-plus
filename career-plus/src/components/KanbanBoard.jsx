import React from 'react';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ searchQuery, statusFilter = 'all', sortBy = 'newest', jobs = [], onAddCard, onSelectJob }) {
  
  // 1. Filter jobs dynamically based on search query
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

  // 2. Helper functions for multi-criteria sorting
  const parseSalary = (job) => {
    const str = String(job.offeredSalary || job.salary || job.expectedSalary || '');
    if (!str || str === 'N/A') return 0;
    
    // Match LPA numbers e.g. "12 LPA", "12.5 LPA"
    const lpaMatch = str.match(/([\d.]+)\s*(?:LPA|Lakhs?|L)/i);
    if (lpaMatch) return parseFloat(lpaMatch[1]) * 100000;
    
    // Extract numbers
    const nums = str.replace(/,/g, '').match(/\d+/g);
    if (nums && nums.length > 0) return parseFloat(nums.join(''));
    return 0;
  };

  const parsePriority = (job) => {
    const p = (job.priorityLevel || job.priority || '').toLowerCase();
    if (p.includes('urgent') || p.includes('high') || job.priorityScore >= 80) return 4;
    if (p.includes('medium') || job.priorityScore >= 50) return 3;
    if (p.includes('low') || job.priorityScore >= 20) return 2;
    return 1;
  };

  const parseDate = (job) => {
    const d = job.appliedDate || job.dateApplied || job.createdAt;
    if (!d) return 0;
    const time = new Date(d).getTime();
    return isNaN(time) ? 0 : time;
  };

  // 3. Multi-Criteria Sorting Engine
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') {
      return parseDate(b) - parseDate(a) || (b.id || 0) - (a.id || 0);
    }
    if (sortBy === 'oldest') {
      return parseDate(a) - parseDate(b) || (a.id || 0) - (b.id || 0);
    }
    if (sortBy === 'company-asc') {
      const compA = (a.companyName || a.company || '').toLowerCase();
      const compB = (b.companyName || b.company || '').toLowerCase();
      return compA.localeCompare(compB);
    }
    if (sortBy === 'company-desc') {
      const compA = (a.companyName || a.company || '').toLowerCase();
      const compB = (b.companyName || b.company || '').toLowerCase();
      return compB.localeCompare(compA);
    }
    if (sortBy === 'role-asc') {
      const roleA = (a.jobTitle || a.title || '').toLowerCase();
      const roleB = (b.jobTitle || b.title || '').toLowerCase();
      return roleA.localeCompare(roleB);
    }
    if (sortBy === 'salary-desc') {
      return parseSalary(b) - parseSalary(a);
    }
    if (sortBy === 'salary-asc') {
      return parseSalary(a) - parseSalary(b);
    }
    if (sortBy === 'priority') {
      return parsePriority(b) - parsePriority(a);
    }
    return 0;
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
          const colJobs = sortedJobs.filter(j => (j.status || 'applied').toLowerCase().trim() === col.key.toLowerCase());

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
