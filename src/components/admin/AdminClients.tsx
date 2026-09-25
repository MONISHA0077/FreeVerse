import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { StatusBadge } from '../common/StatusBadge';
import { RatingStars } from '../common/RatingStars';
import { Client, ClientStatus } from '../../types';
import { Building2, Search, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AdminClients: React.FC = () => {
  const { clients, tasks, projects, showToast } = useApp();
  const [search, setSearch] = useState('');

  const filtered = clients.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleUpdateStatus = (id: string, status: ClientStatus) => {
    dataService.updateClient(id, { status });
    showToast(`Client account status changed to ${status}.`, 'success');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Verified Client Organizations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit employer profiles, manage platform verification, and review hiring history.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Total: <strong className="text-slate-900">{clients.length}</strong> active organizations
        </span>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company name, contact, or industry..."
          className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Organization &amp; Lead</th>
              <th className="py-3 px-3">Industry</th>
              <th className="py-3 px-3">Tasks Posted</th>
              <th className="py-3 px-3">Rating</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((cl) => {
              const clientTasksCount = tasks.filter((t) => t.clientId === cl.id).length;
              return (
                <tr key={cl.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cl.avatar}
                        alt={cl.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-lg object-cover bg-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{cl.company || cl.name}</span>
                        <span className="text-[11px] text-slate-500">{cl.name} &middot; {cl.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{cl.industry}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900">{clientTasksCount} tasks</td>
                  <td className="py-3 px-3">
                    <RatingStars rating={cl.rating} count={cl.ratingCount} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={cl.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {cl.status === 'Active' ? (
                      <button
                        onClick={() => handleUpdateStatus(cl.id, 'Suspended')}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md"
                      >
                        Suspend Org
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(cl.id, 'Active')}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md"
                      >
                        Activate Org
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
