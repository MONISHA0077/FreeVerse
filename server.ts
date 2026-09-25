import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
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
} from './src/data/initialData.js';
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
  Report
} from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const DB_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DB_DIR, 'db.json');

interface DatabaseSchema {
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
  inquiries: Array<{
    id: string;
    name: string;
    email: string;
    category: string;
    message: string;
    createdAt: string;
  }>;
}

const getInitialData = (): DatabaseSchema => ({
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
  reports: [...INITIAL_REPORTS],
  inquiries: []
});

const loadDatabase = (): DatabaseSchema => {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.students)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading database file, initializing fallback:', err);
  }

  const initial = getInitialData();
  saveDatabase(initial);
  return initial;
};

const saveDatabase = (data: DatabaseSchema): void => {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
};

let db: DatabaseSchema = loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[Backend API] ${req.method} ${req.url}`);
    }
    next();
  });

  const apiRouter = express.Router();

  // Health and connection check
  apiRouter.get('/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'Freeverse Backend Core API',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      counts: {
        students: db.students.length,
        clients: db.clients.length,
        tasks: db.tasks.length,
        projects: db.projects.length,
        messages: db.messages.length
      }
    });
  });

  // Get complete application state
  apiRouter.get('/state', (req, res) => {
    res.json(db);
  });

  // Reset database back to default initial state
  apiRouter.post('/reset', (req, res) => {
    db = getInitialData();
    saveDatabase(db);
    res.json({ message: 'Database reset to initial demo state successfully', data: db });
  });

  // Dynamic calculated stats
  apiRouter.get('/stats', (req, res) => {
    const totalStudents = db.students.length;
    const activeStudents = db.students.filter((s) => s.status === 'Active').length;
    const totalClients = db.clients.length;
    const totalTasks = db.tasks.length;
    const activeTasks = db.tasks.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
    const totalProjects = db.projects.length;
    const activeProjects = db.projects.filter((p) => p.status === 'In Progress' || p.status === 'Awaiting Start' || p.status === 'Submitted').length;
    const completedProjects = db.projects.filter((p) => p.status === 'Completed').length;
    const totalReviews = db.reviews.length;
    const upcomingEvents = db.events.filter((e) => e.status === 'Upcoming').length;
    const totalApplications = db.applications.length;

    res.json({
      totalStudents,
      activeStudents,
      totalClients,
      totalTasks,
      activeTasks,
      totalProjects,
      activeProjects,
      completedProjects,
      totalReviews,
      upcomingEvents,
      totalApplications
    });
  });

  // ==================== STUDENTS ====================
  apiRouter.get('/students', (req, res) => {
    res.json(db.students);
  });

  apiRouter.get('/students/:id', (req, res) => {
    const stu = db.students.find((s) => s.id === req.params.id || s.studentId === req.params.id);
    if (!stu) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(stu);
  });

  apiRouter.post('/students', (req, res) => {
    const studentData = req.body;
    if (!studentData.name || !studentData.studentId) {
      return res.status(400).json({ error: 'Name and studentId are required' });
    }

    const cleanId = String(studentData.studentId).trim().toUpperCase();
    const exists = db.students.some((s) => s.studentId.toUpperCase() === cleanId);
    if (exists) {
      return res.status(409).json({ error: `Student with ID ${cleanId} already exists` });
    }

    const newStudent: Student = {
      id: studentData.id || `stu-${Date.now()}`,
      studentId: cleanId,
      name: studentData.name.trim(),
      email: studentData.email || `${cleanId.toLowerCase()}@campus.edu`,
      phone: studentData.phone || '+91 98451 98765',
      role: studentData.role || 'Software Developer',
      bio: studentData.bio || 'Passionate student eager to collaborate and contribute to freelance projects.',
      avatar: studentData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      department: studentData.department || 'Computer Science and Engineering',
      year: studentData.year || '3rd Year',
      skills: Array.isArray(studentData.skills) && studentData.skills.length > 0 ? studentData.skills : ['HTML', 'CSS', 'JavaScript'],
      availability: studentData.availability || 'Available',
      rating: studentData.rating || 5.0,
      ratingCount: studentData.ratingCount || 1,
      completedProjectsCount: studentData.completedProjectsCount || 0,
      status: studentData.status || 'Active',
      joinedDate: studentData.joinedDate || new Date().toISOString().split('T')[0],
      education: studentData.education || {
        college: 'Institute of Engineering & Technology',
        department: studentData.department || 'Computer Science and Engineering',
        course: 'B.Tech Computer Science',
        year: '2023 - 2027'
      },
      portfolio: studentData.portfolio || [
        {
          id: `port-${Date.now()}`,
          title: 'Campus Hackathon MVP',
          description: 'Interactive web prototype built during campus tech sprint.',
          technologies: studentData.skills ? studentData.skills.slice(0, 3) : ['React', 'JavaScript'],
          imageColor: 'from-indigo-600 to-purple-700',
          completedAt: 'Recent'
        }
      ],
      socialLinks: studentData.socialLinks || {
        github: `https://github.com/${studentData.name.toLowerCase().replace(/\s+/g, '')}`,
        linkedin: `https://linkedin.com/in/${studentData.name.toLowerCase().replace(/\s+/g, '-')}`
      },
      badges: studentData.badges || ['Verified Student', 'Community Member']
    };

    db.students.unshift(newStudent);

    // Notify admin
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: 'admin',
      title: 'New Student Enrolled',
      message: `Admin registered ${newStudent.name} (${newStudent.studentId}) - ${newStudent.role}.`,
      createdAt: 'Just now',
      read: false,
      type: 'success'
    });

    saveDatabase(db);
    console.log(`[Backend] Student registered: ${newStudent.name} (${newStudent.studentId})`);
    res.status(201).json(newStudent);
  });

  apiRouter.put('/students/:id', (req, res) => {
    const idx = db.students.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    db.students[idx] = { ...db.students[idx], ...req.body };
    saveDatabase(db);
    res.json(db.students[idx]);
  });

  apiRouter.delete('/students/:id', (req, res) => {
    const idx = db.students.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const removed = db.students.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ message: 'Student removed', student: removed });
  });

  // ==================== CLIENTS ====================
  apiRouter.get('/clients', (req, res) => {
    res.json(db.clients);
  });

  apiRouter.put('/clients/:id', (req, res) => {
    const idx = db.clients.findIndex((c) => c.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Client not found' });
    }
    db.clients[idx] = { ...db.clients[idx], ...req.body };
    saveDatabase(db);
    res.json(db.clients[idx]);
  });

  // ==================== TASKS ====================
  apiRouter.get('/tasks', (req, res) => {
    res.json(db.tasks);
  });

  apiRouter.post('/tasks', (req, res) => {
    const taskData = req.body;
    const newTask: Task = {
      ...taskData,
      id: taskData.id || `task-${Date.now()}`,
      createdAt: taskData.createdAt || new Date().toISOString().split('T')[0]
    };
    db.tasks.unshift(newTask);

    // Update client count
    const client = db.clients.find((c) => c.id === newTask.clientId);
    if (client) {
      client.totalTasksPosted = (client.totalTasksPosted || 0) + 1;
    }

    // Add notification
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: 'admin',
      title: 'New Task Posted',
      message: `Task "${newTask.title}" posted with budget $${newTask.budget}.`,
      createdAt: 'Just now',
      read: false,
      type: 'info'
    });

    saveDatabase(db);
    res.status(201).json(newTask);
  });

  apiRouter.put('/tasks/:id', (req, res) => {
    const idx = db.tasks.findIndex((t) => t.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    db.tasks[idx] = { ...db.tasks[idx], ...req.body };
    saveDatabase(db);
    res.json(db.tasks[idx]);
  });

  // ==================== APPLICATIONS ====================
  apiRouter.get('/applications', (req, res) => {
    res.json(db.applications);
  });

  apiRouter.post('/applications', (req, res) => {
    const appData = req.body;
    const newApp: Application = {
      ...appData,
      id: appData.id || `app-${Date.now()}`,
      appliedDate: appData.appliedDate || new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    db.applications.unshift(newApp);

    const task = db.tasks.find((t) => t.id === newApp.taskId);
    const student = db.students.find((s) => s.id === newApp.studentId);

    // Notify client
    if (task) {
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        recipientId: task.clientId,
        title: 'New Task Proposal Received',
        message: `${student?.name || 'A student'} applied for "${task.title}".`,
        createdAt: 'Just now',
        read: false,
        type: 'info'
      });
    }

    saveDatabase(db);
    res.status(201).json(newApp);
  });

  apiRouter.put('/applications/:id', (req, res) => {
    const idx = db.applications.findIndex((a) => a.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }
    const updated = { ...db.applications[idx], ...req.body };
    db.applications[idx] = updated;

    // If accepted, instantiate a project if one does not already exist
    if (updated.status === 'Accepted') {
      const existingProj = db.projects.find((p) => p.taskId === updated.taskId && p.studentId === updated.studentId);
      const task = db.tasks.find((t) => t.id === updated.taskId);
      if (!existingProj && task) {
        const newProject: Project = {
          id: `proj-${Date.now()}`,
          taskId: updated.taskId,
          taskTitle: task.title,
          clientId: task.clientId,
          studentId: updated.studentId,
          budget: updated.proposedAmount || task.budget,
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
              description: 'Refine responsive layouts and complete final deliverables.',
              dueDate: task.deadline,
              status: 'Pending'
            }
          ],
          files: [],
          submissions: [],
          activities: [
            {
              id: `act-${Date.now()}`,
              action: 'Project Initialized',
              description: `Project initialized for task "${task.title}".`,
              timestamp: new Date().toLocaleTimeString(),
              actor: 'System'
            }
          ]
        };
        db.projects.unshift(newProject);
      }
    }

    saveDatabase(db);
    res.json(updated);
  });

  // ==================== PROJECTS ====================
  apiRouter.get('/projects', (req, res) => {
    res.json(db.projects);
  });

  apiRouter.put('/projects/:id', (req, res) => {
    const idx = db.projects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    db.projects[idx] = { ...db.projects[idx], ...req.body };
    saveDatabase(db);
    res.json(db.projects[idx]);
  });

  // ==================== MESSAGES & TEXTING ====================
  apiRouter.get('/messages', (req, res) => {
    const { senderId, recipientId } = req.query;
    if (senderId && recipientId) {
      const thread = db.messages.filter(
        (m) =>
          (m.senderId === senderId && m.recipientId === recipientId) ||
          (m.senderId === recipientId && m.recipientId === senderId)
      );
      return res.json(thread);
    }
    res.json(db.messages);
  });

  apiRouter.post('/messages', (req, res) => {
    const msgData = req.body;
    if (!msgData.text || !msgData.senderId || !msgData.recipientId) {
      return res.status(400).json({ error: 'text, senderId, and recipientId are required' });
    }

    const convId = msgData.conversationId || [msgData.senderId, msgData.recipientId].sort().join('--');

    const newMsg: Message = {
      id: msgData.id || `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      conversationId: convId,
      senderId: msgData.senderId,
      senderName: msgData.senderName || 'Anonymous',
      senderRole: msgData.senderRole || 'student',
      recipientId: msgData.recipientId,
      recipientName: msgData.recipientName || 'Recipient',
      text: msgData.text.trim(),
      timestamp: msgData.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      projectId: msgData.projectId
    };

    db.messages.push(newMsg);

    // Create notification for recipient
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: newMsg.recipientId,
      title: `New message from ${newMsg.senderName}`,
      message: newMsg.text.length > 60 ? `${newMsg.text.slice(0, 57)}...` : newMsg.text,
      createdAt: 'Just now',
      read: false,
      type: 'info'
    });

    saveDatabase(db);
    console.log(`[Backend] Text message sent from ${newMsg.senderName} to ${newMsg.recipientName}: "${newMsg.text}"`);
    res.status(201).json(newMsg);
  });

  // ==================== EVENTS ====================
  apiRouter.get('/events', (req, res) => {
    res.json(db.events);
  });

  apiRouter.post('/events', (req, res) => {
    const eventData = req.body;
    const newEvt: PlatformEvent = {
      ...eventData,
      id: eventData.id || `evt-${Date.now()}`,
      status: 'Upcoming'
    };
    db.events.unshift(newEvt);
    saveDatabase(db);
    res.status(201).json(newEvt);
  });

  apiRouter.post('/events/:id/register', (req, res) => {
    const eventId = req.params.id;
    const evt = db.events.find((e) => e.id === eventId);
    if (!evt) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const regData = req.body;
    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      studentId: regData.studentId,
      name: regData.name || 'Student Participant',
      email: regData.email || 'student@campus.edu',
      campusId: regData.campusId || 'CAMPUS-2026',
      department: regData.department || 'Engineering',
      phone: regData.phone || '+91 98451 98765',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    db.registrations.unshift(newReg);
    saveDatabase(db);
    res.status(201).json({ message: 'Registered successfully', registration: newReg, event: evt });
  });

  // ==================== GALLERY ====================
  apiRouter.get('/gallery', (req, res) => {
    res.json(db.gallery);
  });

  apiRouter.post('/gallery', (req, res) => {
    const newItem: GalleryItem = {
      ...req.body,
      id: req.body.id || `gal-${Date.now()}`
    };
    db.gallery.unshift(newItem);
    saveDatabase(db);
    res.status(201).json(newItem);
  });

  // ==================== REVIEWS ====================
  apiRouter.get('/reviews', (req, res) => {
    res.json(db.reviews);
  });

  apiRouter.post('/reviews', (req, res) => {
    const rev: Review = {
      ...req.body,
      id: req.body.id || `rev-${Date.now()}`,
      createdAt: req.body.createdAt || new Date().toISOString().split('T')[0]
    };
    db.reviews.unshift(rev);

    // Update target student or client rating
    const targetStudent = db.students.find((s) => s.id === rev.targetId);
    if (targetStudent) {
      const currentSum = targetStudent.rating * targetStudent.ratingCount;
      targetStudent.ratingCount += 1;
      targetStudent.rating = Number(((currentSum + rev.rating) / targetStudent.ratingCount).toFixed(1));
    }

    saveDatabase(db);
    res.status(201).json(rev);
  });

  // ==================== REPORTS ====================
  apiRouter.get('/reports', (req, res) => {
    res.json(db.reports);
  });

  apiRouter.post('/reports', (req, res) => {
    const newReport: Report = {
      ...req.body,
      id: req.body.id || `rep-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Open'
    };
    db.reports.unshift(newReport);

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: 'admin',
      title: 'Safety Report Submitted',
      message: `Report filed for ${newReport.targetName} (${newReport.targetType}): ${newReport.reason}.`,
      createdAt: 'Just now',
      read: false,
      type: 'alert'
    });

    saveDatabase(db);
    res.status(201).json(newReport);
  });

  apiRouter.put('/reports/:id', (req, res) => {
    const idx = db.reports.findIndex((r) => r.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Report not found' });
    }
    db.reports[idx] = { ...db.reports[idx], ...req.body };
    saveDatabase(db);
    res.json(db.reports[idx]);
  });

  // ==================== CONTACT FORM INQUIRIES ====================
  apiRouter.post('/contact', (req, res) => {
    const inquiry = {
      id: `inq-${Date.now()}`,
      name: req.body.name || 'Anonymous',
      email: req.body.email || 'anon@campus.edu',
      category: req.body.category || 'General',
      message: req.body.message || '',
      createdAt: new Date().toISOString()
    };
    db.inquiries.unshift(inquiry);

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientId: 'admin',
      title: 'New Contact Inquiry Received',
      message: `Inquiry from ${inquiry.name} (${inquiry.email}) on [${inquiry.category}].`,
      createdAt: 'Just now',
      read: false,
      type: 'info'
    });

    saveDatabase(db);
    console.log(`[Backend] Contact inquiry recorded from ${inquiry.name}: ${inquiry.message}`);
    res.status(201).json({ message: 'Inquiry received and logged to backend', inquiry });
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Vite middleware in dev or static serving in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Freeverse Full-Stack] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
