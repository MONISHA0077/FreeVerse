import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { StatusBadge } from '../common/StatusBadge';
import { RatingStars } from '../common/RatingStars';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  Paperclip, 
  Send, 
  GitBranch, 
  ExternalLink, 
  PlusCircle, 
  FileText, 
  AlertCircle, 
  Star,
  History,
  Activity,
  MessageSquare
} from 'lucide-react';

interface StudentWorkspaceProps {
  projectId: string;
  onBack: () => void;
  viewerMode: 'student' | 'client';
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({
  projectId,
  onBack,
  viewerMode
}) => {
  const {
    projects,
    students,
    clients,
    activeStudent,
    activeClient,
    showToast
  } = useApp();

  const project = projects.find((p) => p.id === projectId);
  const [activeSection, setActiveSection] = useState<'overview' | 'milestones' | 'files' | 'messages' | 'submissions' | 'activity'>('overview');

  // Milestone creation form state
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [msTitle, setMsTitle] = useState('');
  const [msDesc, setMsDesc] = useState('');
  const [msDueDate, setMsDueDate] = useState('');

  // File upload form state
  const [showAddFile, setShowAddFile] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('PDF Document');

  // Submission form state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [subMessage, setSubMessage] = useState('');
  const [subGitUrl, setSubGitUrl] = useState('');
  const [subLiveUrl, setSubLiveUrl] = useState('');

  // Chat message state
  const [chatInput, setChatInput] = useState('');

  // Revision modal state (for client)
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('');

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!project) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Project not found or was removed.</p>
        <button onClick={onBack} className="mt-3 px-4 py-1.5 text-xs bg-slate-900 text-white rounded-md">
          Go Back
        </button>
      </div>
    );
  }

  const student = students.find((s) => s.id === project.studentId);
  const client = clients.find((c) => c.id === project.clientId);

  // Messages in this project
  const projectMessages = dataService.getMessages().filter((m) => m.projectId === project.id || (
    student && client && m.conversationId === [client.id, student.id].sort().join('--')
  ));

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (viewerMode === 'student' && student && client) {
      dataService.sendMessage({
        senderId: student.id,
        senderName: student.name,
        senderRole: 'student',
        recipientId: client.id,
        recipientName: client.name,
        text: chatInput.trim(),
        projectId: project.id
      });
    } else if (viewerMode === 'client' && client && student) {
      dataService.sendMessage({
        senderId: client.id,
        senderName: client.name,
        senderRole: 'client',
        recipientId: student.id,
        recipientName: student.name,
        text: chatInput.trim(),
        projectId: project.id
      });
    }

    setChatInput('');
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitle.trim()) return;

    dataService.addProjectMilestone(project.id, {
      title: msTitle.trim(),
      description: msDesc.trim(),
      dueDate: msDueDate || project.deadline
    });

    setMsTitle('');
    setMsDesc('');
    setShowAddMilestone(false);
    showToast('New milestone added successfully!', 'success');
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    const uploaderName = viewerMode === 'student' ? student?.name || 'Student' : client?.name || 'Client';

    dataService.addProjectFile(project.id, {
      name: fileName.trim(),
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      fileType,
      uploadedBy: viewerMode,
      uploadedByName: uploaderName
    });

    setFileName('');
    setShowAddFile(false);
    showToast('File uploaded to project workspace (Local Storage Demo)', 'success');
  };

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subMessage.trim()) {
      showToast('Please include a submission summary message.', 'warning');
      return;
    }

    dataService.submitProjectWork(project.id, {
      submissionMessage: subMessage.trim(),
      githubUrl: subGitUrl.trim() || undefined,
      liveWebsiteUrl: subLiveUrl.trim() || undefined,
      files: [{ name: 'Deliverable_Build_Package.zip', size: '3.4 MB' }]
    });

    setShowSubmitModal(false);
    setSubMessage('');
    showToast('Project deliverables submitted for client approval!', 'success');
  };

  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionFeedback.trim()) return;

    dataService.requestRevision(project.id, revisionFeedback.trim());
    setShowRevisionModal(false);
    setRevisionFeedback('');
    showToast('Revision request sent to student.', 'info');
  };

  const handleAcceptSubmission = () => {
    if (window.confirm('Accept final deliverables and mark this project as Completed?')) {
      dataService.acceptProjectSubmission(project.id);
      showToast('Project completed successfully!', 'success');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    if (viewerMode === 'client' && client && student) {
      dataService.submitReview({
        projectId: project.id,
        taskId: project.taskId,
        authorId: client.id,
        authorName: `${client.name} (${client.company})`,
        authorRole: 'client',
        targetId: student.id,
        targetName: student.name,
        rating: reviewRating,
        comment: reviewComment.trim()
      });
    } else if (viewerMode === 'student' && student && client) {
      dataService.submitReview({
        projectId: project.id,
        taskId: project.taskId,
        authorId: student.id,
        authorName: student.name,
        authorRole: 'student',
        targetId: client.id,
        targetName: `${client.name} (${client.company})`,
        rating: reviewRating,
        comment: reviewComment.trim()
      });
    }

    setShowReviewModal(false);
    setReviewComment('');
    showToast('Official review recorded and average ratings updated!', 'success');
  };

  const isReviewed = viewerMode === 'client' ? project.clientReviewed : project.studentReviewed;

  return (
    <div className="space-y-6">
      {/* Top Workspace Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects List</span>
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900">{project.taskTitle}</h1>
            <StatusBadge status={project.status} size="sm" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Collaborating: <strong className="text-slate-800">{student?.name}</strong> (Student) &amp; <strong className="text-slate-800">{client?.company || client?.name}</strong> (Client)
          </p>
        </div>

        {/* Action Controls based on status and viewer */}
        <div className="flex items-center gap-2 flex-wrap">
          {viewerMode === 'student' && project.status !== 'Completed' && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{project.status === 'Submitted' ? 'Update Submission' : 'Submit Project Work'}</span>
            </button>
          )}

          {viewerMode === 'client' && project.status === 'Submitted' && (
            <>
              <button
                onClick={() => setShowRevisionModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
              >
                Request Revision
              </button>
              <button
                onClick={handleAcceptSubmission}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accept &amp; Complete</span>
              </button>
            </>
          )}

          {project.status === 'Completed' && !isReviewed && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Leave Project Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeSection === 'overview'
              ? 'bg-white text-indigo-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSection('milestones')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'milestones'
              ? 'bg-white text-indigo-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Milestones</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-200 rounded-full">
            {project.milestones.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSection('files')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'files'
              ? 'bg-white text-indigo-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Files</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-200 rounded-full">
            {project.files.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSection('messages')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'messages'
              ? 'bg-white text-indigo-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Project Chat</span>
        </button>
        <button
          onClick={() => setActiveSection('submissions')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'submissions'
              ? 'bg-white text-indigo-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Submissions</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 bg-slate-200 rounded-full">
            {project.submissions.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSection('activity')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'activity'
              ? 'bg-white text-indigo-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Activity Log</span>
        </button>
      </div>

      {/* SECTION 1: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Contract Budget</span>
              <span className="text-2xl font-bold text-emerald-600 font-mono">${project.budget}</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Start Date</span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {project.startDate}
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Due Deadline</span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {project.deadline}
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Milestones Completed</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {project.milestones.filter((m) => m.status === 'Completed').length} / {project.milestones.length}
              </span>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Sprint Delivery Progress</span>
              <span className="font-mono font-bold text-indigo-600 tabular-nums">{project.progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Parties Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Card */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-start gap-4">
              <img
                src={student?.avatar}
                alt={student?.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-100"
              />
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Student</span>
                <h4 className="text-base font-bold text-slate-900">{student?.name}</h4>
                <p className="text-xs text-indigo-600 font-medium">{student?.role}</p>
                <p className="text-xs text-slate-500 mt-1">{student?.department} · {student?.year}</p>
              </div>
            </div>

            {/* Client Card */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-start gap-4">
              <img
                src={client?.avatar}
                alt={client?.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-100"
              />
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Project Client</span>
                <h4 className="text-base font-bold text-slate-900">{client?.company || client?.name}</h4>
                <p className="text-xs text-slate-600 font-medium">{client?.name} · {client?.industry}</p>
                <p className="text-xs text-slate-500 mt-1">{client?.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MILESTONES */}
      {activeSection === 'milestones' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Milestones</h3>
              <p className="text-xs text-slate-500">Break deliverables into transparent phases and track completion.</p>
            </div>
            <button
              onClick={() => setShowAddMilestone(!showAddMilestone)}
              className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          {showAddMilestone && (
            <form onSubmit={handleAddMilestone} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">New Milestone</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={msTitle}
                    onChange={(e) => setMsTitle(e.target.value)}
                    placeholder="e.g. Design Tokens & Core Components"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={msDueDate}
                    onChange={(e) => setMsDueDate(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                <input
                  type="text"
                  value={msDesc}
                  onChange={(e) => setMsDesc(e.target.value)}
                  placeholder="Outline key expectations for this milestone phase..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddMilestone(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {project.milestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-400">0{idx + 1}.</span>
                    <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                    <StatusBadge status={m.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600">{m.description}</p>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Target Due: {m.dueDate}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {m.status !== 'Completed' ? (
                    <button
                      onClick={() => dataService.updateMilestoneStatus(project.id, m.id, 'Completed')}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark Complete</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => dataService.updateMilestoneStatus(project.id, m.id, 'In Progress')}
                      className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-800"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: FILES */}
      {activeSection === 'files' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Files &amp; Assets</h3>
              <p className="text-xs text-slate-500">Shared briefs, wireframes, and code packages stored locally.</p>
            </div>
            <button
              onClick={() => setShowAddFile(!showAddFile)}
              className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attach File Demo</span>
            </button>
          </div>

          {showAddFile && (
            <form onSubmit={handleAddFile} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Attach Document</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">File Name</label>
                  <input
                    type="text"
                    required
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. Sprint_Deliverable_v1.zip"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">File Type</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
                  >
                    <option value="PDF Document">PDF Document</option>
                    <option value="ZIP Archive">ZIP Code Archive</option>
                    <option value="Figma Export">Figma Design Export</option>
                    <option value="PNG Image">PNG Screenshot</option>
                    <option value="JSON Data">JSON Data Schema</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddFile(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Upload File
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">File Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Uploaded By</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.files.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{f.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{f.fileType}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{f.size}</td>
                    <td className="py-3 px-3 text-slate-700">{f.uploadedByName}</td>
                    <td className="py-3 px-3 text-slate-500">{f.uploadedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: PROJECT CHAT */}
      {activeSection === 'messages' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Workspace Private Chat</h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Only {student?.name} &amp; {client?.company || client?.name}
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {projectMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs italic">
                No messages yet. Send a kickoff message below to collaborate directly!
              </div>
            ) : (
              projectMessages.map((msg) => {
                const isMe = viewerMode === msg.senderRole;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-slate-600">{msg.senderName}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div
                      className={`max-w-md p-3 rounded-xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Write a message to ${viewerMode === 'student' ? client?.name : student?.name}...`}
              className="flex-1 text-xs rounded-lg border border-slate-200 py-2.5 px-3.5 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* SECTION 5: SUBMISSIONS & REVISIONS */}
      {activeSection === 'submissions' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Deliverable Submissions</h3>
              <p className="text-xs text-slate-500">Official handover records, revision logs, and repository links.</p>
            </div>
            {viewerMode === 'student' && project.status !== 'Completed' && (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload New Submission</span>
              </button>
            )}
          </div>

          {project.submissions.length === 0 ? (
            <div className="p-10 text-center bg-slate-50 rounded-xl border border-slate-200">
              <UploadCloud className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-700">No submissions uploaded yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                When the student is ready to deliver milestone work, they will upload live demo links and files here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {project.submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700">
                        Version {sub.version}
                      </span>
                      <span className="text-xs text-slate-400">Submitted {sub.submittedAt}</span>
                    </div>
                    <StatusBadge status={sub.status} />
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {sub.submissionMessage}
                  </p>

                  {/* Links */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-1">
                    {sub.githubUrl && (
                      <a
                        href={sub.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
                      >
                        <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                        <span>GitHub Repository</span>
                      </a>
                    )}
                    {sub.liveWebsiteUrl && (
                      <a
                        href={sub.liveWebsiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo Preview</span>
                      </a>
                    )}
                  </div>

                  {/* Revision Feedback alert if requested */}
                  {sub.status === 'Revision Requested' && sub.revisionFeedback && (
                    <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Client Revision Feedback:</strong>
                        <span>{sub.revisionFeedback}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: ACTIVITY LOG */}
      {activeSection === 'activity' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Project Activity Timeline</h3>
            <p className="text-xs text-slate-500">Immutable audit log of all project events, approvals, and deliveries.</p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {project.activities.map((act) => (
              <div key={act.id} className="relative group">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{act.action}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">By {act.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Submit Project Deliverables</h3>
            <form onSubmit={handleSubmitWork} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submission Summary &amp; Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={subMessage}
                  onChange={(e) => setSubMessage(e.target.value)}
                  placeholder="Summarize what has been built, instructions to test, and key features..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GitHub / Source Code URL
                </label>
                <input
                  type="url"
                  value={subGitUrl}
                  onChange={(e) => setSubGitUrl(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Live Hosted Preview URL
                </label>
                <input
                  type="url"
                  value={subLiveUrl}
                  onChange={(e) => setSubLiveUrl(e.target.value)}
                  placeholder="https://my-project-preview.app"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Confirm &amp; Dispatch to Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVISION REQUEST MODAL (FOR CLIENT) */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Request Revision</h3>
            <p className="text-xs text-slate-500">Explain clearly what changes the student needs to address before completion.</p>
            <form onSubmit={handleRequestRevision} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Feedback &amp; Adjustment Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="e.g. Please fix the mobile menu break and update the button contrast ratio to match WCAG standards..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
                >
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEAVE REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Leave Official Project Review</h3>
            <p className="text-xs text-slate-500">
              Reviewing: <strong>{viewerMode === 'client' ? student?.name : client?.name}</strong>
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm text-slate-900 ml-2 font-mono">{reviewRating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Public Feedback &amp; Review Comment <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details on communication, quality of delivery, and professional attitude..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
