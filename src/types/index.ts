export type Role = 'public' | 'student' | 'client' | 'admin';

export type Availability = 'Available' | 'Busy' | 'Not Available';
export type StudentStatus = 'Pending' | 'Approved' | 'Rejected' | 'Suspended' | 'Active';
export type ClientStatus = 'Active' | 'Suspended';

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageColor?: string;
  completedAt?: string;
}

export interface Education {
  college: string;
  department: string;
  course: string;
  year: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  instagram?: string;
  website?: string;
  blog?: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. "24CSE032"
  name: string;
  email: string;
  phone: string;
  role: string; // e.g. "Full Stack Developer"
  bio: string;
  avatar: string;
  department: string;
  year: string; // e.g. "3rd Year"
  skills: string[];
  availability: Availability;
  rating: number;
  ratingCount: number;
  completedProjectsCount: number;
  status: StudentStatus;
  joinedDate: string;
  education: Education;
  portfolio: PortfolioProject[];
  socialLinks: SocialLinks;
  badges: string[];
}

export interface Client {
  id: string;
  name: string;
  company: string;
  industry: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  status: ClientStatus;
  rating: number;
  ratingCount: number;
  totalTasksPosted: number;
  joinedDate: string;
  website?: string;
}

export type TaskStatus = 'Draft' | 'Open' | 'In Progress' | 'Completed' | 'Closed' | 'Cancelled';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Task {
  id: string;
  title: string;
  clientId: string;
  description: string;
  category: string;
  requiredSkills: string[];
  budget: number;
  deadline: string;
  expectedDuration: string;
  experienceLevel: ExperienceLevel;
  additionalRequirements: string;
  attachments?: { name: string; size: string }[];
  status: TaskStatus;
  createdAt: string;
  selectedStudentId?: string;
}

export type ApplicationStatus = 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected' | 'Withdrawn';

export interface Application {
  id: string;
  taskId: string;
  studentId: string;
  proposalMessage: string;
  expectedDelivery: string;
  proposedAmount: number;
  additionalMessage?: string;
  status: ApplicationStatus;
  appliedDate: string;
  rejectionReason?: string;
}

export type ProjectStatus = 'Awaiting Start' | 'In Progress' | 'Submitted' | 'Revision Requested' | 'Completed' | 'Cancelled';
export type MilestoneStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  fileType: string;
  uploadedBy: 'client' | 'student';
  uploadedByName: string;
  uploadedDate: string;
}

export interface ProjectSubmission {
  id: string;
  submissionMessage: string;
  projectUrl?: string;
  githubUrl?: string;
  liveWebsiteUrl?: string;
  submittedAt: string;
  files: { name: string; size: string }[];
  version: number;
  status: 'Pending Review' | 'Accepted' | 'Revision Requested';
  revisionFeedback?: string;
}

export interface ProjectActivity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface Project {
  id: string;
  taskId: string;
  taskTitle: string;
  clientId: string;
  studentId: string;
  budget: number;
  startDate: string;
  deadline: string;
  status: ProjectStatus;
  progress: number; // 0 to 100
  milestones: Milestone[];
  files: ProjectFile[];
  submissions: ProjectSubmission[];
  activities: ProjectActivity[];
  clientReviewed?: boolean;
  studentReviewed?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'client' | 'admin';
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  projectId?: string;
  read: boolean;
}

export type EventCategory = 
  | 'Workshops' 
  | 'Competitions' 
  | 'Seminars' 
  | 'Hackathons' 
  | 'Technical Events' 
  | 'Non-Technical Events' 
  | 'Webinars' 
  | 'Career Sessions' 
  | 'Community Meetups';

export type EventMode = 'Online' | 'Offline' | 'Hybrid';
export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId?: string;
  name: string;
  email: string;
  campusId: string;
  department: string;
  phone: string;
  registeredAt: string;
}

export interface PlatformEvent {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  mode: EventMode;
  organizer: string;
  registrationDeadline: string;
  maxParticipants: number;
  bannerGradient: string;
  status: EventStatus;
  tags: string[];
}

export interface GalleryItem {
  id: string;
  eventId: string;
  eventName: string;
  caption: string;
  description: string;
  date: string;
  themeColor: string;
  category: string;
}

export interface Review {
  id: string;
  projectId: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorRole: 'client' | 'student';
  targetId: string;
  targetName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // studentId, clientId, or 'admin'
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  linkTo?: string;
  createdAt: string;
  read: boolean;
}

export type ReportTargetType = 'student' | 'client' | 'task' | 'message' | 'review';
export type ReportReason = 'Spam' | 'Inappropriate Content' | 'Fraud' | 'Misconduct' | 'Other';
export type ReportStatus = 'Open' | 'Under Review' | 'Resolved' | 'Dismissed';

export interface Report {
  id: string;
  reportedBy: string;
  reporterRole: 'student' | 'client' | 'admin';
  targetType: ReportTargetType;
  targetId: string;
  targetName: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  createdAt: string;
  adminNotes?: string;
}
