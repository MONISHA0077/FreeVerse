import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { StatusBadge } from '../common/StatusBadge';
import { Report, ReportStatus } from '../../types';
import { Flag, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { reports, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = reports.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (id: string, status: ReportStatus) => {
    dataService.updateReportStatus(id, status);
    showToast(`Report status updated to ${status}.`, 'info');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-600" />
            Safety &amp; Content Governance Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review user-submitted flags regarding spam, fraud, harassment, and policy violations.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-700"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Under Review">Under Review</option>
          <option value="Resolved">Resolved</option>
          <option value="Dismissed">Dismissed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <h4 className="font-semibold text-slate-800 text-sm">All clear! No reports in this queue</h4>
          <p className="mt-1">The platform content meets community standards.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((rep) => (
            <div
              key={rep.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200">
                    {rep.reason}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    Target: <strong className="capitalize">{rep.targetType}</strong> ({rep.targetName})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">{rep.createdAt}</span>
                  <StatusBadge status={rep.status} size="sm" />
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                "{rep.description}"
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Reported by: <span className="font-semibold text-slate-600">{rep.reportedBy} ({rep.reporterRole})</span>
                </span>

                <div className="flex items-center gap-1.5">
                  {rep.status !== 'Under Review' && rep.status !== 'Resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(rep.id, 'Under Review')}
                      className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md"
                    >
                      Investigate
                    </button>
                  )}
                  {rep.status !== 'Resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(rep.id, 'Resolved')}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md"
                    >
                      Resolve &amp; Take Action
                    </button>
                  )}
                  {rep.status !== 'Dismissed' && (
                    <button
                      onClick={() => handleUpdateStatus(rep.id, 'Dismissed')}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
