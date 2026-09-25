import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  Wrench, 
  Search, 
  Send, 
  CheckCircle, 
  Laptop, 
  UploadCloud, 
  FolderGit2, 
  PlusCircle, 
  Inbox, 
  Eye, 
  Sparkles, 
  MessageSquare, 
  Kanban, 
  FileCheck2, 
  Trophy,
  ArrowRight
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<'student' | 'client'>('student');
  const { setRole, setClientTab, setStudentTab } = useApp();

  const studentSteps = [
    { title: 'Create Profile', desc: 'Highlight academic department, graduation year, and professional focus.', icon: UserCheck },
    { title: 'Add Skills', desc: 'Tag your technical stack, design tools, or writing abilities.', icon: Wrench },
    { title: 'Find Tasks', desc: 'Browse curated client tasks filtered by budget, skills, and timeline.', icon: Search },
    { title: 'Apply', desc: 'Submit a tailored proposal with your estimated delivery and rate.', icon: Send },
    { title: 'Get Selected', desc: 'Receive instant acceptance notification and private workspace invite.', icon: CheckCircle },
    { title: 'Work', desc: 'Collaborate with the client through milestones, project chat, and file sharing.', icon: Laptop },
    { title: 'Submit', desc: 'Hand over final code repositories, live links, and deliverables.', icon: UploadCloud },
    { title: 'Build Portfolio', desc: 'Earn verified reviews and add completed projects to your public profile.', icon: FolderGit2 }
  ];

  const clientSteps = [
    { title: 'Create Task', desc: 'Publish project specifications, requirements, budget, and deadline.', icon: PlusCircle },
    { title: 'Receive Applications', desc: 'Review proposals from qualified student freelancers.', icon: Inbox },
    { title: 'View Students', desc: 'Inspect full student profiles, verified skills, and past project reviews.', icon: Eye },
    { title: 'Select Student', desc: 'Accept the ideal student with one click and send bulk updates to others.', icon: Sparkles },
    { title: 'Chat', desc: 'Align on project scope, wireframes, and milestones in private workspace.', icon: MessageSquare },
    { title: 'Manage Project', desc: 'Track milestone progress and inspect shared files.', icon: Kanban },
    { title: 'Receive Submission', desc: 'Review submitted work or request targeted revisions if needed.', icon: FileCheck2 },
    { title: 'Complete Project', desc: 'Approve final deliverables, leave an official review, and wrap up.', icon: Trophy }
  ];

  const currentSteps = activeFlow === 'student' ? studentSteps : clientSteps;

  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
            End-To-End Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            How Freeverse Works
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            A structured workflow connecting academic ambition with verified freelance output.
          </p>

          {/* Flow Toggle Tabs */}
          <div className="mt-6 inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveFlow('student')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeFlow === 'student'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Students (8 Steps)
            </button>
            <button
              onClick={() => setActiveFlow('client')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeFlow === 'client'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Clients (8 Steps)
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-200 transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      Step 0{idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA for current flow */}
        <div className="mt-12 text-center">
          {activeFlow === 'student' ? (
            <button
              onClick={() => {
                setRole('student');
                setStudentTab('find-tasks');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <span>Explore Student Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                setRole('client');
                setClientTab('post-task');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <span>Post a Project Task Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
