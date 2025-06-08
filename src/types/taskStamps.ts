
import { Role } from './roles';

export interface TaskCompletionStamp {
  id: string;
  taskId: string;
  taskName: string;
  eventId: string;
  eventType: string;
  completedAt: Date;
  completedBy: Role;
  completedByName: string;
  userId: string;
  canUndo: boolean;
  displayTime: string;
  permanent: boolean; // true after 11:59 PM - stamps become locked
  actualCompletionTime: Date; // locked to true completion time
}

export interface CalendarStamp {
  id: string;
  taskName: string;
  completedBy: string;
  completedByRole: Role;
  completedAt: Date;
  eventId: string;
  eventType: string;
  timeSlot: string; // HH:MM format for positioning
  isEventCompletion?: boolean; // true if this represents full event completion
  permanent: boolean;
  actualCompletionTime: Date;
}
