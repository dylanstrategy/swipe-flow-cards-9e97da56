
import { TeamMember, TimeSlot, EnhancedEvent } from '@/types/events';
import { format, addDays, startOfDay, addHours } from 'date-fns';

// Mock team members data
const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm-001',
    name: 'Mike Rodriguez',
    role: 'maintenance',
    phone: '(555) 123-4567',
    email: 'mike.rodriguez@example.com',
    availability: []
  },
  {
    id: 'tm-002',
    name: 'Sarah Johnson',
    role: 'leasing',
    phone: '(555) 234-5678',
    email: 'sarah.johnson@example.com',
    availability: []
  },
  {
    id: 'tm-003',
    name: 'David Chen',
    role: 'management',
    phone: '(555) 345-6789',
    email: 'david.chen@example.com',
    availability: []
  },
  {
    id: 'tm-004',
    name: 'Lisa Park',
    role: 'community',
    phone: '(555) 456-7890',
    email: 'lisa.park@example.com',
    availability: []
  }
];

class TeamAvailabilityService {
  // Get team member by ID
  getTeamMember(id: string): TeamMember | undefined {
    return mockTeamMembers.find(member => member.id === id);
  }

  // Get team members by role
  getTeamMembersByRole(role: string): TeamMember[] {
    return mockTeamMembers.filter(member => member.role === role);
  }

  // Assign team member based on event type and category
  assignTeamMember(event: Partial<EnhancedEvent>): TeamMember | undefined {
    switch (event.category?.toLowerCase()) {
      case 'work order':
      case 'maintenance':
        return this.getTeamMembersByRole('maintenance')[0];
      
      case 'lease':
      case 'leasing':
      case 'tour':
        return this.getTeamMembersByRole('leasing')[0];
      
      case 'management':
      case 'message':
        return this.getTeamMembersByRole('management')[0];
      
      case 'community event':
      case 'poll':
        return this.getTeamMembersByRole('community')[0];
      
      default:
        return this.getTeamMembersByRole('management')[0];
    }
  }

  // Get available time slots for a team member on a specific date
  getAvailableTimeSlots(teamMemberId: string, date: Date): TimeSlot[] {
    const teamMember = this.getTeamMember(teamMemberId);
    if (!teamMember) return [];

    // Generate time slots from 9 AM to 5 PM
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          start: timeString,
          end: timeString,
          available: this.isSlotAvailable(teamMemberId, date, timeString)
        });
      }
    }

    return slots;
  }

  // Check if a specific time slot is available for a team member
  private isSlotAvailable(teamMemberId: string, date: Date, time: string): boolean {
    // Mock logic - in real app, this would check against actual schedules
    const dayOfWeek = date.getDay();
    const hour = parseInt(time.split(':')[0]);
    
    // Weekend availability (limited)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return hour >= 10 && hour <= 14; // 10 AM to 2 PM only
    }
    
    // Weekday availability
    if (hour < 9 || hour >= 17) return false; // Outside business hours
    
    // Mock some busy slots
    const busySlots = ['10:30', '14:00', '15:30'];
    if (busySlots.includes(time)) return false;
    
    // Lunch break
    if (hour === 12 || hour === 13) return false;
    
    return true;
  }

  // Get all events for a team member (mock data)
  getTeamMemberSchedule(teamMemberId: string, date: Date): EnhancedEvent[] {
    // Mock scheduled events
    return [
      {
        id: 'evt-001',
        date: date,
        time: '10:30',
        title: 'Unit Inspection',
        description: 'Scheduled inspection for Unit 205',
        category: 'Inspection',
        priority: 'medium',
        canReschedule: true,
        canCancel: true,
        estimatedDuration: 60,
        rescheduledCount: 0
      }
    ];
  }

  // Find optimal time slots based on all team members and resident preferences
  findOptimalTimeSlots(eventType: string, date: Date, duration: number = 60): TimeSlot[] {
    const relevantTeamMembers = this.getRelevantTeamMembers(eventType);
    
    if (relevantTeamMembers.length === 0) return [];
    
    // For simplicity, use the first relevant team member
    return this.getAvailableTimeSlots(relevantTeamMembers[0].id, date);
  }

  private getRelevantTeamMembers(eventType: string): TeamMember[] {
    switch (eventType.toLowerCase()) {
      case 'work order':
      case 'maintenance':
        return this.getTeamMembersByRole('maintenance');
      case 'lease':
      case 'leasing':
        return this.getTeamMembersByRole('leasing');
      case 'management':
        return this.getTeamMembersByRole('management');
      case 'community':
        return this.getTeamMembersByRole('community');
      default:
        return mockTeamMembers;
    }
  }
}

export const teamAvailabilityService = new TeamAvailabilityService();
