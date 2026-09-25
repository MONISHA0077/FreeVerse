import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { ExperienceLevel } from '../../types';
import { 
  PlusCircle, 
  DollarSign, 
  Calendar, 
  Clock, 
  Paperclip, 
  Save, 
  Send,
  X,
  CheckCircle2
} from 'lucide-react';

export const PostTask: React.FC = () => {
  const { activeClient, showToast, setClientTab } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'Tailwind CSS']);
  const [budget, setBudget] = useState<number>(450);
  const [deadline, setDeadline] = useState('2026-10-31');
  const [expectedDuration, setExpectedDuration] = useState('2 - 3 weeks');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Intermediate');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [attachmentName, setAttachmentName] = useState('Project_Specs.pdf');

  if (!activeClient) return null;

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (sk: string) => {
    setSkills(skills.filter((s) => s !== sk));
  };

  const handleSave = (publish: boolean) => {
    if (!title.trim() || !description.trim()) {
      showToast('Please provide a title and detailed description for your task.', 'warning');
      return;
    }

    if (skills.length === 0) {
      showToast('Please add at least one required skill tag.', 'warning');
      return;
    }

    const newTask = dataService.createTask({
      title: title.trim(),
      clientId: activeClient.id,
      description: description.trim(),
      category,
      requiredSkills: skills,
      budget: Number(budget),
      deadline,
      expectedDuration,
      experienceLevel,
      additionalRequirements: additionalRequirements.trim(),
      attachments: attachmentName ? [{ name: attachmentName, size: '1.8 MB' }] : [],
      status: publish ? 'Open' : 'Draft'
    });

    showToast(
      publish
        ? `Task "${newTask.title}" published! Students can now discover and apply for it.`
        : `Task saved as Draft.`,
      'success'
    );

    setClientTab('my-tasks');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
          Hiring &amp; Brief Creation
        </span>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Post a New Project Task</h2>
        <p className="text-xs text-slate-500 mt-1">
          Define deliverables, budget, and required technical skills to attract student freelancers.
        </p>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Modern Student Mentorship Portal Frontend (React + Tailwind)"
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category & Experience Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Web Development">Web Development</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="AI & Data Science">AI &amp; Data Science</option>
              <option value="Branding & Design">Branding &amp; Design</option>
              <option value="Content & Documentation">Content &amp; Documentation</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Experience Level <span className="text-rose-500">*</span>
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Beginner">Beginner (1st / 2nd Year Foundation)</option>
              <option value="Intermediate">Intermediate (Project Portfolio Proven)</option>
              <option value="Advanced">Advanced (Production Systems / Open Source)</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Project Description &amp; Scope <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem, key functional views, expected APIs, and design guidelines..."
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Required Technical Skills <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Type skill & press Add (e.g. Next.js, Figma, Python)..."
              className="flex-1 text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3.5 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
            >
              Add Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            {skills.map((sk) => (
              <span
                key={sk}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-800 shadow-2xs"
              >
                <span>{sk}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(sk)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Budget, Deadline, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Budget ($ USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="number"
                min={20}
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-slate-300 py-2 pl-8 pr-2.5 bg-white text-slate-900 font-mono focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Deadline <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expected Duration
            </label>
            <input
              type="text"
              value={expectedDuration}
              onChange={(e) => setExpectedDuration(e.target.value)}
              placeholder="e.g. 2 - 3 weeks"
              className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Additional Requirements & Deliverables */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Additional Requirements &amp; Acceptance Criteria
          </label>
          <input
            type="text"
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            placeholder="e.g. WCAG AAA compliance, clean commit history, unit tests included..."
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Attachments Demo */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Attachment Specification (Demo File)
          </label>
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              placeholder="e.g. Wireframes_and_Brand_Guide.pdf"
              className="flex-1 text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
            />
          </div>
        </div>

        {/* Buttons (Section 20: Save Draft, Publish Task) */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Task (OPEN)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
