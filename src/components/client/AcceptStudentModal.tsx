import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Application, Student, Task } from '../../types';
import { CheckCircle2, X, AlertTriangle, Send, Sparkles } from 'lucide-react';

interface AcceptStudentModalProps {
  application: Application;
  student: Student;
  task: Task;
  onClose: () => void;
  onAccepted: (projectId: string, otherApplicantIds: string[]) => void;
}

export const AcceptStudentModal: React.FC<AcceptStudentModalProps> = ({
  application,
  student,
  task,
  onClose,
  onAccepted
}) => {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = () => {
    setSubmitting(true);
    const { project, otherApplicantIds } = dataService.acceptStudent(application.id);
    setSubmitting(false);
    onAccepted(project.id, otherApplicantIds);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Confirm Student Selection</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <img
            src={student.avatar}
            alt={student.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl object-cover bg-slate-200 shrink-0"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{student.name}</h4>
            <p className="text-xs text-indigo-600 font-semibold">{student.role}</p>
            <span className="font-mono text-xs text-slate-500 font-semibold">
              Proposed: ${application.proposedAmount} &middot; {application.expectedDelivery}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100">
          <p>
            Accepting <strong>{student.name}</strong> will:
          </p>
          <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-700">
            <li>Mark this application as <strong>Accepted</strong>.</li>
            <li>Automatically create a <strong>Private Project Workspace</strong>.</li>
            <li>Transition the task status to <strong>In Progress</strong>.</li>
            <li>Allow you to notify remaining applicants.</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Selection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
