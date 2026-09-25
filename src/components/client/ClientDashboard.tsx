import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Briefcase, 
  Inbox, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  Building,
  UserCheck
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const {
    activeClient,
    tasks,
    applications,
    projects,
    messages,
    students,
    setClientTab,
    setActiveWorkspaceProjectId,
    setViewingStudent
  } = useApp();

  if (!activeClient) return null;

  // Filter for this client
  const myTasks = tasks.filter((t) => t.clientId === activeClient.id);
  const activeTasks = myTasks.filter((t) => t.status === 'Open');
  
  const myTaskIds = myTasks.map((t) => t.id);
  const myApps = applications.filter((a) => myTaskIds.includes(a.taskId));
  
  const myProjects = projects.filter((p) => p.clientId === activeClient.id);
  const activeProjects = myProjects.filter((p) => p.status !== 'Completed' && p.status !== 'Cancelled');
  const completedProjects = myProjects.filter((p) => p.status === 'Completed');

  const myMessages = messages.filter((m) => m.recipientId === activeClient.id && !m.read);

  // Recent apps
  const recentApps = myApps.slice(0, 4);
  // Recent projects
  const recentProjects = myProjects.slice(0, 3);
  // Recent messages
  const recentConversations = messages
    .filter((m) => m.recipientId === activeClient.id || m.senderId === activeClient.id)
    .slice(-3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeClient.avatar}
            alt={activeClient.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-xs bg-slate-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{activeClient.company || activeClient.name}</h1>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Verified Client
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Managed by {activeClient.name} &middot; {activeClient.industry} &middot; {activeClient.location}
            </p>
          </div>
        </div>

        <button
          onClick={() => setClientTab('post-task')}
          className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Task</span>
        </button>
      </div>

      {/* 5 Key Statistics Cards (from section 19 brief) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Active Tasks</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {activeTasks.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Open on marketplace</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Applications</span>
            <Inbox className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {myApps.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">From student talents</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Active Projects</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {activeProjects.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">In delivery sprint</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {completedProjects.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Approved &amp; reviewed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Unread</span>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {myMessages.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Student messages</span>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Applications Received */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-indigo-600" />
                Recent Student Applications
              </h3>
              <button
                onClick={() => setClientTab('my-tasks')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Review all in My Tasks
              </button>
            </div>

            {recentApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                No applications received yet. Post a task or share your task on campus!
              </div>
            ) : (
              <div className="space-y-3">
                {recentApps.map((a) => {
                  const student = students.find((s) => s.id === a.studentId);
                  const task = tasks.find((t) => t.id === a.taskId);
                  return (
                    <div
                      key={a.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={student?.avatar}
                          alt={student?.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover bg-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{student?.name}</h4>
                            <span className="font-mono text-[10px] text-slate-400 font-semibold">{student?.studentId}</span>
                            <StatusBadge status={a.status} size="sm" />
                          </div>
                          <p className="text-xs text-indigo-600 font-medium">{student?.role}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Applied for: <strong className="text-slate-700">{task?.title}</strong></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {student && (
                          <button
                            onClick={() => setViewingStudent(student)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            View Profile
                          </button>
                        )}
                        <button
                          onClick={() => setClientTab('my-tasks')}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                        >
                          Review &amp; Decide
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Projects Tracker */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Active Deliverables In Progress
              </h3>
              <button
                onClick={() => setClientTab('projects')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View workspaces
              </button>
            </div>

            {activeProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                No active projects. Accept an applicant to initialize a workspace.
              </div>
            ) : (
              <div className="space-y-3">
                {activeProjects.map((p) => {
                  const student = students.find((s) => s.id === p.studentId);
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{p.taskTitle}</h4>
                          <span className="text-xs text-slate-500">
                            Student: <strong>{student?.name}</strong> &middot; Due {p.deadline}
                          </span>
                        </div>
                        <StatusBadge status={p.status} size="sm" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Milestone Progress</span>
                          <span className="font-mono font-bold text-indigo-600">{p.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-mono text-xs font-semibold text-emerald-700">${p.budget}</span>
                        <button
                          onClick={() => {
                            setActiveWorkspaceProjectId(p.id);
                            setClientTab('projects');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
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
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Client Quick Actions
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Looking for specialized talent? Post a brief or browse verified student portfolios directly.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setClientTab('post-task')}
                className="w-full py-2 px-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Publish New Brief</span>
              </button>
              <button
                onClick={() => setClientTab('my-tasks')}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-center"
              >
                Inspect Applications
              </button>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Student Messages
              </h3>
              <button
                onClick={() => setClientTab('messages')}
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
