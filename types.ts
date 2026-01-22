
export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface StudentProfile {
  name: string;
  gpa: string;
  major: string;
  interests: string;
  gradeLevel: string;
  ethnicity?: string;
  householdIncome?: string;
  achievements: string;
  extracurriculars: string;
  personalStatementFragment: string;
  trustAutoApply: boolean; // Added for explicit consent trust
}

export interface ScholarshipMatch {
  id: string;
  name: string;
  amount: string;
  deadline: string;
  matchScore: number;
  reason: string;
  canAutoApply: boolean;
  requirements: string[];
}

export interface ApplicationRecord {
  id: string;
  scholarshipId: string;
  name: string;
  status: 'Drafting' | 'Review Required' | 'Submitted' | 'Decision Received';
  submittedDate?: string;
  generatedEssay?: string;
  aiNotes?: string;
}

export interface Notification {
  id: string;
  type: 'match' | 'submission' | 'deadline' | 'result';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export enum AppSection {
  HOME = 'home',
  PROFILE = 'profile',
  MATCHES = 'matches',
  TRACKER = 'tracker',
  CHAT = 'chat',
  RESOURCES = 'resources',
  NOTIFICATIONS = 'notifications'
}
