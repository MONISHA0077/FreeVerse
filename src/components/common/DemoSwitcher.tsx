import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Building, ShieldCheck, Globe, ChevronDown, Sparkles, UserPlus } from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const {
    role,
    setRole,
    students,
    activeStudentId,
    setActiveStudentId,
    clients,
    activeClientId,
    setActiveClientId,
    showToast,
    setShowAddStudentModal
  } = useApp();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-2 px-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Role Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-100 flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Demo Mode:
          </span>

          <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={() => {
                setRole('public');
                showToast('Switched to Public Website view', 'info');
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                role === 'public'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              Public Website
            </button>

            <button
              onClick={() => {
                setRole('student');
                showToast('Switched to Student Demo dashboard', 'info');
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              Student Demo
            </button>

            <button
              onClick={() => {
                setRole('client');
                showToast('Switched to Client Demo dashboard', 'info');
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                role === 'client'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building className="w-3 h-3" />
              Client Demo
            </button>

            <button
              onClick={() => {
                setRole('admin');
                showToast('Switched to Admin Demo console', 'info');
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Admin Demo
            </button>
          </div>
        </div>

        {/* Center / Right: Persona Selectors & Reset */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Active Persona dropdown when in Student or Client demo */}
          {role === 'student' && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-xs">Switch Student:</span>
                <div className="relative">
                  <select
                    value={activeStudentId}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        setShowAddStudentModal(true);
                        return;
                      }
                      setActiveStudentId(e.target.value);
                      const stu = students.find((s) => s.id === e.target.value);
                      showToast(`Logged in as demo student: ${stu?.name || 'Student'}`, 'info');
                    }}
                    className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md py-1 pl-2 pr-7 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.studentId}) - {s.role}
                      </option>
                    ))}
                    <option value="__add_new__" className="text-indigo-400 font-bold">
                      + Add New Student (Admin)...
                    </option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                </div>
              </div>

              {/* Admin Add Student Button */}
              <button
                type="button"
                onClick={() => setShowAddStudentModal(true)}
                className="px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1 shadow-xs"
                title="Admin: Enroll a new student to the platform"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Student (Admin)</span>
              </button>
            </div>
          )}

          {role === 'client' && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-xs">Switch Client:</span>
              <div className="relative">
                <select
                  value={activeClientId}
                  onChange={(e) => {
                    setActiveClientId(e.target.value);
                    const cl = clients.find((c) => c.id === e.target.value);
                    showToast(`Operating as demo client: ${cl?.company || cl?.name}`, 'info');
                  }}
                  className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md py-1 pl-2 pr-7 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} · {c.company}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
