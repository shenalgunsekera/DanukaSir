// ─────────────────────────────────────────────────────────────
//  Domain types for the tutor platform
// ─────────────────────────────────────────────────────────────

export interface Qualification {
  id: string;
  title: string;
  institution: string;
  year: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  icon?: string; // lucide icon name
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export interface SuccessStory {
  id: string;
  studentName: string; // may be anonymised
  image?: string;
  subject: string;
  fromGrade: string;
  toGrade: string;
  comment: string;
  featured: boolean;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  instructions: string; // e.g. "Add your name as the reference"
}

export interface Availability {
  weekdays: number[]; // 0=Sun … 6=Sat that the tutor is available
  slots: string[]; // time slots e.g. ["16:00","17:30"]
  sessionMinutes: number;
  blockedDates: string[]; // ISO yyyy-mm-dd dates explicitly closed
  note: string;
}

export type BackgroundPattern = "sparkles" | "grid" | "aurora" | "dots" | "none";

export interface ThemeSettings {
  bgColor: string; // hex
  pattern: BackgroundPattern;
  accent: string; // hex — sparkle / highlight tint
}

export interface TutorProfile {
  name: string;
  headline: string; // short professional intro
  bio: string; // longer biography
  philosophy: string;
  approach: string;
  experienceOverview: string;
  yearsExperience: number;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  coverImage?: string;
  subjects: string[];
  teachingMethods: string[];
  qualifications: Qualification[];
  certifications: Qualification[];
  achievements: Achievement[];
  milestones: Milestone[];
  stats: StatItem[];
  successStories: SuccessStory[];
  socials?: { label: string; url: string }[];
  bankDetails: BankDetails;
  availability: Availability;
  theme: ThemeSettings;
  // Homepage section toggles
  sections: {
    stats: boolean;
    successStories: boolean;
    reviews: boolean;
    qualifications: boolean;
    milestones: boolean;
    contact: boolean;
  };
}

export type NoteFileKind = "pdf" | "word" | "excel" | "other";

export interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  price: number; // LKR
  fileUrl: string; // Firebase Storage URL or data URL (demo)
  fileName: string;
  fileKind: NoteFileKind;
  fileSize: number;
  pages?: number;
  previewUrl: string; // first ~2 pages (PDF) — shown publicly before purchase
  previewPages: number;
  published: boolean;
  purchases: number;
  createdAt: number;
}

export type PurchaseStatus = "pending" | "approved" | "rejected";

export interface Purchase {
  id: string;
  noteId: string;
  noteTitle: string;
  studentName: string;
  email: string;
  phone: string;
  amount: number;
  slipUrl: string; // uploaded payment slip (Storage URL or data URL)
  slipName: string;
  status: PurchaseStatus;
  createdAt: number;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  reviewerName: string;
  reviewerRole: "student" | "parent";
  anonymous: boolean;
  rating: number; // 1-5
  body: string;
  status: ReviewStatus;
  featured: boolean;
  createdAt: number; // epoch ms
}

export interface SubjectPerformance {
  subject: string;
  level: number; // 0-100 current
  baseline: number; // 0-100 starting point
}

export interface ExamResult {
  id: string;
  title: string;
  subject: string;
  date: string;
  score: number;
  maxScore: number;
  grade?: string;
}

export interface AssignmentRecord {
  id: string;
  title: string;
  type: "homework" | "assignment" | "project";
  dueDate: string;
  status: "completed" | "pending" | "late" | "missing";
  score?: number;
}

export interface FeedbackNote {
  id: string;
  date: string;
  category: "monthly" | "observation" | "behaviour" | "improvement" | "goal" | "recommendation";
  title: string;
  body: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: "milestone" | "exam" | "feedback" | "achievement" | "enrolled";
  title: string;
  description: string;
}

export interface AttendanceRecord {
  present: number;
  total: number;
}

export interface ParentAccess {
  code: string; // access code parents type
  token: string; // private link token
  enabled: boolean;
  lastViewedAt: number | null;
  viewCount: number;
}

export type BookingStatus = "new" | "contacted" | "scheduled" | "declined";

export interface Booking {
  id: string;
  studentName: string;
  email: string;
  phone?: string;
  grade?: string;
  subject: string;
  preferredDate: string;
  preferredTime?: string;
  mode: "online" | "in-person";
  message?: string;
  status: BookingStatus;
  createdAt: number;
}

export interface Student {
  id: string;
  name: string;
  image?: string;
  grade: string;
  subjects: string[];
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  enrolledAt: number;
  // Learning profile
  goals: string;
  currentLevel: string;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
  // Academic tracking
  performance: SubjectPerformance[];
  exams: ExamResult[];
  assignments: AssignmentRecord[];
  attendance: AttendanceRecord;
  // Feedback & history
  feedback: FeedbackNote[];
  achievements: Achievement[];
  timeline: TimelineEvent[];
  // Parent access
  access: ParentAccess;
  status: "active" | "archived";
  updatedAt: number;
}
