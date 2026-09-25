import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Briefcase, Calendar, Sparkles, Code2, Users } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setRole, setPublicSection, setClientTab } = useApp();

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 py-16 sm:py-24">
      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Natural human editorial kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>The Student Freelance &amp; Campus Collaboration Network</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] text-balance">
            Learn. Create. Freelance. Grow.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Freeverse connects talented students with real-world projects, freelance opportunities, events, and a collaborative student community.
          </p>

          {/* 4 Primary Action Buttons from user brief */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setRole('student')}
              className="px-5 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
            >
              <span>Join Freeverse</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setPublicSection('freelancers');
                const el = document.getElementById('freelancers-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Explore Freelancers</span>
            </button>

            <button
              onClick={() => {
                setRole('client');
                setClientTab('post-task');
              }}
              className="px-5 py-3 text-sm font-semibold text-slate-800 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Post a Task</span>
            </button>

            <button
              onClick={() => {
                setPublicSection('events');
                const el = document.getElementById('events-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Explore Events</span>
            </button>
          </div>

          {/* Quiet Trust Markers */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              Real campus client briefs
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Zero platform fees for learners</span>
            <span className="hidden sm:inline">·</span>
            <span>Verified collegiate portfolios</span>
          </div>
        </div>
      </div>
    </section>
  );
};
