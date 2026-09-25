import React from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2 } from 'lucide-react';

export const ClientNotifications: React.FC = () => {
  const { activeClient, showToast } = useApp();

  if (!activeClient) return null;

  const myNotifs = dataService.getNotifications(activeClient.id);

  const handleMarkAllRead = () => {
    myNotifs.forEach((n) => dataService.markNotificationAsRead(n.id));
    showToast('Notifications marked as read.', 'info');
  };

  const handleClearAll = () => {
    dataService.clearAllNotifications(activeClient.id);
    showToast('Notification center cleared.', 'info');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Client Activity Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time alerts for incoming proposals, submissions, and contract milestones.</p>
        </div>

        {myNotifs.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={handleClearAll}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="font-semibold text-slate-700 text-sm">No new activity alerts</h3>
          <p className="mt-1">When students apply to your tasks or upload deliverables, you will receive updates here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myNotifs.map((n) => {
            let Icon = Info;
            let iconColor = 'text-blue-600 bg-blue-50';
            if (n.type === 'success') {
              Icon = CheckCircle2;
              iconColor = 'text-emerald-600 bg-emerald-50';
            } else if (n.type === 'warning' || n.type === 'alert') {
              Icon = AlertCircle;
              iconColor = 'text-amber-600 bg-amber-50';
            }

            return (
              <div
                key={n.id}
                onClick={() => dataService.markNotificationAsRead(n.id)}
                className={`p-4 rounded-xl border transition-colors flex items-start gap-3.5 cursor-pointer ${
                  n.read ? 'bg-white border-slate-200' : 'bg-indigo-50/40 border-indigo-200 shadow-2xs'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{n.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
