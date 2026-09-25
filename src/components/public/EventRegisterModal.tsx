import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { dataService } from '../../services/dataService';
import { X, Calendar, MapPin, User, CheckCircle2 } from 'lucide-react';

export const EventRegisterModal: React.FC = () => {
  const { registeringEvent, setRegisteringEvent, activeStudent, role, showToast } = useApp();

  const [name, setName] = useState(role === 'student' && activeStudent ? activeStudent.name : '');
  const [email, setEmail] = useState(role === 'student' && activeStudent ? activeStudent.email : '');
  const [campusId, setCampusId] = useState(role === 'student' && activeStudent ? activeStudent.studentId : '');
  const [department, setDepartment] = useState(role === 'student' && activeStudent ? activeStudent.department : '');
  const [phone, setPhone] = useState(role === 'student' && activeStudent ? activeStudent.phone : '');
  const [submitted, setSubmitted] = useState(false);

  if (!registeringEvent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !campusId.trim()) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    const res = dataService.registerForEvent({
      eventId: registeringEvent.id,
      studentId: role === 'student' && activeStudent ? activeStudent.id : undefined,
      name: name.trim(),
      email: email.trim(),
      campusId: campusId.trim(),
      department: department.trim(),
      phone: phone.trim()
    });

    if (res.success) {
      setSubmitted(true);
      showToast(res.message, 'success');
      setTimeout(() => {
        setRegisteringEvent(null);
        setSubmitted(false);
      }, 1800);
    } else {
      showToast(res.message, 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Event Registration
            </span>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {registeringEvent.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {registeringEvent.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {registeringEvent.mode}
              </span>
            </div>
          </div>
          <button
            onClick={() => setRegisteringEvent(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Registration Successful!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              You are officially registered for {registeringEvent.name}. A confirmation pass has been saved to your student records.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Monisha K"
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={campusId}
                  onChange={(e) => setCampusId(e.target.value)}
                  placeholder="e.g. 24CSE032"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 font-mono focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98451 23456"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-900 flex items-start gap-2">
              <User className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Demonstration pass: In this version, registration is stored in local state and immediately reflected on your dashboard.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRegisteringEvent(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                Complete Registration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
