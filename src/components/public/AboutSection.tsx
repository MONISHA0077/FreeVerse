import React from 'react';
import { 
  Target, 
  Compass, 
  CheckCircle2, 
  Briefcase, 
  FolderGit2, 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp 
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const objectives = [
    'Give students real-world experience',
    'Help students build portfolios',
    'Connect students with clients',
    'Encourage collaboration',
    'Improve technical skills',
    'Improve communication skills',
    'Conduct workshops',
    'Conduct competitions',
    'Create networking opportunities'
  ];

  const valueCards = [
    {
      title: 'Real-World Experience',
      desc: 'Work on actual software projects, design systems, and marketing briefs commissioned by real founders.',
      icon: Briefcase,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100'
    },
    {
      title: 'Build Portfolio',
      desc: 'Publish verified case studies with source code links, live project demos, and real client reviews.',
      icon: FolderGit2,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100'
    },
    {
      title: 'Earn Through Skills',
      desc: 'Monetize your coding, design, and analysis abilities with transparent milestone-based stipends.',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100'
    },
    {
      title: 'Meet Clients',
      desc: 'Network with industry founders, university research labs, and startups hiring technical graduates.',
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-100'
    },
    {
      title: 'Join Events',
      desc: 'Compete in 36-hour national campus hackathons, technical masterclasses, and algorithm sprint leagues.',
      icon: Calendar,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-100'
    },
    {
      title: 'Improve Skills',
      desc: 'Master professional version control, milestone estimation, client communication, and system architecture.',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100'
    }
  ];

  return (
    <section id="about-section" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Our Vision
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              A Student-Powered Ecosystem
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Create a student-powered ecosystem where students can convert their classroom skills into practical experience, verified public achievements, and meaningful career momentum.
            </p>
          </div>

          {/* Mission */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Our Mission
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              One Unified Opportunity Hub
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect students, clients, opportunities, and learning experiences through one transparent platform that bridges the gap between academic theory and real industry execution.
            </p>
          </div>
        </div>

        {/* Objectives Section */}
        <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Guiding Principles
            </span>
            <h3 className="text-2xl font-bold text-slate-900">
              Core Platform Objectives
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Everything we design at Freeverse centers on accelerating student capability and professional trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {objectives.map((obj) => (
              <div
                key={obj}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-100 bg-slate-50/70"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-800">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Students Should Join */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Student Advantages
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Students Should Join
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              Transform your college years into a launchpad with real work, real credentials, and real connections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valueCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs hover:shadow-sm"
                >
                  <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{card.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
