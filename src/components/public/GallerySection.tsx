import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filtered = gallery.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <section id="gallery-section" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5 block">
            Memories &amp; Milestones
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Past Event Gallery
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A visual retrospective of hackathons, student product launches, and community demo days hosted across Freeverse.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Canvas Representation with CSS Mesh Gradient & Art Pattern */}
                <div
                  className={`h-44 bg-gradient-to-br ${item.themeColor} p-4 flex flex-col justify-between text-white relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-semibold flex items-center gap-1 bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>

                  <div className="z-10 mt-auto">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center mb-1">
                      <ImageIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Decorative ambient ring */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border-4 border-white/10 pointer-events-none" />
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                    {item.eventName}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-700 italic">
                    "{item.caption}"
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Archived Edition
                </span>
                <span>Verified by Admin</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
