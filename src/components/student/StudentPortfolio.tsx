import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { 
  FolderGit2, 
  PlusCircle, 
  Github, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const StudentPortfolio: React.FC = () => {
  const { activeStudent, projects, showToast } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  // New portfolio project form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techString, setTechString] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  if (!activeStudent) return null;

  // Completed Freeverse projects that could be added to portfolio
  const completedProjects = projects.filter(
    (p) => p.studentId === activeStudent.id && p.status === 'Completed'
  );

  const handleAddManualProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please provide a project title and description.', 'warning');
      return;
    }

    const technologies = techString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    dataService.addStudentPortfolioProject(activeStudent.id, {
      title: title.trim(),
      description: description.trim(),
      technologies: technologies.length > 0 ? technologies : ['React', 'JavaScript'],
      githubUrl: githubUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      imageColor: 'from-indigo-600 to-purple-700',
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setTechString('');
    setGithubUrl('');
    setLiveUrl('');
    showToast('Project added to your public portfolio!', 'success');
  };

  const handleAddCompletedToPortfolio = (proj: typeof completedProjects[0]) => {
    const alreadyInPortfolio = activeStudent.portfolio.some(
      (p) => p.title.toLowerCase() === proj.taskTitle.toLowerCase()
    );
    if (alreadyInPortfolio) {
      showToast('This project is already part of your showcase portfolio.', 'info');
      return;
    }

    dataService.addStudentPortfolioProject(activeStudent.id, {
      title: proj.taskTitle,
      description: `Commissioned Freeverse contract project completed with $${proj.budget} budget. Verified client delivery with ${proj.milestones.length} completed milestones.`,
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      liveUrl: proj.submissions[0]?.liveWebsiteUrl || undefined,
      githubUrl: proj.submissions[0]?.githubUrl || undefined,
      imageColor: 'from-emerald-600 to-teal-700',
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });

    showToast(`Added "${proj.taskTitle}" to your verified portfolio!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Showcase Portfolio</h2>
          <p className="text-xs text-slate-500 mt-1">
            Build your public credentials. Add independent open-source projects or completed Freeverse contracts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Custom Project</span>
        </button>
      </div>

      {/* Completed Freeverse Projects Ready to Add banner (Section 40 requirement) */}
      {completedProjects.length > 0 && (
        <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Completed Freeverse Contracts Ready For Showcase
            </h3>
          </div>
          <p className="text-xs text-emerald-700">
            Convert completed client work into verified portfolio case studies with one click:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {completedProjects.map((cp) => (
              <div
                key={cp.id}
                className="bg-white p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between gap-2 shadow-2xs"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{cp.taskTitle}</h4>
                  <span className="text-[11px] text-slate-500 font-mono">${cp.budget} stipend &middot; Completed</span>
                </div>
                <button
                  onClick={() => handleAddCompletedToPortfolio(cp)}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md shrink-0 flex items-center gap-1"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Add to Portfolio</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Portfolio Projects List */}
      <div className="space-y-4">
        {activeStudent.portfolio.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 transition-all shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                {proj.completedAt && (
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    Completed: {proj.completedAt}
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                Verified
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {proj.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap gap-1">
                {proj.technologies.map((t) => (
                  <span key={t} className="text-xs font-mono font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-700 hover:text-slate-900 flex items-center gap-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source Repository</span>
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Product Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD CUSTOM PORTFOLIO MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Portfolio Project</h3>
            <p className="text-xs text-slate-500">Showcase past work, hackathon submissions, or campus lab developments.</p>

            <form onSubmit={handleAddManualProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Campus Peer Tutoring Portal"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description &amp; Impact <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what the product solves, the system design, and key features..."
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={techString}
                  onChange={(e) => setTechString(e.target.value)}
                  placeholder="React, TypeScript, Node.js, Tailwind CSS"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://demo.app"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Save to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
