
export interface EventTask {
  id: string;
  title: string;
  description: string;
  assignedRole: 'resident' | 'operator' | 'maintenance' | 'prospect' | 'vendor';
  isComplete: boolean;
  completedAt?: Date;
  completedBy?: string;
  isRequired: boolean;
  dueDate?: Date;
  estimatedDuration?: number; // in minutes
  instructions?: string;
  dependencies?: string[]; // task IDs that must be completed first
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

export interface UniversalEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tasks: EventTask[];
  assignedUsers: {
    role: string;
    userId?: string;
    name?: string;
    email?: string;
  }[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  rescheduledCount: number;
  followUpHistory: EmailFollowUp[];
  metadata: Record<string, any>; // event-specific data
}
