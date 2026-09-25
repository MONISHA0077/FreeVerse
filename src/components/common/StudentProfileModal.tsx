import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { RatingStars } from './RatingStars';
import { 
  X, 
  GraduationCap, 
  Briefcase, 
  Github, 
  Linkedin, 
  Globe, 
  Instagram, 
  ExternalLink, 
  Award, 
  Calendar,
  MessageSquare,
  Flag,
  UserPlus
} from 'lucide-react';

export const StudentProfileModal: React.FC = () => {
  const { 
    viewingStudent, 
    setViewingStudent, 
    reviews, 
    setReportingTarget, 
    role, 
    setRole, 
    setClientTab, 
    setActiveClientId, 
    showToast,
    setShowAddStudentModal
  } = useApp();

  if (!viewingStudent) return null;

  const studentReviews = reviews.filter((r) => r.targetId === viewingStudent.id);

  const handleContactStudent = () => {
    // If not already in client demo, switch to client demo so they can message / assign
    if (role !== 'client') {
      setRole('client');
      setActiveClientId('client-1');
    }
    setClientTab('messages');
    setViewingStudent(null);
    showToast(`Opened client messages to reach out to ${viewingStudent.name}`, 'info');
  };

  const handleReport = () => {
    setReportingTarget({
      type: 'student',
      id: viewingStudent.id,
      name: `${viewingStudent.name} (${viewingStudent.studentId})`
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={viewingStudent.avatar}
              alt={viewingStudent.name}
              referrerPolicy="no-referrer"
              className="w-18 h-18 rounded-xl object-cover border-2 border-white shadow-md bg-slate-200"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-xl font-bold text-slate-900">{viewingStudent.name}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-slate-200 text-slate-700 font-semibold">
                  {viewingStudent.studentId}
                </span>
                <StatusBadge status={viewingStudent.availability} />
              </div>
              <p className="text-sm font-semibold text-indigo-600 mb-1">{viewingStudent.role}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {viewingStudent.department} · {viewingStudent.year}
                </span>
                <span>·</span>
                <RatingStars rating={viewingStudent.rating} count={viewingStudent.ratingCount} />
                <span>·</span>
                <span className="font-medium text-slate-700">{viewingStudent.completedProjectsCount} projects done</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReport}
              title="Report Profile"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewingStudent(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* About */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{viewingStudent.bio}</p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Skills &amp; Technologies</h3>
            <div className="flex flex-wrap gap-1.5">
              {viewingStudent.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-md border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Badges & Achievements */}
          {viewingStudent.badges && viewingStudent.badges.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Badges &amp; Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {viewingStudent.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 rounded-md"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Projects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Portfolio Projects</h3>
              <span className="text-xs text-slate-500 font-medium">{viewingStudent.portfolio.length} Projects</span>
            </div>

            <div className="space-y-3">
              {viewingStudent.portfolio.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                    {proj.completedAt && (
                      <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3" />
                        {proj.completedAt}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">{proj.description}</p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map((tech) => (
                        <span key={tech} className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
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
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Social Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Education
              </h4>
              <p className="text-xs font-bold text-slate-900">{viewingStudent.education.college}</p>
              <p className="text-xs text-slate-600">{viewingStudent.education.course}</p>
              <p className="text-xs text-slate-500 mt-0.5">{viewingStudent.education.year}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                Social Profiles
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {viewingStudent.socialLinks.linkedin && (
                  <a
                    href={viewingStudent.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:text-blue-700"
                  >
                    <Linkedin className="w-3 h-3 text-blue-600" />
                    LinkedIn
                  </a>
                )}
                {viewingStudent.socialLinks.github && (
                  <a
                    href={viewingStudent.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:text-black"
                  >
                    <Github className="w-3 h-3 text-slate-800" />
                    GitHub
                  </a>
                )}
                {viewingStudent.socialLinks.website && (
                  <a
                    href={viewingStudent.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:text-indigo-600"
                  >
                    <Globe className="w-3 h-3 text-indigo-600" />
                    Website
                  </a>
                )}
                {viewingStudent.socialLinks.instagram && (
                  <a
                    href={viewingStudent.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:text-pink-600"
                  >
                    <Instagram className="w-3 h-3 text-pink-600" />
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Client Reviews Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Client Reviews &amp; Testimonials</h3>
            {studentReviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-200">
                No client reviews recorded yet. Completed project reviews will appear here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {studentReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900">{rev.authorName}</span>
                      <RatingStars rating={rev.rating} />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{rev.createdAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => setViewingStudent(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setViewingStudent(null);
                setShowAddStudentModal(true);
              }}
              className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5 border border-indigo-200 shadow-2xs"
              title="Admin: Enroll a new student"
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>+ Add Student (Admin)</span>
            </button>

            <button
              onClick={handleContactStudent}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message / Hire Student</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
