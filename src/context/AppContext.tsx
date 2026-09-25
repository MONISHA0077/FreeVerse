import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Student,
  Client,
  Task,
  Application,
  Project,
  Message,
  PlatformEvent,
  GalleryItem,
  Review,
  NotificationItem,
  Report,
  ReportTargetType
} from '../types';
import { dataService } from '../services/dataService';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeStudent: Student | undefined;
  activeClientId: string;
  setActiveClientId: (id: string) => void;
  activeClient: Client | undefined;
  
  // Navigation states
  publicSection: string;
  setPublicSection: (sec: string) => void;
  studentTab: string;
  setStudentTab: (tab: string) => void;
  clientTab: string;
  setClientTab: (tab: string) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;

  // Selected project for workspace
  activeWorkspaceProjectId: string | null;
  setActiveWorkspaceProjectId: (id: string | null) => void;

  // Modals & inspect targets
  viewingStudent: Student | null;
  setViewingStudent: (student: Student | null) => void;
  inspectTaskId: string | null;
  setInspectTaskId: (taskId: string | null) => void;
  applyingTaskId: string | null;
  setApplyingTaskId: (taskId: string | null) => void;
  registeringEvent: PlatformEvent | null;
  setRegisteringEvent: (evt: PlatformEvent | null) => void;
  reportingTarget: { type: ReportTargetType; id: string; name: string } | null;
  setReportingTarget: (target: { type: ReportTargetType; id: string; name: string } | null) => void;
  showAddStudentModal: boolean;
  setShowAddStudentModal: (show: boolean) => void;

  // Data sets (re-renders automatically on dataService mutation)
  students: Student[];
  clients: Client[];
  tasks: Task[];
  applications: Application[];
  projects: Project[];
  messages: Message[];
  events: PlatformEvent[];
  gallery: GalleryItem[];
  reviews: Review[];
  notifications: NotificationItem[];
  reports: Report[];
  stats: ReturnType<typeof dataService.getPlatformStats>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Actions
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('public');
  const [activeStudentId, setActiveStudentId] = useState<string>('stu-1'); // Monisha K
  const [activeClientId, setActiveClientId] = useState<string>('client-1'); // Sarah Jenkins (Apex EdTech)

  const [publicSection, setPublicSection] = useState<string>('home');
  const [studentTab, setStudentTab] = useState<string>('dashboard');
  const [clientTab, setClientTab] = useState<string>('dashboard');
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  const [activeWorkspaceProjectId, setActiveWorkspaceProjectId] = useState<string | null>(null);

  // Modals
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [inspectTaskId, setInspectTaskId] = useState<string | null>(null);
  const [applyingTaskId, setApplyingTaskId] = useState<string | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<PlatformEvent | null>(null);
  const [reportingTarget, setReportingTarget] = useState<{ type: ReportTargetType; id: string; name: string } | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);

  // Trigger state refresh on dataService changes
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = dataService.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const resetDemoData = () => {
    dataService.resetDemoData();
    showToast('Demo data reset to pristine default state.', 'info');
  };

  const students = dataService.getStudents();
  const clients = dataService.getClients();
  const tasks = dataService.getTasks();
  const applications = dataService.getApplications();
  const projects = dataService.getProjects();
  const messages = dataService.getMessages();
  const events = dataService.getEvents();
  const gallery = dataService.getGallery();
  const reviews = dataService.getReviews();
  const reports = dataService.getReports();
  const stats = dataService.getPlatformStats();

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const activeClient = clients.find((c) => c.id === activeClientId) || clients[0];

  // Notifications for current role
  let currentRecipientId = 'admin';
  if (role === 'student') currentRecipientId = activeStudentId;
  else if (role === 'client') currentRecipientId = activeClientId;
  const notifications = dataService.getNotifications(currentRecipientId);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeStudentId,
        setActiveStudentId,
        activeStudent,
        activeClientId,
        setActiveClientId,
        activeClient,
        publicSection,
        setPublicSection,
        studentTab,
        setStudentTab,
        clientTab,
        setClientTab,
        adminTab,
        setAdminTab,
        activeWorkspaceProjectId,
        setActiveWorkspaceProjectId,
        viewingStudent,
        setViewingStudent,
        inspectTaskId,
        setInspectTaskId,
        applyingTaskId,
        setApplyingTaskId,
        registeringEvent,
        setRegisteringEvent,
        reportingTarget,
        setReportingTarget,
        showAddStudentModal,
        setShowAddStudentModal,
        students,
        clients,
        tasks,
        applications,
        projects,
        messages,
        events,
        gallery,
        reviews,
        notifications,
        reports,
        stats,
        toasts,
        showToast,
        removeToast,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
