import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { EventCategory, EventMode } from '../../types';
import { Calendar, PlusCircle, X, Sparkles } from 'lucide-react';

interface CreateEventModalProps {
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose }) => {
  const { showToast } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('Workshops');
  const [date, setDate] = useState('2026-11-10');
  const [time, setTime] = useState('10:00 AM - 01:00 PM');
  const [venue, setVenue] = useState('Campus Innovation Hub 4A');
  const [mode, setMode] = useState<EventMode>('Hybrid');
  const [organizer, setOrganizer] = useState('Freeverse Student Tech Council');
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-11-08');
  const [maxParticipants, setMaxParticipants] = useState(150);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      showToast('Please enter an event name and summary.', 'warning');
      return;
    }

    dataService.createEvent({
      name: name.trim(),
      description: description.trim(),
      category,
      date,
      time,
      venue: venue.trim(),
      mode,
      organizer: organizer.trim(),
      registrationDeadline,
      maxParticipants: Number(maxParticipants),
      bannerGradient: 'from-indigo-600 via-purple-600 to-pink-600',
      status: 'Upcoming',
      tags: ['Innovation', 'Campus', category]
    });

    showToast(`Event "${name}" scheduled and published to campus calendar!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Create Campus Event</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NextGen Web3 & AI Hackathon"
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900"
              >
                <option value="Workshops">Workshops</option>
                <option value="Competitions">Competitions</option>
                <option value="Seminars">Seminars</option>
                <option value="Hackathons">Hackathons</option>
                <option value="Technical Events">Technical Events</option>
                <option value="Career Sessions">Career Sessions</option>
                <option value="Community Meetups">Community Meetups</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as EventMode)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide agenda, guest speakers, and prizes..."
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Window
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 AM - 01:00 PM"
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Venue Location
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Campus Auditorium / Virtual Zoom"
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Schedule &amp; Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
