/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoSwitcher } from './components/common/DemoSwitcher';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { StudentProfileModal } from './components/common/StudentProfileModal';
import { ReportModal } from './components/common/ReportModal';
import { TaskDetailsModal } from './components/student/TaskDetailsModal';
import { ApplyTaskModal } from './components/student/ApplyTaskModal';
import { EventRegisterModal } from './components/public/EventRegisterModal';
import { AddStudentModal } from './components/admin/AddStudentModal';
import { PublicView } from './views/PublicView';
import { StudentView } from './views/StudentView';
import { ClientView } from './views/ClientView';
import { AdminView } from './views/AdminView';

const MainAppContent: React.FC = () => {
  const { role, showAddStudentModal, setShowAddStudentModal } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Interactive Demonstration Switcher Bar */}
      <DemoSwitcher />

      {/* Top 3-Zone Navigation Bar */}
      <Navbar />

      {/* Active Role Module View */}
      <div className="flex-1 flex flex-col">
        {role === 'public' && <PublicView />}
        {role === 'student' && <StudentView />}
        {role === 'client' && <ClientView />}
        {role === 'admin' && <AdminView />}
      </div>

      {/* Global Interactive Modals */}
      <StudentProfileModal />
      <TaskDetailsModal />
      <ApplyTaskModal />
      <EventRegisterModal />
      <ReportModal />
      {showAddStudentModal && <AddStudentModal onClose={() => setShowAddStudentModal(false)} />}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
