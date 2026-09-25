import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { FolderGit2, CheckCircle2, Clock, DollarSign } from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { projects, students, clients } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            Contract Workspaces &amp; Deliverables
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of active student sprints, milestone approvals, and delivery volume.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Total: <strong className="text-slate-900">{projects.length}</strong> project contracts
        </span>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Project Title</th>
              <th className="py-3 px-3">Student</th>
              <th className="py-3 px-3">Client</th>
              <th className="py-3 px-3">Budget</th>
              <th className="py-3 px-3">Progress</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => {
              const student = students.find((s) => s.id === p.studentId);
              const client = clients.find((c) => c.id === p.clientId);
              return (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{p.taskTitle}</td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="font-semibold block">{student?.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{student?.studentId}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{client?.company || client?.name}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600">${p.budget}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-indigo-600">{p.progress}%</span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={p.status} size="sm" />
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
