import { Role } from './roles';
import type { TaskCompletionStamp } from './taskStamps';

export interface EventTask {
  id: string;
  title: string;
  description: string;
  assignedRole: Role;
  isComplete: boolean;
  completedAt?: Date;
  completedBy?: Role;
  isRequired: boolean;
  dueDate?: Date;
  estimatedDuration?: number; // in minutes
  instructions?: string;
  dependencies?: string[]; // task IDs that must be completed first
  dependsOnTaskId?: string; // single task dependency - Add this line to fix TS errors
  status: 'locked' | 'available' | 'in-progress' | 'complete';
  unlockCondition?: string; // optional unlock condition
  canUndo?: boolean; // whether task can be undone before 11:59 PM
}

export interface EventType {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  estimatedDuration: number;
  allowsReschedule: boolean;
  defaultTasks: Omit<EventTask, 'id' | 'isComplete' | 'completedAt' | 'completedBy'>[];
  followUpSequence?: EmailFollowUp[];
  fallbackRules: FallbackRule[];
  overdueThreshold: number; // hours after due time
  escalationRules: EscalationRule[];
}

export interface EmailFollowUp {
  id: string;
  templateId: string;
  delayHours: number;
  condition?: string; // condition to trigger
  stopOnResponse?: boolean;
}

export interface MessageEntry {
  id: string;
  timestamp: Date;
  type: 'message' | 'gentle-reminder' | 'system-note';
  content: string;
  sentBy: Role | string;
  recipientType?: string;
}

export interface FallbackRule {
  id: string;
  condition: string;
  action: 'auto-cancel' | 'reschedule' | 'escalate' | 'archive';
  delayHours: number;
  notification?: string;
}

export interface EscalationRule {
  id: string;
  threshold: number; // hours overdue
  action: string;
  assignTo?: string;
  notification: string;
}

// Re-export the unified TaskCompletionStamp
export type { TaskCompletionStamp } from './taskStamps';

export interface UniversalEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string; // Added category field
  estimatedDuration?: number; // Added estimated duration
  tasks: EventTask[];
  assignedUsers: {
    role: Role;
    userId?: string;
    name?: string;
    email?: string;
  }[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  rescheduledCount: number;
  followUpHistory: (EmailFollowUp | MessageEntry)[];
  metadata: Record<string, any>; // event-specific data
  taskCompletionStamps: TaskCompletionStamp[]; // Track all task completions
}
