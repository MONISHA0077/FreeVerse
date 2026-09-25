import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentWorkspace } from './StudentWorkspace';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  FolderGit2,
  Building
} from 'lucide-react';

export const StudentProjects: React.FC = () => {
  const { 
    projects, 
    activeStudent, 
    clients, 
    activeWorkspaceProjectId, 
    setActiveWorkspaceProjectId,
    setStudentTab
  } = useApp();

  const [tabFilter, setTabFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  if (!activeStudent) return null;

  // If a workspace is actively selected, show workspace!
  if (activeWorkspaceProjectId) {
    return (
      <StudentWorkspace
        projectId={activeWorkspaceProjectId}
        onBack={() => setActiveWorkspaceProjectId(null)}
        viewerMode="student"
      />
    );
  }

  const myProjects = projects.filter((p) => p.studentId === activeStudent.id);

  const filtered = myProjects.filter((p) => {
    if (tabFilter === 'Active') return p.status !== 'Completed' && p.status !== 'Cancelled';
    if (tabFilter === 'Completed') return p.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Project Workspaces</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your contracts, upload milestone deliverables, and message clients in private workspaces.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {(['All', 'Active', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTabFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                tabFilter === tab
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No projects under this filter</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">When a client accepts your application, your project workspace appears here automatically.</p>
          <button
            onClick={() => setStudentTab('find-tasks')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
          >
            Browse Open Tasks
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((proj) => {
            const client = clients.find((c) => c.id === proj.clientId);
            return (
              <div
                key={proj.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      ID: {proj.id}
                    </span>
                    <StatusBadge status={proj.status} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {proj.taskTitle}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700">{client?.company || client?.name}</span>
                    <span>&middot;</span>
                    <span>Due: {proj.deadline}</span>
                  </div>

                  {/* Progress */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-mono font-bold text-indigo-600">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-emerald-600">
                    ${proj.budget}
                  </span>

                  <button
                    onClick={() => setActiveWorkspaceProjectId(proj.id)}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
