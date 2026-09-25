import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Application, Student } from '../../types';
import { X, UserX, Send } from 'lucide-react';

interface IndividualRejectModalProps {
  application: Application;
  student: Student;
  onClose: () => void;
}

export const IndividualRejectModal: React.FC<IndividualRejectModalProps> = ({
  application,
  student,
  onClose
}) => {
  const { showToast } = useApp();
  const [rejectionMessage, setRejectionMessage] = useState(
    `Thank you for applying, ${student.name}. We have decided to proceed with another profile for this particular brief, but we encourage you to stay connected and apply for future projects.`
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionMessage.trim()) {
      showToast('Please provide a polite rejection note.', 'warning');
      return;
    }

    dataService.rejectIndividualApplicant(application.id, rejectionMessage.trim());
    showToast(`Rejection notice delivered to ${student.name}.`, 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <UserX className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Reject Applicant</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Sending individual feedback to <strong className="text-slate-900">{student.name}</strong> ({student.studentId}):
        </p>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Feedback / Rejection Message
            </label>
            <textarea
              required
              rows={4}
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-3 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
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
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
