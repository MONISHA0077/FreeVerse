import React from 'react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../common/RatingStars';
import { Star, MessageSquare } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { reviews } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            Verified Ratings &amp; Testimonials Audit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor client feedback, verify project reviews, and maintain rating integrity across the platform.
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Total: <strong className="text-slate-900">{reviews.length}</strong> reviews recorded
        </span>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-xs font-bold text-slate-900">{rev.authorName}</span>
                <span className="text-xs text-slate-400"> reviewed </span>
                <span className="text-xs font-bold text-indigo-700">{rev.targetName}</span>
              </div>
              <div className="flex items-center gap-2">
                <RatingStars rating={rev.rating} />
                <span className="text-[11px] text-slate-400 font-mono">{rev.createdAt}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
              "{rev.comment}"
            </p>

            <span className="text-[10px] text-slate-400 font-mono block">
              Contract ID: {rev.projectId} &middot; Task ID: {rev.taskId}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
