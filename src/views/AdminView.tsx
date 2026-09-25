import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminStudents } from '../components/admin/AdminStudents';
import { AdminClients } from '../components/admin/AdminClients';
import { AdminTasks } from '../components/admin/AdminTasks';
import { AdminProjects } from '../components/admin/AdminProjects';
import { AdminEvents } from '../components/admin/AdminEvents';
import { AdminGallery } from '../components/admin/AdminGallery';
import { AdminReports } from '../components/admin/AdminReports';
import { AdminReviews } from '../components/admin/AdminReviews';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Briefcase, 
  FolderGit2, 
  Calendar, 
  Image, 
  Flag, 
  Star, 
  ChevronRight,
  Menu,
  X,
  RotateCcw
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { adminTab, setAdminTab, reports, stats, resetDemoData } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingReportsCount = reports.filter((r) => r.status === 'Open' || r.status === 'Under Review').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Analytics', icon: ShieldCheck },
    { id: 'students', label: 'Students', icon: Users, badge: stats.totalStudents },
    { id: 'clients', label: 'Clients', icon: Building2, badge: stats.totalClients },
    { id: 'tasks', label: 'Tasks Marketplace', icon: Briefcase, badge: stats.activeTasks },
    { id: 'projects', label: 'Projects & Contracts', icon: FolderGit2, badge: stats.activeProjects },
    { id: 'events', label: 'Events & Workshops', icon: Calendar, badge: stats.upcomingEvents },
    { id: 'gallery', label: 'Event Gallery', icon: Image },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'reports', label: 'Reports & Safety', icon: Flag, badge: pendingReportsCount > 0 ? pendingReportsCount : undefined }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Freeverse Admin Console</span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-slate-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 md:sticky md:top-25 md:h-[calc(100vh-100px)] flex flex-col justify-between overflow-y-auto z-20`}
      >
        <div className="p-4 space-y-6">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
              Administrative Control
            </span>
            <span className="text-sm font-bold text-white block mt-0.5">Freeverse Core Team</span>
            <span className="text-[11px] text-slate-400 block">Full Governance Clearance</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to default initial state?')) {
                resetDemoData();
              }
            }}
            className="w-full py-1.5 px-2.5 text-xs text-rose-300 hover:text-white hover:bg-rose-950/40 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-rose-900/50"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
          <div className="text-[10px] text-slate-500 text-center">
            No Authentication System Active
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <span>Admin Console</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="capitalize font-semibold text-slate-800">
            {adminTab.replace('-', ' ')}
          </span>
        </div>

        {adminTab === 'dashboard' && <AdminDashboard />}
        {adminTab === 'students' && <AdminStudents />}
        {adminTab === 'clients' && <AdminClients />}
        {adminTab === 'tasks' && <AdminTasks />}
        {adminTab === 'projects' && <AdminProjects />}
        {adminTab === 'events' && <AdminEvents />}
        {adminTab === 'gallery' && <AdminGallery />}
        {adminTab === 'reviews' && <AdminReviews />}
        {adminTab === 'reports' && <AdminReports />}
      </main>
    </div>
  );
};
