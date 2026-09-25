import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventCategory, PlatformEvent } from '../../types';
import { dataService } from '../../services/dataService';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Workshops',
  'Competitions',
  'Seminars',
  'Hackathons',
  'Technical Events',
  'Non-Technical Events',
  'Webinars',
  'Career Sessions',
  'Community Meetups'
];

export const EventsSection: React.FC = () => {
  const { events, setRegisteringEvent, activeStudent, role } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'All' | EventCategory>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');

  const filteredEvents = events.filter((evt) => {
    if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;
    if (selectedMode !== 'All' && evt.mode !== selectedMode) return false;
    return true;
  });

  return (
    <section id="events-section" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5 block">
              Campus Activities &amp; Upskilling
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Events &amp; Workshops
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Join hackathons, interactive technical clinics, founder panels, and portfolio sprints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Mode:</span>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-slate-700 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const count = cat === 'All' 
              ? events.length 
              : events.filter((e) => e.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Events Grid or Empty State */}
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-white rounded-xl shadow-2xs border border-slate-200 flex items-center justify-center mx-auto mb-3 text-indigo-600">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No events in "{selectedCategory}"
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
              There are currently no events matching this category and mode ({selectedMode}). Check back soon or browse all campus activities.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedMode('All');
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Show All Events ({events.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt: PlatformEvent) => {
            const isRegistered = dataService.isStudentRegisteredForEvent(
              evt.id,
              role === 'student' && activeStudent ? activeStudent.id : undefined,
              role === 'student' && activeStudent ? activeStudent.email : undefined
            );
            const registrationsCount = dataService.getEventRegistrations(evt.id).length;

            return (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Decorative Banner */}
                  <div className={`h-28 bg-gradient-to-r ${evt.bannerGradient} p-4 flex flex-col justify-between text-white relative`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-black/25 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                        {evt.category}
                      </span>
                      <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                        {evt.mode}
                      </span>
                    </div>
                    <div className="text-xs font-medium opacity-90 truncate">
                      {evt.organizer}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Meta details */}
                    <div className="space-y-1.5 pt-2 text-xs text-slate-500 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{evt.date} · {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          {registrationsCount} / {evt.maxParticipants} spots filled
                        </span>
                        <span>Deadline: {evt.registrationDeadline}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  {isRegistered ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Registered</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-700">
                      Registration Open
                    </span>
                  )}

                  {isRegistered ? (
                    <span className="text-xs font-medium text-slate-400">Pass Active</span>
                  ) : (
                    <button
                      onClick={() => setRegisteringEvent(evt)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Register for Event</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
};
