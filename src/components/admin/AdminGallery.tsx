import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { AddGalleryModal } from './AddGalleryModal';
import { Image, PlusCircle, Trash2, Calendar } from 'lucide-react';

export const AdminGallery: React.FC = () => {
  const { gallery, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete gallery entry "${name}"?`)) {
      dataService.deleteGalleryItem(id);
      showToast('Gallery entry removed.', 'info');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Image className="w-5 h-5 text-indigo-600" />
            Past Events Gallery Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Curate photo showcases, student achievements, and historical demo day retrospective entries.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Gallery Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((g) => (
          <div
            key={g.id}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className={`h-28 bg-gradient-to-r ${g.themeColor} p-3 flex flex-col justify-between text-white relative`}>
                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-bold uppercase bg-black/30 px-2 py-0.5 rounded-full">
                    {g.category}
                  </span>
                  <span className="text-[10px] font-mono bg-black/20 px-2 py-0.5 rounded-full">
                    {g.date}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{g.eventName}</h3>
                <p className="text-xs font-semibold text-indigo-700 italic">"{g.caption}"</p>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{g.description}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Publicly visible</span>
              <button
                onClick={() => handleDelete(g.id, g.eventName)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition-colors"
                title="Delete gallery entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && <AddGalleryModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
