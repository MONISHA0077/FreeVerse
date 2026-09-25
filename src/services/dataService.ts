import {
  Student,
  Client,
  Task,
  Application,
  Project,
  Message,
  PlatformEvent,
  EventRegistration,
  GalleryItem,
  Review,
  NotificationItem,
  Report,
  Milestone,
  ProjectFile,
  ProjectSubmission
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_CLIENTS,
  INITIAL_TASKS,
  INITIAL_APPLICATIONS,
  INITIAL_PROJECTS,
  INITIAL_MESSAGES,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_GALLERY,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS
} from '../data/initialData';

const STORAGE_KEY = 'freeverse_state_v2';

interface AppDataState {
  students: Student[];
  clients: Client[];
  tasks: Task[];
  applications: Application[];
  projects: Project[];
  messages: Message[];
  events: PlatformEvent[];
  registrations: EventRegistration[];
  gallery: GalleryItem[];
  reviews: Review[];
  notifications: NotificationItem[];
  reports: Report[];
}

type Listener = () => void;

class DataService {
  private state: AppDataState;
  private listeners: Set<Listener> = new Set();
  private backendOnline: boolean = false;

  constructor() {
    this.state = this.loadState();
    this.syncWithBackend();
  }

  public isBackendOnline(): boolean {
    return this.backendOnline;
  }

