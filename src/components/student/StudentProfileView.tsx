import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Availability } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  User, 
  GraduationCap, 
  Award, 
  Check, 
  Clock, 
  Plus, 
  X,
  Sparkles
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { activeStudent, showToast } = useApp();

  const [availability, setAvailability] = useState<Availability>(activeStudent?.availability || 'Available');
  const [roleTitle, setRoleTitle] = useState(activeStudent?.role || '');
  const [bio, setBio] = useState(activeStudent?.bio || '');
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>(activeStudent?.skills || []);

  if (!activeStudent) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateStudent(activeStudent.id, {
      availability,
      role: roleTitle.trim() || activeStudent.role,
      bio: bio.trim() || activeStudent.bio,
      skills: skillsList
    });

    showToast('Profile and availability settings updated!', 'success');
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!skillsList.includes(skillInput.trim())) {
      setSkillsList([...skillsList, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
        <img
          src={activeStudent.avatar}
          alt={activeStudent.name}
          referrerPolicy="no-referrer"
          className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-xs bg-slate-100"
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900">{activeStudent.name}</h2>
            <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-semibold">
              {activeStudent.studentId}
            </span>
            <StatusBadge status={activeStudent.availability} size="sm" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeStudent.department} &middot; {activeStudent.year}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Availability Switcher (Section 42 requirement) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Work Availability Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['Available', 'Busy', 'Not Available'] as Availability[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setAvailability(st)}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  availability === st
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{st}</span>
                {availability === st && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            When set to "Available", your card prominently appears on client search filters.
          </p>
        </div>

        {/* Professional Role Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Professional Title / Focus
          </label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Freelancer Bio &amp; Academic Summary
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Skills Tag Manager */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Skills &amp; Technologies
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
              placeholder="Add skill (e.g. Next.js, Docker, Kotlin)..."
              className="flex-1 text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-800 shadow-2xs"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Badges / Achievements (Section 41) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Badges Earned On Freeverse
          </label>
          <div className="flex flex-wrap gap-2">
            {activeStudent.badges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg"
              >
                <Award className="w-4 h-4 text-amber-600" />
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  );
};
