import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClientDashboard } from '../components/client/ClientDashboard';
import { PostTask } from '../components/client/PostTask';
import { ClientTasks } from '../components/client/ClientTasks';
import { ClientProjects } from '../components/client/ClientProjects';
import { ClientMessages } from '../components/client/ClientMessages';
import { ClientNotifications } from '../components/client/ClientNotifications';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Clock, 
  MessageSquare, 
  Bell, 
  Building, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export const ClientView: React.FC = () => {
  const {
    clientTab,
    setClientTab,
    activeClient,
    notifications,
    tasks,
    applications
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!activeClient) return null;

  const clientTasks = tasks.filter((t) => t.clientId === activeClient.id);
  const myTaskIds = clientTasks.map((t) => t.id);
  const totalAppsCount = applications.filter((a) => myTaskIds.includes(a.taskId) && a.status === 'Pending').length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'post-task', label: 'Post a Task', icon: PlusCircle },
    { id: 'my-tasks', label: 'My Tasks & Applications', icon: Briefcase, badge: totalAppsCount > 0 ? totalAppsCount : undefined },
    { id: 'projects', label: 'Projects & Workspace', icon: Clock },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'notifications', label: 'Alerts & Activity', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <img
            src={activeClient.avatar}
            alt={activeClient.name}
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div className="leading-tight">
            <span className="text-xs font-bold text-slate-900 block truncate">{activeClient.company || activeClient.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">Client Lead: {activeClient.name}</span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-slate-200 shrink-0 md:sticky md:top-25 md:h-[calc(100vh-100px)] flex flex-col justify-between overflow-y-auto z-20`}
      >
        <div className="p-4 space-y-6">
          {/* Active Client Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <img
              src={activeClient.avatar}
              alt={activeClient.name}
              className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">{activeClient.company}</span>
              <span className="text-[11px] text-indigo-600 block">{activeClient.name}</span>
              <span className="text-[10px] text-slate-400 block truncate">{activeClient.industry}</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = clientTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setClientTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quiet Info */}
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400">
          <span>Client Employer Hub</span>
          <span className="block mt-0.5 text-slate-500 font-medium">Verified Partner Lab</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto">
        {/* Contextual Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <span>Employer Portal</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="capitalize font-semibold text-slate-800">
            {clientTab.replace('-', ' ')}
          </span>
        </div>

        {clientTab === 'dashboard' && <ClientDashboard />}
        {clientTab === 'post-task' && <PostTask />}
        {clientTab === 'my-tasks' && <ClientTasks />}
        {clientTab === 'projects' && <ClientProjects />}
        {clientTab === 'messages' && <ClientMessages />}
        {clientTab === 'notifications' && <ClientNotifications />}
      </main>
    </div>
  );
};
