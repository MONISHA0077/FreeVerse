import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { ReportReason } from '../../types';
import { X, Flag, AlertTriangle } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { reportingTarget, setReportingTarget, role, activeStudentId, activeClientId, showToast } = useApp();
  const [reason, setReason] = useState<ReportReason>('Inappropriate Content');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!reportingTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide details for your report.', 'warning');
      return;
    }

    setSubmitting(true);

    const reporterId = role === 'student' ? activeStudentId : role === 'client' ? activeClientId : 'admin';
    const reporterRole = role === 'client' ? 'client' : role === 'admin' ? 'admin' : 'student';

    dataService.submitReport({
      reportedBy: reporterId,
      reporterRole,
      targetType: reportingTarget.type,
      targetId: reportingTarget.id,
      targetName: reportingTarget.name,
      reason,
      description: description.trim()
    });

    setSubmitting(false);
    showToast('Report submitted for administrative review. Thank you.', 'success');
    setReportingTarget(null);
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600">
            <Flag className="w-4 h-4" />
            <h3 className="text-sm font-bold text-slate-900">Submit Content Report</h3>
          </div>
          <button
            onClick={() => setReportingTarget(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Reporting target:</span>
              <span className="text-slate-700 capitalize font-mono">{reportingTarget.type}</span>: {reportingTarget.name}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason for Report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Spam">Spam / Unsolicited Promotion</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Fraud">Fraud / Scams / Plagiarism</option>
              <option value="Misconduct">Misconduct / Harassment</option>
              <option value="Other">Other Policy Violation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue with specific context..."
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setReportingTarget(null)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
