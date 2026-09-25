import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RatingStars } from '../common/RatingStars';
import { 
  FileText, 
  Briefcase, 
  CheckCircle2, 
  Star, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  FolderGit2,
  UserPlus,
  Send
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    activeStudent,
    applications,
    projects,
    tasks,
    clients,
    events,
    messages,
    setStudentTab,
    setInspectTaskId,
    setActiveWorkspaceProjectId,
    setShowAddStudentModal
  } = useApp();

  if (!activeStudent) return null;

  // Student metrics
  const myApplications = applications.filter((a) => a.studentId === activeStudent.id);
  const activeApps = myApplications.filter((a) => a.status === 'Pending' || a.status === 'Shortlisted');
  const myProjects = projects.filter((p) => p.studentId === activeStudent.id);
  const activeProjects = myProjects.filter((p) => p.status !== 'Completed' && p.status !== 'Cancelled');
  const completedProjects = myProjects.filter((p) => p.status === 'Completed');

  const myMessages = messages.filter((m) => m.recipientId === activeStudent.id && !m.read);
  const upcomingEvents = events.filter((e) => e.status === 'Upcoming');

  // Recommended tasks (matching skills)
  const recommendedTasks = tasks
    .filter((t) => t.status === 'Open')
    .slice(0, 3);

  // Recent applications
  const recentApps = myApplications.slice(0, 4);

  // Upcoming deadlines from active projects milestones
  const upcomingDeadlines = activeProjects
    .flatMap((p) => p.milestones.filter((m) => m.status !== 'Completed').map((m) => ({ ...m, projectTitle: p.taskTitle })))
    .slice(0, 3);

  // Recent messages
  const recentConversations = messages
    .filter((m) => m.recipientId === activeStudent.id || m.senderId === activeStudent.id)
    .slice(-3);

  return (
    <div className="space-y-8">
      {/* Student Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeStudent.avatar}
            alt={activeStudent.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-xs bg-slate-100"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">
                Welcome back, {activeStudent.name}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-semibold">
                {activeStudent.studentId}
              </span>
              <StatusBadge status={activeStudent.availability} size="sm" />
            </div>
            <p className="text-xs text-indigo-600 font-semibold">{activeStudent.role} &middot; {activeStudent.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setStudentTab('messages')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Messages</span>
          </button>

          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 border border-indigo-200 shadow-2xs"
            title="Admin: Register or add another student to the platform"
          >
            <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ Add Student (Admin)</span>
          </button>

          <button
            onClick={() => setStudentTab('find-tasks')}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Browse Open Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6 Key Statistics Cards (from section 13 brief) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Active Apps</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {activeApps.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Proposals pending</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Active Projects</span>
            <Briefcase className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {activeProjects.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">In active sprint</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {activeStudent.completedProjectsCount}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Verified finishes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {activeStudent.rating}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">({activeStudent.ratingCount} reviews)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Unread</span>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {myMessages.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">New messages</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Upcoming Events</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {upcomingEvents.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Campus schedules</span>
        </div>
      </div>

      {/* Quick Action Banner for Texting & Admin Student Addition */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-indigo-800/60 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 rounded-md border border-indigo-400/30">
              Communication &amp; Enrollment Hub
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            Connect With Clients &amp; Enroll New Students
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl">
            Communicate directly with client partners anytime in the <strong>Messages</strong> tab or project workspaces. Admins can enroll new students instantly.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={() => setStudentTab('messages')}
            className="px-4 py-2 text-xs font-bold text-indigo-900 bg-white hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Open Client Messages</span>
          </button>
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Student (Admin)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Active Projects & Recommended Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Projects */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Active Projects Progress
              </h3>
              <button
                onClick={() => setStudentTab('projects')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View all
              </button>
            </div>

            {activeProjects.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                No active projects right now. Browse open tasks to apply!
              </div>
            ) : (
              <div className="space-y-4">
                {activeProjects.map((p) => {
                  const client = clients.find((c) => c.id === p.clientId);
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{p.taskTitle}</h4>
                          <span className="text-xs text-slate-500">
                            Client: <strong>{client?.company || client?.name}</strong> &middot; Due {p.deadline}
                          </span>
                        </div>
                        <StatusBadge status={p.status} size="sm" />
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-500">Milestone Progress</span>
                          <span className="font-mono font-bold text-indigo-600">{p.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-mono text-xs font-semibold text-emerald-700">
                          ${p.budget} stipend
                        </span>
                        <button
                          onClick={() => {
                            setActiveWorkspaceProjectId(p.id);
                            setStudentTab('projects');
                          }}
                          className="px-3 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          Open Workspace &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommended Tasks */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Recommended Tasks For You
              </h3>
              <button
                onClick={() => setStudentTab('find-tasks')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Browse Marketplace
              </button>
            </div>

            <div className="space-y-3">
              {recommendedTasks.map((t) => {
                const cl = clients.find((c) => c.id === t.clientId);
                return (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">
                          {t.category}
                        </span>
                        <span className="text-xs text-slate-400">&middot;</span>
                        <span className="text-xs text-slate-500">{cl?.company || cl?.name}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {t.requiredSkills.map((sk) => (
                          <span key={sk} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-sm">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className="font-mono text-sm font-bold text-emerald-600">
                        ${t.budget}
                      </span>
                      <button
                        onClick={() => setInspectTaskId(t.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-colors"
                      >
                        Details &amp; Apply
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar widgets) */}
        <div className="space-y-6">
          {/* Recent Applications Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Applications
              </h3>
              <button
                onClick={() => setStudentTab('applications')}
                className="text-xs text-indigo-600 font-semibold"
              >
                All
              </button>
            </div>

            {recentApps.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No applications filed yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentApps.map((a) => {
                  const task = tasks.find((t) => t.id === a.taskId);
                  return (
                    <div
                      key={a.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {task?.title || 'Task'}
                        </h4>
                        <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                          ${a.proposedAmount} &middot; {a.appliedDate}
                        </span>
                      </div>
                      <StatusBadge status={a.status} size="sm" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Upcoming Deadlines
            </h3>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No urgent milestones due.</p>
            ) : (
              <div className="space-y-2.5">
                {upcomingDeadlines.map((dl) => (
                  <div key={dl.id} className="p-3 bg-amber-50/60 rounded-lg border border-amber-100">
                    <span className="text-xs font-bold text-slate-900 block">{dl.title}</span>
                    <span className="text-[11px] text-slate-500 block truncate">{dl.projectTitle}</span>
                    <span className="text-[11px] font-mono text-amber-800 font-semibold mt-1 block">
                      Due: {dl.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Messages Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Messages
              </h3>
              <button
                onClick={() => setStudentTab('messages')}
                className="text-xs text-indigo-600 font-semibold"
              >
                Open Chat
              </button>
            </div>

            {recentConversations.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No messages yet.</p>
            ) : (
              <div className="space-y-2">
                {recentConversations.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-slate-700">{m.senderName}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-1">{m.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
