import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Image, X, PlusCircle } from 'lucide-react';

interface AddGalleryModalProps {
  onClose: () => void;
}

export const AddGalleryModal: React.FC<AddGalleryModalProps> = ({ onClose }) => {
  const { showToast, events } = useApp();

  const [eventName, setEventName] = useState(events[0]?.name || 'HackVerse Campus Showcase');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('Oct 2026');
  const [category, setCategory] = useState('Hackathons');
  const [themeColor, setThemeColor] = useState('from-indigo-600 to-purple-800');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !caption.trim() || !description.trim()) {
      showToast('Please fill out all fields.', 'warning');
      return;
    }

    dataService.addGalleryItem({
      eventId: `evt-gal-${Date.now()}`,
      eventName: eventName.trim(),
      caption: caption.trim(),
      description: description.trim(),
      date,
      category,
      themeColor
    });

    showToast('New event gallery entry added successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Image className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Add Past Event Gallery Entry</h3>
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
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Winter AI Demo Day 2026"
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Caption / Highlight <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. 40 Teams presenting live campus AI tools"
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
            />
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
              placeholder="Summarize key event outcomes, student sponsors, and winners..."
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date / Edition
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Nov 2026"
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
              >
                <option value="Hackathons">Hackathons</option>
                <option value="Workshops">Workshops</option>
                <option value="Competitions">Competitions</option>
                <option value="Community Meetups">Community Meetups</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Visual Theme Color
            </label>
            <select
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
            >
              <option value="from-indigo-600 to-purple-800">Indigo &amp; Purple</option>
              <option value="from-emerald-600 to-teal-800">Emerald &amp; Teal</option>
              <option value="from-rose-600 to-pink-800">Rose &amp; Pink</option>
              <option value="from-amber-600 to-orange-800">Amber &amp; Orange</option>
              <option value="from-blue-600 to-cyan-800">Blue &amp; Cyan</option>
            </select>
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
              Add to Gallery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
