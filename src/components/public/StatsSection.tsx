import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Code, CheckCircle2, Clock, Calendar, Building2 } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { stats } = useApp();

  const statItems = [
    {
      label: 'Students',
      value: stats.totalStudents,
      sublabel: 'Enrolled across departments',
      icon: Users,
      color: 'text-indigo-600'
    },
    {
      label: 'Freelancers',
      value: stats.activeStudents,
      sublabel: 'Active & ready for briefs',
      icon: Code,
      color: 'text-emerald-600'
    },
    {
      label: 'Projects Completed',
      value: stats.completedProjects,
      sublabel: 'Delivered & reviewed',
      icon: CheckCircle2,
      color: 'text-blue-600'
    },
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      sublabel: 'Currently in sprint',
      icon: Clock,
      color: 'text-amber-600'
    },
    {
      label: 'Events',
      value: stats.totalEvents,
      sublabel: 'Workshops & hackathons',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      label: 'Clients',
      value: stats.totalClients,
      sublabel: 'Startups & campus labs',
      icon: Building2,
      color: 'text-slate-800'
    }
  ];

  return (
    <section className="bg-slate-50 border-b border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Live</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">{item.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.sublabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
