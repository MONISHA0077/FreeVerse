import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { ApplicationStatus } from '../../types';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Building, 
  Eye, 
  Clock, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const MyApplications: React.FC = () => {
  const { 
    applications, 
    tasks, 
    clients, 
    activeStudent, 
    setActiveWorkspaceProjectId, 
    setStudentTab,
    projects
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  if (!activeStudent) return null;

  const myApps = applications.filter((a) => a.studentId === activeStudent.id);

  const filtered = myApps.filter((a) => {
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    return true;
  });

  const selectedApp = myApps.find((a) => a.id === selectedAppId);
  const selectedTask = selectedApp ? tasks.find((t) => t.id === selectedApp.taskId) : null;
  const selectedClient = selectedTask ? clients.find((c) => c.id === selectedTask.clientId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Proposals &amp; Applications</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track client evaluation statuses, shortlist updates, and project invitations.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto no-scrollbar">
          {['All', 'Pending', 'Shortlisted', 'Accepted', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No applications found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">You have not submitted proposals with this filter status.</p>
          <button
            onClick={() => setStudentTab('find-tasks')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
          >
            Find Tasks to Apply
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const task = tasks.find((t) => t.id === app.taskId);
            const client = task ? clients.find((c) => c.id === task.clientId) : null;
            const matchedProject = projects.find((p) => p.taskId === app.taskId && p.studentId === activeStudent.id);

            return (
              <div
                key={app.id}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm">
                      {task?.category || 'Task'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {task?.title || 'Task Details'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{client?.company || client?.name}</span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Applied: {app.appliedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Your Quote</span>
                      <span className="font-mono text-base font-bold text-emerald-600">${app.proposedAmount}</span>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </div>

                {/* Proposal excerpt */}
                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  "{app.proposalMessage}"
                </p>

                {/* Rejection notice if rejected */}
                {app.status === 'Rejected' && app.rejectionReason && (
                  <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-lg text-xs text-rose-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Client Feedback:</strong>
                      <span>{app.rejectionReason}</span>
                    </div>
                  </div>
                )}

                {/* Card action footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    Est. Delivery: {app.expectedDelivery}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAppId(app.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      View Full Proposal
                    </button>

                    {app.status === 'Accepted' && matchedProject && (
                      <button
                        onClick={() => {
                          setActiveWorkspaceProjectId(matchedProject.id);
                          setStudentTab('projects');
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                  Application Details
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedTask?.title}</h3>
                <span className="text-xs text-slate-500">Client: {selectedClient?.company || selectedClient?.name}</span>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold text-[11px]">Proposed Stipend</span>
                <span className="font-mono text-base font-bold text-emerald-600">${selectedApp.proposedAmount}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[11px]">Estimated Turnaround</span>
                <span className="font-semibold text-slate-800">{selectedApp.expectedDelivery}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Proposal Pitch</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line">
                {selectedApp.proposalMessage}
              </p>
            </div>

            {selectedApp.additionalMessage && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Additional Note</h4>
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {selectedApp.additionalMessage}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedAppId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
