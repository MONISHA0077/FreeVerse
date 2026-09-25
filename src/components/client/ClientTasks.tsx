import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { StatusBadge } from '../common/StatusBadge';
import { RatingStars } from '../common/RatingStars';
import { Task, Application, Student } from '../../types';
import { AcceptStudentModal } from './AcceptStudentModal';
import { BulkRejectionModal } from './BulkRejectionModal';
import { IndividualRejectModal } from './IndividualRejectModal';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  UserX, 
  ChevronRight, 
  ArrowLeft,
  Eye,
  Sparkles,
  Search
} from 'lucide-react';

export const ClientTasks: React.FC = () => {
  const {
    activeClient,
    tasks,
    applications,
    students,
    setViewingStudent,
    setActiveWorkspaceProjectId,
    setClientTab,
    showToast
  } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Accept & Bulk Rejection workflow states
  const [acceptingApp, setAcceptingApp] = useState<{ app: Application; student: Student; task: Task } | null>(null);
  const [bulkRejectionData, setBulkRejectionData] = useState<{
    taskId: string;
    selectedStudentId: string;
    selectedStudentName: string;
    otherApplicantCount: number;
  } | null>(null);
  const [individualRejectApp, setIndividualRejectApp] = useState<{ app: Application; student: Student } | null>(null);

  if (!activeClient) return null;

  const myTasks = tasks.filter((t) => t.clientId === activeClient.id);

  const filteredTasks = myTasks.filter((t) => {
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    return true;
  });

  const activeTask = tasks.find((t) => t.id === selectedTaskId);
  const taskApplications = selectedTaskId
    ? applications.filter((a) => a.taskId === selectedTaskId)
    : [];

  const handleShortlist = (appId: string) => {
    dataService.shortlistApplication(appId);
    showToast('Applicant shortlisted! Notification sent to student.', 'success');
  };

  const handleAcceptSuccess = (newProjectId: string, otherApplicantIds: string[]) => {
    if (!acceptingApp) return;

    const acceptedStudentId = acceptingApp.student.id;
    const acceptedStudentName = acceptingApp.student.name;
    const currentTaskId = acceptingApp.task.id;

    setAcceptingApp(null);
    showToast(`Project workspace created for ${acceptedStudentName}!`, 'success');

    // If there are other applicants, trigger the BULK REJECTION MODAL (Section 27 requirement!)
    if (otherApplicantIds.length > 0) {
      setBulkRejectionData({
        taskId: currentTaskId,
        selectedStudentId: acceptedStudentId,
        selectedStudentName: acceptedStudentName,
        otherApplicantCount: otherApplicantIds.length
      });
    } else {
      // Direct jump to workspace
      setActiveWorkspaceProjectId(newProjectId);
      setClientTab('projects');
    }
  };

  return (
    <div className="space-y-6">
      {/* View 1: Task Applicants Review Drawer/Page */}
      {selectedTaskId && activeTask ? (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => setSelectedTaskId(null)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to My Tasks</span>
              </button>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{activeTask.title}</h2>
                <StatusBadge status={activeTask.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Budget: <span className="font-mono font-bold text-emerald-600">${activeTask.budget}</span> &middot; Deadline: {activeTask.deadline} &middot; Level: {activeTask.experienceLevel}
              </p>
            </div>

            <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
              {taskApplications.length} Applicant(s)
            </div>
          </div>

          {/* Applicants List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Submitted Student Proposals
            </h3>

            {taskApplications.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-800">No applicants yet for this task</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Students browsing the marketplace will appear here once they submit proposals.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {taskApplications.map((app) => {
                  const student = students.find((s) => s.id === app.studentId);
                  if (!student) return null;

                  return (
                    <div
                      key={app.id}
                      className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-all shadow-2xs space-y-4"
                    >
                      {/* Top Row: Student Profile Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-bold text-slate-900">{student.name}</h4>
                              <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-semibold">
                                {student.studentId}
                              </span>
                              <StatusBadge status={student.availability} size="sm" />
                            </div>
                            <p className="text-xs text-indigo-600 font-semibold mt-0.5">{student.role}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                              <span>{student.department} &middot; {student.year}</span>
                              <span>&middot;</span>
                              <RatingStars rating={student.rating} count={student.ratingCount} size="sm" />
                              <span>&middot;</span>
                              <span>{student.completedProjectsCount} projects done</span>
                            </div>
                          </div>
                        </div>

                        {/* Proposal & Quote */}
                        <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                            Offered Quote
                          </span>
                          <span className="font-mono text-xl font-bold text-emerald-600">
                            ${app.proposedAmount}
                          </span>
                          <span className="text-[11px] text-slate-500 block font-mono">
                            Turnaround: {app.expectedDelivery}
                          </span>
                          <div className="mt-1">
                            <StatusBadge status={app.status} size="sm" />
                          </div>
                        </div>
                      </div>

                      {/* Proposal Message */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Proposal Pitch
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                          "{app.proposalMessage}"
                        </p>
                        {app.additionalMessage && (
                          <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-200/60">
                            Note: {app.additionalMessage}
                          </p>
                        )}
                      </div>

                      {/* Student skills */}
                      <div className="flex flex-wrap gap-1">
                        {student.skills.map((sk) => (
                          <span key={sk} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm">
                            {sk}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons: View Profile, Shortlist, Accept, Reject (Section 22 requirements) */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <button
                          onClick={() => setViewingStudent(student)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Full Profile</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {app.status === 'Pending' && (
                            <button
                              onClick={() => handleShortlist(app.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                            >
                              Shortlist
                            </button>
                          )}

                          {app.status !== 'Accepted' && app.status !== 'Rejected' && (
                            <>
                              <button
                                onClick={() => setIndividualRejectApp({ app, student })}
                                className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>

                              <button
                                onClick={() => setAcceptingApp({ app, student, task: activeTask })}
                                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Accept Student</span>
                              </button>
                            </>
                          )}

                          {app.status === 'Accepted' && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accepted &middot; Project Active</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* View 2: My Tasks List */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage My Posted Tasks</h2>
              <p className="text-xs text-slate-500 mt-1">
                Inspect incoming applications, select students, and monitor contract milestones.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto no-scrollbar">
              {['All', 'Open', 'In Progress', 'Completed', 'Draft'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                    filterStatus === st
                      ? 'bg-white text-indigo-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-800">No tasks in this category</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Post a new task to receive student proposals.</p>
              <button
                onClick={() => setClientTab('post-task')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
              >
                Post a Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((t) => {
                const appCount = applications.filter((a) => a.taskId === t.id).length;
                return (
                  <div
                    key={t.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm">
                            {t.category}
                          </span>
                          <StatusBadge status={t.status} size="sm" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{t.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="font-mono">Budget: ${t.budget}</span>
                          <span>&middot;</span>
                          <span>Deadline: {t.deadline}</span>
                          <span>&middot;</span>
                          <span>Duration: {t.expectedDuration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTaskId(t.id)}
                          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>View Applications ({appCount})</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ACCEPT STUDENT CONFIRMATION MODAL */}
      {acceptingApp && (
        <AcceptStudentModal
          application={acceptingApp.app}
          student={acceptingApp.student}
          task={acceptingApp.task}
          onClose={() => setAcceptingApp(null)}
          onAccepted={handleAcceptSuccess}
        />
      )}

      {/* BULK REJECTION MODAL (Section 27 & 28 requirement) */}
      {bulkRejectionData && (
        <BulkRejectionModal
          taskId={bulkRejectionData.taskId}
          selectedStudentId={bulkRejectionData.selectedStudentId}
          selectedStudentName={bulkRejectionData.selectedStudentName}
          otherApplicantCount={bulkRejectionData.otherApplicantCount}
          onClose={() => setBulkRejectionData(null)}
          onIndividualSelect={() => {
            setBulkRejectionData(null);
            showToast('You can reject applicants individually from the list below.', 'info');
          }}
        />
      )}

      {/* INDIVIDUAL REJECTION MODAL (Section 29 requirement) */}
      {individualRejectApp && (
        <IndividualRejectModal
          application={individualRejectApp.app}
          student={individualRejectApp.student}
          onClose={() => setIndividualRejectApp(null)}
        />
      )}
    </div>
  );
};
