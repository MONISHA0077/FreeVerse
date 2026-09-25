import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { StatusBadge } from '../common/StatusBadge';
import { Task, TaskStatus } from '../../types';
import { Briefcase, Search, XCircle, CheckCircle2 } from 'lucide-react';

export const AdminTasks: React.FC = () => {
  const { tasks, clients, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = tasks.filter((t) => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.requiredSkills.some((sk) => sk.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleUpdateStatus = (id: string, status: TaskStatus) => {
    dataService.updateTaskStatus(id, status);
    showToast(`Task status updated to ${status}.`, 'info');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Platform Task Marketplace Administration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit public opportunities, close fulfilled tasks, and ensure safe job descriptions.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Total: <strong className="text-slate-900">{tasks.length}</strong> tasks recorded
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by task title, category, or skill..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-700"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Task Title &amp; Client</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Budget</th>
              <th className="py-3 px-3">Deadline</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((t) => {
              const client = clients.find((c) => c.id === t.clientId);
              return (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{t.title}</span>
                    <span className="text-[11px] text-slate-500">
                      Client: {client?.company || client?.name || 'Client'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{t.category}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600">${t.budget}</td>
                  <td className="py-3 px-3 text-slate-600">{t.deadline}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={t.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {t.status === 'Open' && (
                      <button
                        onClick={() => handleUpdateStatus(t.id, 'Closed')}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md"
                      >
                        Close Task
                      </button>
                    )}
                    {t.status === 'Closed' && (
                      <button
                        onClick={() => handleUpdateStatus(t.id, 'Open')}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md"
                      >
                        Reopen Task
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
