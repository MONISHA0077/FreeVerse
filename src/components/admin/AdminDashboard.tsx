import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck,
  RotateCcw,
  Sparkles,
  UserPlus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { stats, students, tasks, projects, reports, setAdminTab, resetDemoData, setShowAddStudentModal } = useApp();

  // Task distribution
  const openTasks = tasks.filter((t) => t.status === 'Open').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const draftTasks = tasks.filter((t) => t.status === 'Draft').length;

  // Student statuses
  const activeStudents = students.filter((s) => s.status === 'Active').length;
  const pendingStudents = students.filter((s) => s.status === 'Pending').length;
  const suspendedStudents = students.filter((s) => s.status === 'Suspended').length;

  return (
    <div className="space-y-8">
      {/* Admin Hero Bar */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold bg-indigo-950/80 px-2 py-0.5 rounded-sm border border-indigo-800">
              Platform Administration
            </span>
            <span className="text-xs text-slate-400">Live Local State Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Freeverse Master Console</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time management for enrolled students, verified clients, task marketplaces, events, reports, and content governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            title="Enroll a new student to Freeverse"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Student</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to default initial state?')) {
                resetDemoData();
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-slate-800 hover:bg-rose-900/60 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* 8 Calculated Statistics (from Section 45 user brief) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Students</span>
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">{stats.totalStudents}</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">{stats.activeStudents} active</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Clients</span>
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">{stats.totalClients}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Verified orgs</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Active Tasks</span>
          <span className="text-xl font-bold font-mono text-indigo-600 tabular-nums">{stats.activeTasks}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Open briefs</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Applications</span>
          <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">{stats.totalApplications}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Proposals filed</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Active Proj.</span>
          <span className="text-xl font-bold font-mono text-amber-600 tabular-nums">{stats.activeProjects}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">In delivery</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Completed</span>
          <span className="text-xl font-bold font-mono text-emerald-600 tabular-nums">{stats.completedProjects}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Approved</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Events</span>
          <span className="text-xl font-bold font-mono text-purple-600 tabular-nums">{stats.totalEvents}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{stats.upcomingEvents} upcoming</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Reports</span>
          <span className={`text-xl font-bold font-mono tabular-nums ${stats.pendingReports > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {stats.pendingReports}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Needs review</span>
        </div>
      </div>

      {/* Visual Analytics Grid (from section 45 & 78 user brief) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Popular Skills Chart (Calculated from Data) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Most In-Demand Skills
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Calculated</span>
          </div>

          <div className="space-y-2.5">
            {stats.popularSkills.map((sk) => {
              const maxCount = stats.popularSkills[0]?.count || 1;
              const pct = Math.round((sk.count / maxCount) * 100);
              return (
                <div key={sk.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800">{sk.name}</span>
                    <span className="font-mono text-slate-500 tabular-nums">{sk.count} mentions</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Lifecycle Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Task Pipeline Breakdown
            </h3>
            <button
              onClick={() => setAdminTab('tasks')}
              className="text-xs text-indigo-600 font-semibold"
            >
              View tasks
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs">
              <span className="font-semibold text-emerald-900">Open For Proposals</span>
              <span className="font-mono font-bold text-emerald-700">{openTasks} tasks</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs">
              <span className="font-semibold text-indigo-900">In Active Progress</span>
              <span className="font-mono font-bold text-indigo-700">{inProgressTasks} tasks</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-xs">
              <span className="font-semibold text-blue-900">Completed &amp; Delivered</span>
              <span className="font-mono font-bold text-blue-700">{completedTasks} tasks</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700">Drafts</span>
              <span className="font-mono font-bold text-slate-600">{draftTasks} tasks</span>
            </div>
          </div>
        </div>

        {/* Student Verification & Safety */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Community Status
            </h3>
            <button
              onClick={() => setAdminTab('students')}
              className="text-xs text-indigo-600 font-semibold"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-800">Active Students</span>
              <span className="font-mono font-bold text-emerald-600">{activeStudents}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs">
              <span className="font-semibold text-amber-900">Pending Review</span>
              <span className="font-mono font-bold text-amber-700">{pendingStudents}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs">
              <span className="font-semibold text-rose-900">Suspended / Flagged</span>
              <span className="font-mono font-bold text-rose-700">{suspendedStudents}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs">
              <span className="font-semibold text-purple-900">Pending Reports</span>
              <span className="font-mono font-bold text-purple-700">{stats.pendingReports}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
