import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  X, 
  DollarSign, 
  Calendar, 
  Clock, 
  Briefcase, 
  FileText, 
  Paperclip, 
  Send,
  Building,
  CheckCircle2
} from 'lucide-react';

export const TaskDetailsModal: React.FC = () => {
  const { 
    inspectTaskId, 
    setInspectTaskId, 
    tasks, 
    clients, 
    applications, 
    activeStudent, 
    setApplyingTaskId, 
    role, 
    setRole 
  } = useApp();

  if (!inspectTaskId) return null;

  const task = tasks.find((t) => t.id === inspectTaskId);
  if (!task) return null;

  const client = clients.find((c) => c.id === task.clientId);
  const myApp = activeStudent ? applications.find((a) => a.taskId === task.id && a.studentId === activeStudent.id) : null;

  const handleOpenApply = () => {
    if (role !== 'student') {
      setRole('student');
    }
    setInspectTaskId(null);
    setApplyingTaskId(task.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">
                {task.category}
              </span>
              <StatusBadge status={task.status} />
              <span className="text-xs text-slate-500 font-medium">
                Level: {task.experienceLevel}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{task.title}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{client?.company || client?.name || 'Verified Client'}</span>
              <span>&middot;</span>
              <span>Posted {task.createdAt}</span>
            </div>
          </div>

          <button
            onClick={() => setInspectTaskId(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Budget</span>
              <span className="text-lg font-bold text-emerald-600 font-mono">${task.budget}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Deadline</span>
              <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {task.deadline}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">Duration</span>
              <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {task.expectedDuration}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Project Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {task.description}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {task.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-800 rounded-md border border-indigo-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Additional Requirements */}
          {task.additionalRequirements && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Deliverables &amp; Guidelines
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                {task.additionalRequirements}
              </p>
            </div>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Client Attachments
              </h3>
              <div className="space-y-2">
                {task.attachments.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium text-slate-800">{file.name}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setInspectTaskId(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          {myApp ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">You applied on {myApp.appliedDate}:</span>
              <StatusBadge status={myApp.status} />
            </div>
          ) : task.status === 'Open' ? (
            <button
              onClick={handleOpenApply}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply for Task</span>
            </button>
          ) : (
            <span className="text-xs text-slate-500 font-medium italic">
              This task is currently {task.status.toLowerCase()}. Applications closed.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
