
export interface TeamMember {
  id: string;
  name: string;
  role: 'maintenance' | 'leasing' | 'management' | 'community';
  availability: TimeSlot[];
  phone?: string;
  email?: string;
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;   // HH:MM format
  available: boolean;
}

export interface EnhancedEvent {
  id: number | string;
  date: Date;
  time: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  priority: string;
  dueDate?: Date;
  assignedTeamMember?: TeamMember;
  residentId?: string;
  residentName?: string;
  propertyId?: string;
  unit?: string;
  canReschedule: boolean;
  canCancel: boolean;
  estimatedDuration: number; // in minutes
  originalScheduledDate?: Date;
  rescheduledCount: number;
  status?: string;
  building?: string;
  phone?: string;
}

export interface RescheduleData {
  eventId: string | number;
  newDate: Date;
  newTime: string;
  reason?: string;
  notifyResident: boolean;
  notifyTeamMember: boolean;
}
