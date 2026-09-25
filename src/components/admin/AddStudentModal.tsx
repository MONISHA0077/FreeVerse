import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { Availability, StudentStatus } from '../../types';
import { UserPlus, X, Sparkles, Plus } from 'lucide-react';

interface AddStudentModalProps {
  onClose: () => void;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
];

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose }) => {
  const { showToast, students } = useApp();

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98451 98765');
  const [role, setRole] = useState('Full Stack Developer');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [year, setYear] = useState('3rd Year');
  const [skills, setSkills] = useState<string[]>(['React', 'JavaScript', 'Tailwind CSS', 'HTML']);
  const [skillInput, setSkillInput] = useState('');
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState<Availability>('Available');
  const [status, setStatus] = useState<StudentStatus>('Active');
  const [college, setCollege] = useState('Institute of Engineering & Technology');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const trimmed = skillInput.trim();
    if (!skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (sk: string) => {
    setSkills(skills.filter((s) => s !== sk));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !studentId.trim()) {
      showToast('Please enter both student name and student ID.', 'warning');
      return;
    }

    const cleanId = studentId.trim().toUpperCase();

    // Check duplicate student ID
    const exists = students.some((s) => s.studentId.toUpperCase() === cleanId);
    if (exists) {
      showToast(`Student ID "${cleanId}" is already registered.`, 'warning');
      return;
    }

    const newStudent = dataService.addStudent({
      studentId: cleanId,
      name: name.trim(),
      email: email.trim() || `${cleanId.toLowerCase()}@campus.edu`,
      phone: phone.trim(),
      role: role.trim() || 'Software Developer',
      bio: bio.trim() || `Enthusiastic ${year} ${department} student eager to contribute to real-world freelance projects and collaborative engineering solutions.`,
      avatar: DEFAULT_AVATARS[avatarIndex],
      department: department.trim(),
      year: year.trim(),
      skills: skills.length > 0 ? skills : ['HTML', 'CSS', 'JavaScript'],
      availability,
      rating: 5.0,
      ratingCount: 1,
      completedProjectsCount: 0,
      status,
      education: {
        college: college.trim(),
        department: department.trim(),
        course: course.trim(),
        year: '2023 - 2027'
      },
      portfolio: [
        {
          id: `port-init-${Date.now()}`,
          title: 'Campus Hackathon MVP & Prototype',
          description: 'Responsive interactive web application built during campus innovation sprint with clean state handling.',
          technologies: skills.slice(0, 3),
          imageColor: 'from-indigo-600 to-purple-700',
          completedAt: 'Recent'
        }
      ],
      socialLinks: {
        github: `https://github.com/${name.toLowerCase().replace(/\s+/g, '')}`,
        linkedin: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`
      },
      badges: ['First Project', 'Community Member']
    });

    showToast(`Student ${newStudent.name} (${cleanId}) successfully added to platform!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <UserPlus className="w-5 h-5" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New Student</h3>
              <p className="text-xs text-slate-500">Enroll student talent into Freeverse directory and dashboards</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Choose Student Avatar
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {DEFAULT_AVATARS.map((url, idx) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setAvatarIndex(idx)}
                  className={`relative p-0.5 rounded-xl transition-all shrink-0 ${
                    avatarIndex === idx ? 'ring-2 ring-indigo-600 scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={url}
                    alt="Avatar choice"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-lg object-cover bg-slate-100"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kavitha S"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student ID / Roll No <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 24CSE058"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 font-mono uppercase focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics &amp; Communication</option>
                <option value="Artificial Intelligence & Data Science">Artificial Intelligence &amp; Data Science</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Data Science & Analytics">Data Science &amp; Analytics</option>
                <option value="Business Administration & Management">Business Administration &amp; Management</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Year of Study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Professional Role / Specialization
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, UI/UX Designer"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Technical &amp; Creative Skills
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
                placeholder="Add skill (e.g. Next.js, Python, Figma) and press Enter or Add..."
                className="flex-1 text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 min-h-11">
              {skills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-800 shadow-2xs"
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

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bio &amp; Summary
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell clients about your background, favorite tech stack, and experience..."
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Availability & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as Availability)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900"
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StudentStatus)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900"
              >
                <option value="Active">Active (Approved)</option>
                <option value="Pending">Pending Verification</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
