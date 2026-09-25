import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, publicSection, setPublicSection } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'events', label: 'Events' },
    { id: 'freelancers', label: 'Freelancers' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'gallery', label: 'Gallery' }
  ];

  const handleNavClick = (sectionId: string) => {
    if (role !== 'public') {
      setRole('public');
    }
    setPublicSection(sectionId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-9 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
              F
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              FREEVERSE
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`transition-colors hover:text-slate-900 pb-0.5 border-b-2 ${
                role === 'public' && publicSection === link.id
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary demo actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => setRole('student')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Student
          </button>
          <button
            onClick={() => setRole('client')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Client
          </button>
          <button
            onClick={() => setRole('admin')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 shadow-xs"
          >
            <span>Admin</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`py-2 px-3 text-left text-sm rounded-md font-medium ${
                  role === 'public' && publicSection === link.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Module Quick Switch
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setRole('student');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-center text-xs font-semibold rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Student Demo
              </button>
              <button
                onClick={() => {
                  setRole('client');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-center text-xs font-semibold rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Client Demo
              </button>
              <button
                onClick={() => {
                  setRole('admin');
                  setMobileMenuOpen(false);
                }}
                className="py-2 text-center text-xs font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
