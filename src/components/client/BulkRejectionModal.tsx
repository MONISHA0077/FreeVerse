import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Send, Users, X, AlertCircle } from 'lucide-react';

interface BulkRejectionModalProps {
  taskId: string;
  selectedStudentId: string;
  selectedStudentName: string;
  otherApplicantCount: number;
  onClose: () => void;
  onIndividualSelect?: () => void;
}

const DEFAULT_REJECTION_MESSAGE =
  'Thank you for your interest and for taking the time to apply. We have selected another student for this project. We appreciate your effort and encourage you to apply for upcoming tasks on Freeverse.';

export const BulkRejectionModal: React.FC<BulkRejectionModalProps> = ({
  taskId,
  selectedStudentId,
  selectedStudentName,
  otherApplicantCount,
  onClose,
  onIndividualSelect
}) => {
  const { showToast } = useApp();
  const [message, setMessage] = useState(DEFAULT_REJECTION_MESSAGE);
  const [sending, setSending] = useState(false);

  const handleSendToAll = () => {
    if (!message.trim()) {
      showToast('Please provide a message or click Skip.', 'warning');
      return;
    }

    setSending(true);
    const count = dataService.bulkRejectApplicants(taskId, message.trim(), selectedStudentId);
    setSending(false);
    showToast(`Rejection updates delivered to ${count} applicant(s). Selected student was excluded.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Users className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Required Workflow</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Notify Other Applicants?</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <p>
            You selected <strong className="text-slate-900">{selectedStudentName}</strong>. There are <strong className="text-slate-900">{otherApplicantCount}</strong> other applicant(s) who applied for this task.
          </p>
          <p className="mt-1 text-slate-500">
            You can dispatch a customized thank-you note to all other applicants. <em>The selected student ({selectedStudentName}) will never receive this message.</em>
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Customized Notification Message
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 p-3 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* 3 Buttons required by prompt section 27 */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Skip
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onIndividualSelect && (
              <button
                type="button"
                onClick={onIndividualSelect}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
              >
                Send Individually
              </button>
            )}

            <button
              type="button"
              disabled={sending}
              onClick={handleSendToAll}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to All Rejected Applicants ({otherApplicantCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
