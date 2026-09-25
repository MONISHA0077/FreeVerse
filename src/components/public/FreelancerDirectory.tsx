import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { RatingStars } from '../common/RatingStars';
import { Student } from '../../types';
import { Search, Filter, GraduationCap, ArrowUpRight, X, UserPlus } from 'lucide-react';

export const FreelancerDirectory: React.FC = () => {
  const { students, setViewingStudent, setShowAddStudentModal } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [minRating, setMinRating] = useState<number>(0);

  // Extract all distinct filter options from current students
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.skills.forEach((sk) => set.add(sk)));
    return Array.from(set).sort();
  }, [students]);

  const allRoles = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.role))).sort();
  }, [students]);

  const allDepartments = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.department))).sort();
  }, [students]);

  const allYears = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.year))).sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search query matches name, role, skill, or studentId
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesRole = student.role.toLowerCase().includes(q);
        const matchesId = student.studentId.toLowerCase().includes(q);
        const matchesSkill = student.skills.some((sk) => sk.toLowerCase().includes(q));
        if (!matchesName && !matchesRole && !matchesId && !matchesSkill) {
          return false;
        }
      }

      if (selectedSkill && !student.skills.includes(selectedSkill)) {
        return false;
      }

      if (selectedRole && student.role !== selectedRole) {
        return false;
      }

      if (selectedDepartment && student.department !== selectedDepartment) {
        return false;
      }

      if (selectedYear && student.year !== selectedYear) {
        return false;
      }

      if (selectedAvailability && student.availability !== selectedAvailability) {
        return false;
      }

      if (minRating > 0 && student.rating < minRating) {
        return false;
      }

      return true;
    });
  }, [
    students,
    search,
    selectedSkill,
    selectedRole,
    selectedDepartment,
    selectedYear,
    selectedAvailability,
    minRating
  ]);

  const hasActiveFilters = Boolean(
    search || selectedSkill || selectedRole || selectedDepartment || selectedYear || selectedAvailability || minRating > 0
  );

  const clearFilters = () => {
    setSearch('');
    setSelectedSkill('');
    setSelectedRole('');
    setSelectedDepartment('');
    setSelectedYear('');
    setSelectedAvailability('');
    setMinRating(0);
  };

  return (
    <section id="freelancers-section" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5 block">
              Verified Student Talent
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Freelancer Directory
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Browse top collegiate developers, designers, data analysts, and tech creators ready for client projects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredStudents.length}</span> of {students.length} students
            </div>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
              title="Admin: Enroll a new student into the platform"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Student (Admin)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 mb-8">
          {/* Top Search Line */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name, role, skill, or ID (e.g., Monisha, React, 24CSE032)..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-1 shrink-0 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Secondary Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-100 text-xs">
            {/* Skill */}
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Skills</option>
              {allSkills.map((sk) => (
                <option key={sk} value={sk}>{sk}</option>
              ))}
            </select>

            {/* Role */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Roles</option>
              {allRoles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {/* Department */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Departments</option>
              {allDepartments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Year */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Years</option>
              {allYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Availability */}
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Any Availability</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Not Available">Not Available</option>
            </select>

            {/* Minimum Rating */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5★ and above</option>
              <option value={4.8}>4.8★ and above</option>
              <option value={5.0}>5.0★ Perfect</option>
            </select>
          </div>
        </div>

        {/* Freelancers Cards Grid */}
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No student freelancers matched your filters</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try clearing one or more filters to view more profiles.</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student: Student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Photo + Name + Role + Availability */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {student.name}
                        </h3>
                        <StatusBadge status={student.availability} size="sm" />
                      </div>
                      <p className="text-xs font-semibold text-indigo-700 truncate">{student.role}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <GraduationCap className="w-3 h-3 shrink-0 text-slate-400" />
                        <span className="truncate">{student.department}</span>
                        <span>·</span>
                        <span className="shrink-0">{student.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {student.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {student.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {student.skills.length > 5 && (
                      <span className="px-1.5 py-0.5 text-[11px] text-slate-400">
                        +{student.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Rating, Projects Count & View Profile Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <RatingStars rating={student.rating} count={student.ratingCount} size="sm" />
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {student.completedProjectsCount} projects
                    </span>
                  </div>

                  <button
                    onClick={() => setViewingStudent(student)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