  public async syncWithBackend(): Promise<void> {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const backendState = await res.json();
        if (backendState && Array.isArray(backendState.students)) {
          this.state = backendState;
          this.backendOnline = true;
          this.saveLocalOnly();
          this.notify();
          console.log('[Freeverse] Synchronized with Express backend API.');
        }
      }
    } catch {
      this.backendOnline = false;
    }
  }

  private saveLocalOnly(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore quota errors
    }
  }

  public async postToBackend(endpoint: string, method: 'POST' | 'PUT' | 'DELETE' = 'POST', data?: unknown): Promise<void> {
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data !== undefined ? JSON.stringify(data) : undefined,
      });
      if (res.ok) {
        this.backendOnline = true;
      }
    } catch (err) {
      console.warn(`[Backend Offline Fallback] ${method} ${endpoint}:`, err);
    }
  }

  private loadState(): AppDataState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all categories have events if loaded from older storage
        if (parsed.events) {
          const existingEventIds = new Set(parsed.events.map((e: PlatformEvent) => e.id));
          const missingEvents = INITIAL_EVENTS.filter((e) => !existingEventIds.has(e.id));
          if (missingEvents.length > 0) {
            parsed.events = [...parsed.events, ...missingEvents];
          }
        }
        return parsed;
      }
    } catch {
      // LocalStorage unavailable or parse error
    }
    return {
      students: [...INITIAL_STUDENTS],
      clients: [...INITIAL_CLIENTS],
      tasks: [...INITIAL_TASKS],
      applications: [...INITIAL_APPLICATIONS],
      projects: [...INITIAL_PROJECTS],
      messages: [...INITIAL_MESSAGES],
      events: [...INITIAL_EVENTS],
      registrations: [...INITIAL_REGISTRATIONS],
      gallery: [...INITIAL_GALLERY],
      reviews: [...INITIAL_REVIEWS],
      notifications: [...INITIAL_NOTIFICATIONS],
      reports: [...INITIAL_REPORTS]
    };
  }

  private saveState(): void {
    this.saveLocalOnly();
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  public resetDemoData(): void {
    this.state = {
      students: [...INITIAL_STUDENTS],
      clients: [...INITIAL_CLIENTS],
      tasks: [...INITIAL_TASKS],
      applications: [...INITIAL_APPLICATIONS],
      projects: [...INITIAL_PROJECTS],
      messages: [...INITIAL_MESSAGES],
      events: [...INITIAL_EVENTS],
      registrations: [...INITIAL_REGISTRATIONS],
      gallery: [...INITIAL_GALLERY],
      reviews: [...INITIAL_REVIEWS],
      notifications: [...INITIAL_NOTIFICATIONS],
      reports: [...INITIAL_REPORTS]
    };
    this.saveState();
    this.postToBackend('/api/reset', 'POST');
  }

  // --- Students ---
  public getStudents(): Student[] {
    return this.state.students;
  }

  public getStudentById(id: string): Student | undefined {
    return this.state.students.find((s) => s.id === id || s.studentId === id);
  }

  public updateStudent(id: string, updates: Partial<Student>): void {
    this.state.students = this.state.students.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    this.saveState();
    this.postToBackend(`/api/students/${id}`, 'PUT', updates);
  }

  public addStudent(studentData: Omit<Student, 'id' | 'joinedDate'> & { id?: string; joinedDate?: string }): Student {
    const newStudent: Student = {
      ...studentData,
      id: studentData.id || `stu-${Date.now()}`,
      joinedDate: studentData.joinedDate || new Date().toISOString().split('T')[0]
    };
    this.state.students = [newStudent, ...this.state.students];

    this.createNotification({
      recipientId: 'admin',
      title: 'New Student Enrolled',
      message: `Admin added student ${newStudent.name} (${newStudent.studentId}) - ${newStudent.role}.`,
      type: 'success'
    });

    this.saveState();
    this.postToBackend('/api/students', 'POST', newStudent);
    return newStudent;
  }

  public deleteStudent(id: string): void {
    this.state.students = this.state.students.filter((s) => s.id !== id);
    this.saveState();
    this.postToBackend(`/api/students/${id}`, 'DELETE');
  }

  public addStudentPortfolioProject(studentId: string, project: Omit<Student['portfolio'][0], 'id'>): void {
    const newPort = {
      ...project,
      id: `port-${Date.now()}`
    };
    this.state.students = this.state.students.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          portfolio: [newPort, ...s.portfolio]
        };
      }
      return s;
    });
    this.saveState();
  }

  // --- Clients ---
  public getClients(): Client[] {
    return this.state.clients;
  }

  public getClientById(id: string): Client | undefined {
    return this.state.clients.find((c) => c.id === id);
  }

  public updateClient(id: string, updates: Partial<Client>): void {
    this.state.clients = this.state.clients.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    this.saveState();
    this.postToBackend(`/api/clients/${id}`, 'PUT', updates);
  }

  // --- Tasks ---
  public getTasks(): Task[] {
    return this.state.tasks;
  }

  public getTaskById(id: string): Task | undefined {
    return this.state.tasks.find((t) => t.id === id);
  }

  public createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.state.tasks = [newTask, ...this.state.tasks];
    
    // Increment client task count
    this.state.clients = this.state.clients.map((c) =>
      c.id === taskData.clientId ? { ...c, totalTasksPosted: c.totalTasksPosted + 1 } : c
    );

    // Add admin notification
    this.createNotification({
      recipientId: 'admin',
      title: 'New Task Posted',
      message: `Task "${newTask.title}" was posted with a budget of $${newTask.budget}.`,
      type: 'info'
    });

    this.saveState();
    this.postToBackend('/api/tasks', 'POST', newTask);
    return newTask;
  }

  public updateTaskStatus(id: string, status: Task['status']): void {
    this.state.tasks = this.state.tasks.map((t) =>
      t.id === id ? { ...t, status } : t
    );
    this.saveState();
    this.postToBackend(`/api/tasks/${id}`, 'PUT', { status });
  }

  // --- Applications ---
  public getApplications(): Application[] {
    return this.state.applications;
  }

  public getApplicationsByTask(taskId: string): Application[] {
    return this.state.applications.filter((a) => a.taskId === taskId);
  }

  public getApplicationsByStudent(studentId: string): Application[] {
    return this.state.applications.filter((a) => a.studentId === studentId);
  }

  public submitApplication(appData: Omit<Application, 'id' | 'appliedDate' | 'status'>): { success: boolean; message: string; application?: Application } {
    // Check for duplicate application
    const existing = this.state.applications.find(
      (a) => a.taskId === appData.taskId && a.studentId === appData.studentId
    );
    if (existing) {
      return { success: false, message: 'You have already applied for this task.' };
    }

    const task = this.getTaskById(appData.taskId);
    if (!task) {
      return { success: false, message: 'Task not found.' };
    }

    const student = this.getStudentById(appData.studentId);

    const newApp: Application = {
      ...appData,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    this.state.applications = [newApp, ...this.state.applications];

    // Notify client
    this.createNotification({
      recipientId: task.clientId,
      title: 'New Application Received',
      message: `${student?.name || 'A student'} applied for "${task.title}".`,
      type: 'info'
    });

    this.saveState();
    this.postToBackend('/api/applications', 'POST', newApp);
    return { success: true, message: 'Application submitted successfully!', application: newApp };
  }

  public shortlistApplication(applicationId: string): void {
    this.state.applications = this.state.applications.map((a) =>
      a.id === applicationId ? { ...a, status: 'Shortlisted' } : a
    );
    
    const app = this.state.applications.find((a) => a.id === applicationId);
    if (app) {
      const task = this.getTaskById(app.taskId);
      this.createNotification({
        recipientId: app.studentId,
        title: 'Application Shortlisted',
        message: `Your application for "${task?.title || 'a task'}" has been shortlisted!`,
        type: 'success'
      });
    }
    this.saveState();
    this.postToBackend(`/api/applications/${applicationId}`, 'PUT', { status: 'Shortlisted' });
  }

  /**
   * Accept a student:
   * 1. Updates application to 'Accepted'
   * 2. Sets task status to 'In Progress' and sets selectedStudentId
   * 3. Creates a new Project in 'Awaiting Start'
   * 4. Sends in-app notification to student
   * 5. Returns the remaining other applicants on this task so the client can trigger bulk/individual rejection
   */
  public acceptStudent(applicationId: string): { project: Project; otherApplicantIds: string[] } {
    const targetApp = this.state.applications.find((a) => a.id === applicationId);
    if (!targetApp) throw new Error('Application not found');

    const task = this.getTaskById(targetApp.taskId);
    if (!task) throw new Error('Task not found');

    const student = this.getStudentById(targetApp.studentId);
    const client = this.getClientById(task.clientId);

    // Update this application
    this.state.applications = this.state.applications.map((a) =>
      a.id === applicationId ? { ...a, status: 'Accepted' } : a
    );

    // Update task
    this.state.tasks = this.state.tasks.map((t) =>
      t.id === task.id ? { ...t, status: 'In Progress', selectedStudentId: targetApp.studentId } : t
    );

    this.postToBackend(`/api/applications/${applicationId}`, 'PUT', { status: 'Accepted' });
    this.postToBackend(`/api/tasks/${task.id}`, 'PUT', { status: 'In Progress', selectedStudentId: targetApp.studentId });

    // Create automatic project
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      clientId: task.clientId,
      studentId: targetApp.studentId,
      budget: targetApp.proposedAmount || task.budget,
      startDate: new Date().toISOString().split('T')[0],
      deadline: task.deadline,
      status: 'Awaiting Start',
      progress: 0,
      milestones: [
        {
          id: `ms-${Date.now()}-1`,
          title: 'Project Kickoff & Architecture Plan',
          description: 'Confirm specs, component boundaries, and milestones.',
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          status: 'Pending'
        },
        {
          id: `ms-${Date.now()}-2`,
          title: 'Core Implementation & First Draft',
          description: 'Deliver core screens and functional views.',
          dueDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
          status: 'Pending'
        },
        {
          id: `ms-${Date.now()}-3`,
          title: 'Final Polish, Testing & Handover',
          description: 'Refine responsive layouts, handle edge cases, and complete final deliverables.',
          dueDate: task.deadline,
          status: 'Pending'
        }
      ],
      files: [
        {
          id: `file-${Date.now()}`,
          name: 'Project_Requirements_Brief.pdf',
          size: '1.4 MB',
          fileType: 'PDF Document',
          uploadedBy: 'client',
          uploadedByName: client?.name || 'Client',
          uploadedDate: new Date().toISOString().split('T')[0]
        }
      ],
      submissions: [],
      activities: [
        {
          id: `act-${Date.now()}-1`,
          action: 'Project Created',
          description: `${client?.name || 'Client'} accepted ${student?.name || 'Student'} for "${task.title}".`,
          timestamp: new Date().toLocaleString(),
          actor: client?.name || 'Client'
        },
        {
          id: `act-${Date.now()}-2`,
          action: 'Workspace Initialized',
          description: 'Private project workspace created with initial milestones and file attachments.',
          timestamp: new Date().toLocaleString(),
          actor: 'System'
        }
      ]
    };

    this.state.projects = [newProject, ...this.state.projects];

    // Notify accepted student
    this.createNotification({
      recipientId: targetApp.studentId,
      title: 'Congratulations! Application Accepted',
      message: `${client?.name || 'The client'} has accepted your application for "${task.title}". Your project workspace is ready!`,
      type: 'success'
    });

    // Notify admin
    this.createNotification({
      recipientId: 'admin',
      title: 'Project Started',
      message: `New project "${task.title}" started between ${student?.name} and ${client?.company || client?.name}.`,
      type: 'info'
    });

    // Find other applicants for this task
    const otherApplicantIds = this.state.applications
      .filter((a) => a.taskId === task.id && a.id !== applicationId && a.status !== 'Accepted')
      .map((a) => a.id);

    this.saveState();
    return { project: newProject, otherApplicantIds };
  }

  /**
   * Bulk Rejection Feature:
   * Rejects all non-selected applicants on a task and delivers a customized rejection message to each one.
   * Crucially: The selected student is NEVER included in the rejection list!
   */
  public bulkRejectApplicants(
    taskId: string,
    customMessage: string,
    excludeStudentId: string
  ): number {
    const task = this.getTaskById(taskId);
    let rejectedCount = 0;

    this.state.applications = this.state.applications.map((app) => {
      if (app.taskId === taskId && app.studentId !== excludeStudentId && app.status !== 'Accepted') {
        rejectedCount++;
        // Send individual rejection notification
        this.createNotification({
          recipientId: app.studentId,
          title: `Update on "${task?.title || 'Task'}"`,
          message: customMessage,
          type: 'warning'
        });

        // Also record a direct message to that student
        const student = this.getStudentById(app.studentId);
        const client = task ? this.getClientById(task.clientId) : undefined;
        if (client && student) {
          const convId = `conv-${client.id}-${student.id}`;
          this.state.messages.push({
            id: `msg-${Date.now()}-${rejectedCount}`,
            conversationId: convId,
            senderId: client.id,
            senderName: client.name,
            senderRole: 'client',
            recipientId: student.id,
            recipientName: student.name,
            text: customMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today',
            read: false
          });
        }

        return {
          ...app,
          status: 'Rejected',
          rejectionReason: customMessage
        };
      }
      return app;
    });

    this.saveState();
    return rejectedCount;
  }

  public rejectIndividualApplicant(applicationId: string, rejectionMessage: string): void {
    const app = this.state.applications.find((a) => a.id === applicationId);
    if (!app) return;

    const task = this.getTaskById(app.taskId);
    const client = task ? this.getClientById(task.clientId) : undefined;
    const student = this.getStudentById(app.studentId);

    this.state.applications = this.state.applications.map((a) =>
      a.id === applicationId
        ? { ...a, status: 'Rejected', rejectionReason: rejectionMessage }
        : a
    );

    // Notify student
    this.createNotification({
      recipientId: app.studentId,
      title: `Application Update: ${task?.title || 'Task'}`,
      message: rejectionMessage,
      type: 'warning'
    });

    if (client && student) {
      this.sendMessage({
        senderId: client.id,
        senderName: client.name,
        senderRole: 'client',
        recipientId: student.id,
        recipientName: student.name,
        text: rejectionMessage
      });
    }

    this.saveState();
  }

  // --- Projects ---
  public getProjects(): Project[] {
    return this.state.projects;
  }

  public getProjectById(id: string): Project | undefined {
    return this.state.projects.find((p) => p.id === id);
  }

  public getProjectsByStudent(studentId: string): Project[] {
    return this.state.projects.filter((p) => p.studentId === studentId);
  }

  public getProjectsByClient(clientId: string): Project[] {
    return this.state.projects.filter((p) => p.clientId === clientId);
  }

  public updateProjectStatus(projectId: string, status: Project['status']): void {
    this.state.projects = this.state.projects.map((p) =>
      p.id === projectId ? { ...p, status } : p
    );
    this.saveState();
  }

  public addProjectMilestone(projectId: string, milestone: Omit<Milestone, 'id' | 'status'>): void {
    const newMs: Milestone = {
      ...milestone,
      id: `ms-${Date.now()}`,
      status: 'Pending'
    };
    this.state.projects = this.state.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          milestones: [...p.milestones, newMs],
          activities: [
            {
              id: `act-${Date.now()}`,
              action: 'Milestone Added',
              description: `New milestone added: "${newMs.title}".`,
              timestamp: new Date().toLocaleString(),
              actor: 'Project Team'
            },
            ...p.activities
          ]
        };
      }
      return p;
    });
    this.saveState();
  }

  public updateMilestoneStatus(projectId: string, milestoneId: string, status: Milestone['status']): void {
    this.state.projects = this.state.projects.map((p) => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map((m) =>
          m.id === milestoneId ? { ...m, status } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.status === 'Completed').length;
        const progress = updatedMilestones.length > 0
          ? Math.round((completedCount / updatedMilestones.length) * 100)
          : p.progress;

        const ms = p.milestones.find((m) => m.id === milestoneId);
        return {
          ...p,
          milestones: updatedMilestones,
          progress,
          status: p.status === 'Awaiting Start' ? 'In Progress' : p.status,
          activities: [
            {
              id: `act-${Date.now()}`,
              action: 'Milestone Updated',
              description: `Milestone "${ms?.title || ''}" marked as ${status}.`,
              timestamp: new Date().toLocaleString(),
              actor: 'Project Team'
            },
            ...p.activities
          ]
        };
      }
      return p;
    });
    this.saveState();
  }

  public addProjectFile(projectId: string, file: Omit<ProjectFile, 'id' | 'uploadedDate'>): void {
    const newFile: ProjectFile = {
      ...file,
      id: `file-${Date.now()}`,
      uploadedDate: new Date().toISOString().split('T')[0]
    };
    this.state.projects = this.state.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          files: [newFile, ...p.files],
          activities: [
            {
              id: `act-${Date.now()}`,
              action: 'File Uploaded',
              description: `${file.uploadedByName} uploaded "${file.name}" (${file.size}).`,
              timestamp: new Date().toLocaleString(),
              actor: file.uploadedByName
            },
            ...p.activities
          ]
        };
      }
      return p;
    });
    this.saveState();
  }

  public submitProjectWork(
    projectId: string,
    submissionData: {
      submissionMessage: string;
      projectUrl?: string;
      githubUrl?: string;
      liveWebsiteUrl?: string;
      files?: { name: string; size: string }[];
    }
  ): void {
    const project = this.getProjectById(projectId);
    if (!project) return;

    const student = this.getStudentById(project.studentId);
    const newSubmission: ProjectSubmission = {
      id: `sub-${Date.now()}`,
      submissionMessage: submissionData.submissionMessage,
      projectUrl: submissionData.projectUrl,
      githubUrl: submissionData.githubUrl,
      liveWebsiteUrl: submissionData.liveWebsiteUrl,
      files: submissionData.files || [],
      submittedAt: new Date().toISOString().split('T')[0],
      version: project.submissions.length + 1,
      status: 'Pending Review'
    };

    this.state.projects = this.state.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'Submitted',
          submissions: [newSubmission, ...p.submissions],
          activities: [
            {
              id: `act-${Date.now()}`,
              action: 'Submission Uploaded',
              description: `${student?.name || 'Student'} submitted Version ${newSubmission.version} for client review.`,
              timestamp: new Date().toLocaleString(),
              actor: student?.name || 'Student'
            },
            ...p.activities
          ]
        };
      }
      return p;
    });

    // Notify client
    this.createNotification({
      recipientId: project.clientId,
      title: 'Project Submission Ready for Review',
      message: `${student?.name || 'Student'} submitted deliverables for "${project.taskTitle}".`,
      type: 'info'
    });

    this.saveState();
  }

  public requestRevision(projectId: string, revisionFeedback: string): void {
    const project = this.getProjectById(projectId);
    if (!project) return;
    const client = this.getClientById(project.clientId);

    this.state.projects = this.state.projects.map((p) => {
      if (p.id === projectId) {
        const updatedSubs = p.submissions.map((sub, idx) =>
          idx === 0 ? { ...sub, status: 'Revision Requested' as const, revisionFeedback } : sub
        );
        return {
          ...p,
          status: 'Revision Requested',
          submissions: updatedSubs,
          activities: [
            {
              id: `act-${Date.now()}`,
              action: 'Revision Requested',
              description: `${client?.name || 'Client'} requested revisions: "${revisionFeedback}"`,
              timestamp: new Date().toLocaleString(),
              actor: client?.name || 'Client'
            },
            ...p.activities
          ]
        };
      }
      return p;
    });

    // Notify student
    this.createNotification({
      recipientId: project.studentId,
      title: 'Revision Requested on Project',
      message: `${client?.name || 'Client'} has requested updates on "${project.taskTitle}": ${revisionFeedback}`,
      type: 'warning'
    });

    this.saveState();
  }

  public acceptProjectSubmission(projectId: string): void {
    const project = this.getProjectById(projectId);
    if (!project) return;
    const client = this.getClientById(project.clientId);
    const student = this.getStudentById(project.studentId);

    this.state.projects = this.state.projects.map((p) => {
      if (p.id === projectId) {
        const updatedSubs = p.submissions.map((sub, idx) =>
          idx === 0 ? { ...sub, status: 'Accepted' as const } : sub
        );
        return {
          ...p,
          status: 'Completed',
          progress: 100,
          submissions: updatedSubs,
          activities: [
            {
              id: `act-${Date.now()}`,
              action: 'Project Completed',
              description: `${client?.name || 'Client'} accepted the final deliverables and marked the project as Completed!`,
              timestamp: new Date().toLocaleString(),
              actor: client?.name || 'Client'
            },
            ...p.activities
          ]
        };
      }
      return p;
    });

    // Update student's completed count
    if (student) {
      this.updateStudent(student.id, {
        completedProjectsCount: (student.completedProjectsCount || 0) + 1
      });
    }

    // Update task status to Completed
    this.updateTaskStatus(project.taskId, 'Completed');

    // Notify student
    this.createNotification({
      recipientId: project.studentId,
      title: 'Project Completed Successfully!',
      message: `${client?.name || 'Client'} approved your final work on "${project.taskTitle}". You can now leave a review and add it to your portfolio!`,
      type: 'success'
    });

    this.saveState();
  }

  // --- Reviews ---
  public getReviews(): Review[] {
    return this.state.reviews;
  }

  public getReviewsForUser(userId: string): Review[] {
    return this.state.reviews.filter((r) => r.targetId === userId);
  }

  public submitReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.state.reviews = [newRev, ...this.state.reviews];

    // Mark project as reviewed
    this.state.projects = this.state.projects.map((p) => {
      if (p.id === reviewData.projectId) {
        return reviewData.authorRole === 'client'
          ? { ...p, clientReviewed: true }
          : { ...p, studentReviewed: true };
      }
      return p;
    });

    // Recalculate target's average rating dynamically
    if (reviewData.authorRole === 'client') {
      // Reviewing a student
      const student = this.getStudentById(reviewData.targetId);
      if (student) {
        const studentReviews = this.state.reviews.filter((r) => r.targetId === student.id);
        const avg = studentReviews.reduce((sum, r) => sum + r.rating, 0) / studentReviews.length;
        this.updateStudent(student.id, {
          rating: Number(avg.toFixed(1)),
          ratingCount: studentReviews.length
        });
      }
    } else {
      // Reviewing a client
      const client = this.getClientById(reviewData.targetId);
      if (client) {
        const clientReviews = this.state.reviews.filter((r) => r.targetId === client.id);
        const avg = clientReviews.reduce((sum, r) => sum + r.rating, 0) / clientReviews.length;
        this.updateClient(client.id, {
          rating: Number(avg.toFixed(1)),
          ratingCount: clientReviews.length
        });
      }
    }

    // Add activity to project
    this.state.projects = this.state.projects.map((p) => {
      if (p.id === reviewData.projectId) {
        return {
          ...p,
          activities: [
            {
              id: `act-${Date.now()}`,
              action: 'Review Added',
              description: `${reviewData.authorName} left a ${reviewData.rating}-star review: "${reviewData.comment.slice(0, 60)}..."`,
              timestamp: new Date().toLocaleString(),
              actor: reviewData.authorName
            },
            ...p.activities
          ]
        };
      }
      return p;
    });

    this.createNotification({
      recipientId: reviewData.targetId,
      title: 'New Review Received',
      message: `${reviewData.authorName} left you a ${reviewData.rating}-star review!`,
      type: 'success'
    });

    this.saveState();
    this.postToBackend('/api/reviews', 'POST', newRev);
    return newRev;
  }

  // --- Messages ---
  public getMessages(): Message[] {
    return this.state.messages;
  }

  public getMessagesForUser(userId: string): Message[] {
    return this.state.messages.filter((m) => m.senderId === userId || m.recipientId === userId);
  }

  public getConversation(user1Id: string, user2Id: string): Message[] {
    return this.state.messages.filter(
      (m) =>
        (m.senderId === user1Id && m.recipientId === user2Id) ||
        (m.senderId === user2Id && m.recipientId === user1Id)
    );
  }

  public sendMessage(msg: {
    senderId: string;
    senderName: string;
    senderRole: 'student' | 'client' | 'admin';
    recipientId: string;
    recipientName: string;
    text: string;
    projectId?: string;
  }): Message {
    const convId = [msg.senderId, msg.recipientId].sort().join('--');
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderRole: msg.senderRole,
      recipientId: msg.recipientId,
      recipientName: msg.recipientName,
      text: msg.text,
      projectId: msg.projectId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    this.state.messages = [...this.state.messages, newMsg];

    // Notification
    this.createNotification({
      recipientId: msg.recipientId,
      title: `New message from ${msg.senderName}`,
      message: msg.text.length > 60 ? `${msg.text.slice(0, 60)}...` : msg.text,
      type: 'info'
    });

    this.saveState();
    this.postToBackend('/api/messages', 'POST', newMsg);
    return newMsg;
  }

  // --- Events ---
  public getEvents(): PlatformEvent[] {
    return this.state.events;
  }

  public getEventById(id: string): PlatformEvent | undefined {
    return this.state.events.find((e) => e.id === id);
  }

  public createEvent(eventData: Omit<PlatformEvent, 'id'>): PlatformEvent {
    const newEvent: PlatformEvent = {
      ...eventData,
      id: `evt-${Date.now()}`
    };
    this.state.events = [newEvent, ...this.state.events];

    this.createNotification({
      recipientId: 'admin',
      title: 'New Event Created',
      message: `Event "${newEvent.name}" was scheduled for ${newEvent.date}.`,
      type: 'info'
    });

    this.saveState();
    this.postToBackend('/api/events', 'POST', newEvent);
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<PlatformEvent>): void {
    this.state.events = this.state.events.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    this.saveState();
    this.postToBackend(`/api/events/${id}`, 'PUT', updates);
  }

  public registerForEvent(regData: Omit<EventRegistration, 'id' | 'registeredAt'>): { success: boolean; message: string } {
    // Check if already registered by email or student ID
    const existing = this.state.registrations.find(
      (r) =>
        r.eventId === regData.eventId &&
        (r.email.toLowerCase() === regData.email.toLowerCase() ||
         (regData.studentId && r.studentId === regData.studentId))
    );
    if (existing) {
      return { success: false, message: 'You are already registered for this event!' };
    }

    const newReg: EventRegistration = {
      ...regData,
      id: `reg-${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0]
    };
    this.state.registrations = [newReg, ...this.state.registrations];

    const evt = this.getEventById(regData.eventId);
    if (regData.studentId) {
      this.createNotification({
        recipientId: regData.studentId,
        title: 'Event Registration Confirmed!',
        message: `You have successfully registered for "${evt?.name || 'event'}".`,
        type: 'success'
      });
    }

    this.saveState();
    this.postToBackend(`/api/events/${regData.eventId}/register`, 'POST', regData);
    return { success: true, message: 'Registration confirmed!' };
  }

  public getEventRegistrations(eventId: string): EventRegistration[] {
    return this.state.registrations.filter((r) => r.eventId === eventId);
  }

  public getAllRegistrations(): EventRegistration[] {
    return this.state.registrations;
  }

  public isStudentRegisteredForEvent(eventId: string, studentId?: string, email?: string): boolean {
    return this.state.registrations.some(
      (r) => r.eventId === eventId && ((studentId && r.studentId === studentId) || (email && r.email.toLowerCase() === email.toLowerCase()))
    );
  }

  // --- Gallery ---
  public getGallery(): GalleryItem[] {
    return this.state.gallery;
  }

  public addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    this.state.gallery = [newItem, ...this.state.gallery];
    this.saveState();
    this.postToBackend('/api/gallery', 'POST', newItem);
    return newItem;
  }

  public deleteGalleryItem(id: string): void {
    this.state.gallery = this.state.gallery.filter((g) => g.id !== id);
    this.saveState();
  }

  // --- Notifications ---
  public getNotifications(recipientId: string): NotificationItem[] {
    return this.state.notifications.filter((n) => n.recipientId === recipientId);
  }

  public createNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today',
      read: false
    };
    this.state.notifications = [newNotif, ...this.state.notifications];
    this.saveState();
    return newNotif;
  }

  public markNotificationAsRead(id: string): void {
    this.state.notifications = this.state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveState();
  }

  public clearAllNotifications(recipientId: string): void {
    this.state.notifications = this.state.notifications.filter((n) => n.recipientId !== recipientId);
    this.saveState();
  }

  // --- Reports ---
  public getReports(): Report[] {
    return this.state.reports;
  }

  public submitReport(repData: Omit<Report, 'id' | 'createdAt' | 'status'>): Report {
    const newRep: Report = {
      ...repData,
      id: `rep-${Date.now()}`,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.state.reports = [newRep, ...this.state.reports];

    this.createNotification({
      recipientId: 'admin',
      title: 'New Content Report',
      message: `Report filed for ${repData.targetType}: ${repData.targetName} (${repData.reason}).`,
      type: 'alert'
    });

    this.saveState();
    this.postToBackend('/api/reports', 'POST', newRep);
    return newRep;
  }

  public updateReportStatus(id: string, status: Report['status'], adminNotes?: string): void {
    this.state.reports = this.state.reports.map((r) =>
      r.id === id ? { ...r, status, adminNotes: adminNotes || r.adminNotes } : r
    );
    this.saveState();
    this.postToBackend(`/api/reports/${id}`, 'PUT', { status, adminNotes });
  }

  // --- Public Contact Form ---
  public submitContactInquiry(inquiry: { name: string; email: string; category: string; message: string }): void {
    this.createNotification({
      recipientId: 'admin',
      title: 'New Public Contact Inquiry',
      message: `Inquiry from ${inquiry.name} (${inquiry.email}): ${inquiry.message.slice(0, 50)}...`,
      type: 'info'
    });
    this.saveState();
    this.postToBackend('/api/contact', 'POST', inquiry);
  }

  // --- Platform Statistics (Dynamic Calculation) ---
  public getPlatformStats() {
    const students = this.state.students;
    const clients = this.state.clients;
    const tasks = this.state.tasks;
    const applications = this.state.applications;
    const projects = this.state.projects;
    const events = this.state.events;
    const reports = this.state.reports;

    const completedProjects = projects.filter((p) => p.status === 'Completed').length;
    const activeProjects = projects.filter((p) => p.status === 'In Progress' || p.status === 'Awaiting Start' || p.status === 'Submitted' || p.status === 'Revision Requested').length;
    const activeTasks = tasks.filter((t) => t.status === 'Open').length;
    const pendingReports = reports.filter((r) => r.status === 'Open' || r.status === 'Under Review').length;

    // Skill distribution
    const skillCounts: Record<string, number> = {};
    students.forEach((s) => {
      s.skills.forEach((sk) => {
        skillCounts[sk] = (skillCounts[sk] || 0) + 1;
      });
    });
    tasks.forEach((t) => {
      t.requiredSkills.forEach((sk) => {
        skillCounts[sk] = (skillCounts[sk] || 0) + 1;
      });
    });

    const popularSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const totalVolume = projects.reduce((sum, p) => sum + p.budget, 0);

    return {
      totalStudents: students.length,
      activeStudents: students.filter((s) => s.status === 'Active').length,
      totalClients: clients.length,
      totalTasks: tasks.length,
      activeTasks,
      totalApplications: applications.length,
      totalProjects: projects.length,
      activeProjects,
      completedProjects,
      totalEvents: events.length,
      upcomingEvents: events.filter((e) => e.status === 'Upcoming').length,
      pendingReports,
      popularSkills,
      totalVolume
    };
  }
}

export const dataService = new DataService();
