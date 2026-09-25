import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Task } from '../../types';
import { 
  Search, 
  DollarSign, 
  Calendar, 
  Clock, 
  Building, 
  ArrowUpRight, 
  X,
  Filter,
  Send
} from 'lucide-react';

export const FindTasks: React.FC = () => {
  const { tasks, clients, setInspectTaskId, setApplyingTaskId } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [maxBudget, setMaxBudget] = useState<number>(0);
  const [selectedExperience, setSelectedExperience] = useState('');

  const allCategories = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.category))).sort();
  }, [tasks]);

  const allSkills = useMemo(() => {
    const s = new Set<string>();
    tasks.forEach((t) => t.requiredSkills.forEach((sk) => s.add(sk)));
    return Array.from(s).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Must be open or in progress
      if (t.status === 'Draft' || t.status === 'Cancelled') return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const client = clients.find((c) => c.id === t.clientId);
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesSkills = t.requiredSkills.some((sk) => sk.toLowerCase().includes(q));
        const matchesClient = client ? client.name.toLowerCase().includes(q) || client.company.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesDesc && !matchesSkills && !matchesClient) return false;
      }

      if (selectedCategory && t.category !== selectedCategory) return false;
      if (selectedSkill && !t.requiredSkills.includes(selectedSkill)) return false;
      if (selectedExperience && t.experienceLevel !== selectedExperience) return false;
      if (maxBudget > 0 && t.budget > maxBudget) return false;

      return true;
    });
  }, [tasks, clients, search, selectedCategory, selectedSkill, selectedExperience, maxBudget]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedSkill('');
    setMaxBudget(0);
    setSelectedExperience('');
  };

  const hasFilters = Boolean(search || selectedCategory || selectedSkill || selectedExperience || maxBudget > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Task Marketplace</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified opportunities posted by startups, campus hubs, and digital agencies.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredTasks.length}</span> opportunities
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, required skills, keywords, or client..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs"
          >
            <option value="">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs"
          >
            <option value="">All Skills</option>
            {allSkills.map((sk) => (
              <option key={sk} value={sk}>{sk}</option>
            ))}
          </select>

          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs"
          >
            <option value="">All Experience</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs"
          >
            <option value={0}>Any Budget</option>
            <option value={300}>Under $300</option>
            <option value={500}>Under $500</option>
            <option value={800}>Under $800</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No tasks matched your filter criteria</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Try broadening your search or resetting filters.</p>
          <button onClick={clearFilters} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((t) => {
            const client = clients.find((c) => c.id === t.clientId);
            return (
              <div
                key={t.id}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between group space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm">
                        {t.category}
                      </span>
                      <StatusBadge status={t.status} size="sm" />
                    </div>
                    <span className="font-mono text-base font-bold text-emerald-600">
                      ${t.budget}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {t.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{client?.company || client?.name}</span>
                    <span>&middot;</span>
                    <span>Level: {t.experienceLevel}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2.5">
                    {t.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {t.requiredSkills.map((sk) => (
                      <span key={sk} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Due {t.deadline}
                    </span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {t.expectedDuration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInspectTaskId(t.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                    {t.status === 'Open' && (
                      <button
                        onClick={() => setApplyingTaskId(t.id)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Apply</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
