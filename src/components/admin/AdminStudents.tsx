import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { StatusBadge } from '../common/StatusBadge';
import { RatingStars } from '../common/RatingStars';
import { Student, StudentStatus } from '../../types';
import { AddStudentModal } from './AddStudentModal';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ShieldAlert, 
  GraduationCap,
  UserPlus,
  Trash2
} from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const { students, setViewingStudent, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = students.filter((s) => {
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleUpdateStatus = (id: string, status: StudentStatus) => {
    dataService.updateStudent(id, { status });
    showToast(`Student status updated to ${status}.`, 'success');
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove student "${name}" from Freeverse?`)) {
      dataService.deleteStudent(id);
      showToast(`Student "${name}" removed.`, 'info');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Enrolled Student Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit student identities, verify department enrollment, and manage account statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            Total: <strong className="text-slate-900">{students.length}</strong> students registered
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, ID (e.g. 24CSE032), or department..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-700"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Suspended">Suspended</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-3">Student ID</th>
              <th className="py-3 px-3">Department</th>
              <th className="py-3 px-3">Rating</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((stu) => (
              <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={stu.avatar}
                      alt={stu.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-lg object-cover bg-slate-200 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{stu.name}</span>
                      <span className="text-[11px] text-slate-500">{stu.role}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-700">{stu.studentId}</td>
                <td className="py-3 px-3 text-slate-600">{stu.department} &middot; {stu.year}</td>
                <td className="py-3 px-3">
                  <RatingStars rating={stu.rating} count={stu.ratingCount} size="sm" />
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={stu.status} size="sm" />
                </td>
                <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                  <button
                    onClick={() => setViewingStudent(stu)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md"
                  >
                    Inspect Profile
                  </button>

                  {stu.status !== 'Active' && (
                    <button
                      onClick={() => handleUpdateStatus(stu.id, 'Active')}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md"
                    >
                      Activate
                    </button>
                  )}

                  {stu.status === 'Active' && (
                    <button
                      onClick={() => handleUpdateStatus(stu.id, 'Suspended')}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md"
                    >
                      Suspend
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteStudent(stu.id, stu.name)}
                    title="Remove Student"
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && <AddStudentModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
