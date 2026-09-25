import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { StatusBadge } from '../common/StatusBadge';
import { PlatformEvent, EventStatus } from '../../types';
import { CreateEventModal } from './CreateEventModal';
import { 
  Calendar, 
  PlusCircle, 
  Users, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  ArrowLeft,
  Mail,
  Phone
} from 'lucide-react';

export const AdminEvents: React.FC = () => {
  const { events, showToast } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const activeEvent = events.find((e) => e.id === selectedEventId);
  const registrations = selectedEventId ? dataService.getEventRegistrations(selectedEventId) : [];

  const handleUpdateStatus = (id: string, status: EventStatus) => {
    dataService.updateEvent(id, { status });
    showToast(`Event status updated to ${status}.`, 'info');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
      {selectedEventId && activeEvent ? (
        /* Event Registrations Roster */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <button
                onClick={() => setSelectedEventId(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Events List</span>
              </button>
              <h3 className="text-xl font-bold text-slate-900">{activeEvent.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeEvent.date} &middot; {activeEvent.venue} &middot; Mode: {activeEvent.mode}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                {registrations.length} / {activeEvent.maxParticipants} Registered
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Participant Roster
            </h4>

            {registrations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                No students registered for this event yet.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Participant Name</th>
                      <th className="py-2.5 px-3">Student ID</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrations.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{r.name}</td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">{r.campusId}</td>
                        <td className="py-2.5 px-3 text-slate-600">{r.email}</td>
                        <td className="py-2.5 px-3 text-slate-600">{r.department}</td>
                        <td className="py-2.5 px-3 text-slate-400">{r.registeredAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Events List */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Campus Activities &amp; Events Administration
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Organize hackathons, track student registration passes, and archive completed editions.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => {
              const regCount = dataService.getEventRegistrations(evt.id).length;
              return (
                <div
                  key={evt.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 transition-all shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm">
                        {evt.category}
                      </span>
                      <StatusBadge status={evt.status} size="sm" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{evt.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{evt.description}</p>

                    <div className="pt-2 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{evt.date} &middot; {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{evt.venue} ({evt.mode})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedEventId(evt.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{regCount} Registrations</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {evt.status === 'Upcoming' && (
                        <button
                          onClick={() => handleUpdateStatus(evt.id, 'Completed')}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md"
                        >
                          Mark Completed
                        </button>
                      )}
                      {evt.status === 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(evt.id, 'Upcoming')}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showCreateModal && <CreateEventModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};
