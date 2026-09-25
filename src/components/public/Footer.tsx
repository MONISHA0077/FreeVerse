import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setRole, setPublicSection } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand Info */}
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                F
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                FREEVERSE
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Learn. Create. Freelance. Grow. The unified student community and project collaboration platform for tomorrow's builders.
            </p>
            <div className="text-[11px] text-slate-400">
              Demonstration Build &middot; Client-Side Persistence
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider block mb-3">
                Platform
              </span>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <button onClick={() => { setRole('public'); setPublicSection('freelancers'); }} className="hover:text-slate-900">
                    Find Freelancers
                  </button>
                </li>
                <li>
                  <button onClick={() => { setRole('public'); setPublicSection('events'); }} className="hover:text-slate-900">
                    Upcoming Events
                  </button>
                </li>
                <li>
                  <button onClick={() => { setRole('public'); setPublicSection('how-it-works'); }} className="hover:text-slate-900">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => { setRole('public'); setPublicSection('gallery'); }} className="hover:text-slate-900">
                    Event Gallery
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider block mb-3">
                Demo Modules
              </span>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <button onClick={() => setRole('student')} className="hover:text-indigo-600">
                    Student Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setRole('client')} className="hover:text-indigo-600">
                    Client Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => setRole('admin')} className="hover:text-indigo-600">
                    Admin Console
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider block mb-3">
                About &amp; Trust
              </span>
              <ul className="space-y-2 text-slate-600">
                <li>
                  <button onClick={() => { setRole('public'); setPublicSection('about'); }} className="hover:text-slate-900">
                    Vision &amp; Mission
                  </button>
                </li>
                <li>
                  <button onClick={() => { setRole('public'); setPublicSection('contact'); }} className="hover:text-slate-900">
                    Contact Us
                  </button>
                </li>
                <li>
                  <span className="text-slate-400">Zero Platform Fees</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; 2026 Freeverse. Built for student creators, freelancers, and campus collaborators.
          </div>
          <div className="flex items-center gap-4">
            <span>Client-side Mock Layer</span>
            <span>&middot;</span>
            <span>Local Storage Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
