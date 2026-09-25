import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentDashboard } from '../components/student/StudentDashboard';
import { FindTasks } from '../components/student/FindTasks';
import { MyApplications } from '../components/student/MyApplications';
import { StudentProjects } from '../components/student/StudentProjects';
import { StudentMessages } from '../components/student/StudentMessages';
import { StudentPortfolio } from '../components/student/StudentPortfolio';
import { StudentEvents } from '../components/student/StudentEvents';
import { StudentNotifications } from '../components/student/StudentNotifications';
import { StudentProfileView } from '../components/student/StudentProfileView';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  FolderGit2, 
  Calendar, 
  Bell, 
  User, 
  ChevronRight,
  Menu,
  X,
  UserPlus
} from 'lucide-react';

export const StudentView: React.FC = () => {
  const { 
    studentTab, 
    setStudentTab, 
    activeStudent, 
    notifications,
    applications,
    projects,
    setShowAddStudentModal
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!activeStudent) return null;

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const activeAppsCount = applications.filter((a) => a.studentId === activeStudent.id && a.status === 'Pending').length;
  const activeProjectsCount = projects.filter((p) => p.studentId === activeStudent.id && p.status !== 'Completed').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'find-tasks', label: 'Find Tasks', icon: Search },
    { id: 'applications', label: 'Applications', icon: FileText, badge: activeAppsCount > 0 ? activeAppsCount : undefined },
    { id: 'projects', label: 'Projects', icon: Briefcase, badge: activeProjectsCount > 0 ? activeProjectsCount : undefined },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'portfolio', label: 'Portfolio', icon: FolderGit2 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <img
            src={activeStudent.avatar}
            alt={activeStudent.name}
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div className="leading-tight">
            <span className="text-xs font-bold text-slate-900 block">{activeStudent.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">{activeStudent.studentId} &middot; Student</span>
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
          {/* Active Student Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <img
              src={activeStudent.avatar}
              alt={activeStudent.name}
              className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">{activeStudent.name}</span>
              <span className="text-[11px] font-mono text-indigo-600 block">{activeStudent.studentId}</span>
              <span className="text-[10px] text-slate-400 block truncate">{activeStudent.role}</span>
            </div>
          </div>

          {/* Admin Add Student Action Button */}
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="w-full py-2 px-3 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            title="Admin: Enroll a new student"
          >
            <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ Add Student (Admin)</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = studentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setStudentTab(item.id);
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
          <span>Student Module Active</span>
          <span className="block mt-0.5 text-slate-500 font-medium">Verified Campus Member</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto">
        {/* Contextual Breadcrumb & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Student Console</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="capitalize font-semibold text-slate-800">
              {studentTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Student (Admin)</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        {studentTab === 'dashboard' && <StudentDashboard />}
        {studentTab === 'find-tasks' && <FindTasks />}
        {studentTab === 'applications' && <MyApplications />}
        {studentTab === 'projects' && <StudentProjects />}
        {studentTab === 'messages' && <StudentMessages />}
        {studentTab === 'portfolio' && <StudentPortfolio />}
        {studentTab === 'events' && <StudentEvents />}
        {studentTab === 'notifications' && <StudentNotifications />}
        {studentTab === 'profile' && <StudentProfileView />}
      </main>
    </div>
  );
};
