import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentWorkspace } from '../student/StudentWorkspace';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Users,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const ClientProjects: React.FC = () => {
  const {
    projects,
    activeClient,
    students,
    activeWorkspaceProjectId,
    setActiveWorkspaceProjectId,
    setClientTab
  } = useApp();

  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  if (!activeClient) return null;

  // If a workspace is active, render the unified workspace in client mode!
  if (activeWorkspaceProjectId) {
    return (
      <StudentWorkspace
        projectId={activeWorkspaceProjectId}
        onBack={() => setActiveWorkspaceProjectId(null)}
        viewerMode="client"
      />
    );
  }

  const myProjects = projects.filter((p) => p.clientId === activeClient.id);

  const filtered = myProjects.filter((p) => {
    if (filter === 'Active') return p.status !== 'Completed' && p.status !== 'Cancelled';
    if (filter === 'Completed') return p.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Client Project Workspaces</h2>
          <p className="text-xs text-slate-500 mt-1">
            Review milestone submissions, chat with hired students, request revisions, and complete contracts.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {(['All', 'Active', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filter === tab ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No projects under this category</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Accept a student application on your tasks to start a project workspace.</p>
          <button
            onClick={() => setClientTab('my-tasks')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
          >
            Review Task Applications
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((proj) => {
            const student = students.find((s) => s.id === proj.studentId);
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

                  <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-700">Hired: {student?.name}</span>
                    <span>&middot;</span>
                    <span>Deadline: {proj.deadline}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Completion</span>
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
                    <span>Manage Workspace</span>
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
