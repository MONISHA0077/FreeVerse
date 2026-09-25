import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { PlatformEvent } from '../../types';
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Users 
} from 'lucide-react';

export const StudentEvents: React.FC = () => {
  const { events, activeStudent, setRegisteringEvent } = useApp();
  const [filter, setFilter] = useState<'All' | 'Registered'>('All');

  if (!activeStudent) return null;

  const filteredEvents = events.filter((evt) => {
    const isReg = dataService.isStudentRegisteredForEvent(evt.id, activeStudent.id, activeStudent.email);
    if (filter === 'Registered' && !isReg) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Events &amp; Workshops</h2>
          <p className="text-xs text-slate-500 mt-1">
            Register for national hackathons, technical masterclasses, and portfolio reviews.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === 'All' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setFilter('Registered')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === 'Registered' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            My Passes
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {filter === 'Registered' ? 'No Registered Event Passes Yet' : 'No Events Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
            {filter === 'Registered'
              ? 'You have not claimed any event passes yet. Browse upcoming campus hackathons and workshops to register!'
              : 'There are currently no events matching your filter.'}
          </p>
          {filter === 'Registered' && (
            <button
              onClick={() => setFilter('All')}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Browse All Events ({events.length})
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt: PlatformEvent) => {
          const isReg = dataService.isStudentRegisteredForEvent(evt.id, activeStudent.id, activeStudent.email);
          return (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`h-24 bg-gradient-to-r ${evt.bannerGradient} p-4 flex items-start justify-between text-white`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-full">
                    {evt.category}
                  </span>
                  <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                    {evt.mode}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{evt.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{evt.description}</p>
                  
                  <div className="space-y-1 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{evt.date} &middot; {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                {isReg ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Registered</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Spots Available</span>
                )}

                {!isReg && (
                  <button
                    onClick={() => setRegisteringEvent(evt)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Claim Pass</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
