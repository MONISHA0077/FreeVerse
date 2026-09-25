import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { X, Send, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const ApplyTaskModal: React.FC = () => {
  const { 
    applyingTaskId, 
    setApplyingTaskId, 
    tasks, 
    activeStudent, 
    showToast,
    setStudentTab
  } = useApp();

  const task = tasks.find((t) => t.id === applyingTaskId);

  const [proposalMessage, setProposalMessage] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState(task ? task.expectedDuration : '10 days');
  const [proposedAmount, setProposedAmount] = useState(task ? task.budget : 400);
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!applyingTaskId || !task || !activeStudent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalMessage.trim()) {
      showToast('Please provide a proposal message explaining your approach.', 'warning');
      return;
    }

    const res = dataService.submitApplication({
      taskId: task.id,
      studentId: activeStudent.id,
      proposalMessage: proposalMessage.trim(),
      expectedDelivery: expectedDelivery.trim(),
      proposedAmount: Number(proposedAmount),
      additionalMessage: additionalMessage.trim() || undefined
    });

    if (res.success) {
      setSubmitted(true);
      showToast(res.message, 'success');
      setTimeout(() => {
        setApplyingTaskId(null);
        setSubmitted(false);
        setStudentTab('applications');
      }, 1500);
    } else {
      showToast(res.message, 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">
              Submit Task Proposal
            </span>
            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
              {task.title}
            </h3>
            <span className="text-xs text-slate-500">
              Applying as <span className="font-semibold text-slate-800">{activeStudent.name}</span> ({activeStudent.studentId})
            </span>
          </div>

          <button
            onClick={() => setApplyingTaskId(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your proposal has been dispatched to the client with status <strong>Pending</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Rates comparison info banner */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Client's Posted Budget:</span>
              <span className="font-mono font-bold text-slate-900">${task.budget}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Proposal Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
                placeholder="Explain why you are a great fit, your technical approach, and relevant past projects..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Delivery <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    placeholder="e.g. 10 days"
                    className="w-full text-xs rounded-lg border border-slate-300 py-2 pl-8 pr-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proposed Amount ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="number"
                    required
                    min={10}
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(Number(e.target.value))}
                    className="w-full text-xs rounded-lg border border-slate-300 py-2 pl-8 pr-2.5 bg-white text-slate-900 font-mono focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Note or Questions for Client (Optional)
              </label>
              <input
                type="text"
                value={additionalMessage}
                onChange={(e) => setAdditionalMessage(e.target.value)}
                placeholder="e.g. Can hop on an intro call this evening; have completed similar UI flows."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setApplyingTaskId(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Application</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
