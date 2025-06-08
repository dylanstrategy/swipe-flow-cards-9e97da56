
import { format, addMinutes, isSameDay, parse } from 'date-fns';
import { sharedEventService } from './sharedEventService';
import { UniversalEvent } from '@/types/eventTasks';

interface AvailabilitySlot {
  time: string;
  isAvailable: boolean;
}

interface WorkOrderScheduleData {
  workOrderId: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedResidentId: string;
  assignedMaintenanceUserId: string;
  estimatedDuration: number;
}

class SharedSchedulingService {
  // Shared test resident for all work orders
  private readonly SHARED_TEST_RESIDENT_ID = 'test-resident-001';
  private readonly SHARED_TEST_MAINTENANCE_ID = 'test-maintenance-001';

  getSharedTestResidentId(): string {
    return this.SHARED_TEST_RESIDENT_ID;
  }

  getSharedTestMaintenanceId(): string {
    return this.SHARED_TEST_MAINTENANCE_ID;
  }

  /**
   * Convert time string to minutes for easier comparison
   */
  private timeToMinutes(timeString: string): number {
    if (!timeString) return 0;
    
    if (timeString.includes('AM') || timeString.includes('PM')) {
      const [time, period] = timeString.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = (hours % 12) * 60 + minutes;
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) totalMinutes = minutes;
      return totalMinutes;
    }
    
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Convert minutes back to time string (24-hour format)
   */
  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * Get all events for a specific date and role
   */
  private getEventsForDateAndRole(date: Date, role: 'resident' | 'maintenance'): UniversalEvent[] {
    const events = sharedEventService.getEventsForRole(role);
    return events.filter(event => {
      try {
        const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
        return isSameDay(eventDate, date);
      } catch (error) {
        console.error('Date comparison error:', error);
        return false;
      }
    });
  }

  /**
   * Generate availability slots for a given date (9 AM to 5 PM in 1-hour slots)
   */
  private generateTimeSlots(date: Date): AvailabilitySlot[] {
    const slots: AvailabilitySlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        time: timeString,
        isAvailable: true
      });
    }
    
    return slots;
  }

  /**
   * Check if a time slot conflicts with existing events
   */
  private isSlotAvailable(
    timeSlot: string, 
    duration: number, 
    existingEvents: UniversalEvent[]
  ): boolean {
    const slotStart = this.timeToMinutes(timeSlot);
    const slotEnd = slotStart + duration;

    return !existingEvents.some(event => {
      const eventStart = this.timeToMinutes(event.time);
      // Use metadata.estimatedDuration if available, otherwise default to 60 minutes
      const eventDuration = event.metadata?.estimatedDuration || 60;
      const eventEnd = eventStart + eventDuration;
      
      // Check for overlap
      return (slotStart < eventEnd && slotEnd > eventStart);
    });
  }

  /**
   * Find the first mutually available time slot for resident and maintenance
   */
  findMutualAvailability(
    date: Date, 
    duration: number = 60
  ): string | null {
    const residentEvents = this.getEventsForDateAndRole(date, 'resident');
    const maintenanceEvents = this.getEventsForDateAndRole(date, 'maintenance');
    
    const timeSlots = this.generateTimeSlots(date);
    
    for (const slot of timeSlots) {
      const isResidentAvailable = this.isSlotAvailable(slot.time, duration, residentEvents);
      const isMaintenanceAvailable = this.isSlotAvailable(slot.time, duration, maintenanceEvents);
      
      if (isResidentAvailable && isMaintenanceAvailable) {
        return slot.time;
      }
    }
    
    return null; // No mutual availability found
  }

  /**
   * Schedule a work order with mutual availability check
   */
  scheduleWorkOrder(
    workOrderData: WorkOrderScheduleData,
    targetDate: Date,
    targetTime?: string
  ): { success: boolean; scheduledTime?: string; eventId?: string } {
    console.log('Scheduling work order:', workOrderData, 'for date:', targetDate);
    
    let finalTime: string;
    
    if (targetTime) {
      // Check if the specific time is available for both parties
      const residentEvents = this.getEventsForDateAndRole(targetDate, 'resident');
      const maintenanceEvents = this.getEventsForDateAndRole(targetDate, 'maintenance');
      
      const isResidentAvailable = this.isSlotAvailable(targetTime, workOrderData.estimatedDuration, residentEvents);
      const isMaintenanceAvailable = this.isSlotAvailable(targetTime, workOrderData.estimatedDuration, maintenanceEvents);
      
      if (!isResidentAvailable || !isMaintenanceAvailable) {
        console.log('Requested time not available, finding alternative...');
        const mutualTime = this.findMutualAvailability(targetDate, workOrderData.estimatedDuration);
        if (!mutualTime) {
          return { success: false };
        }
        finalTime = mutualTime;
      } else {
        finalTime = targetTime;
      }
    } else {
      // Find first available mutual time
      const mutualTime = this.findMutualAvailability(targetDate, workOrderData.estimatedDuration);
      if (!mutualTime) {
        return { success: false };
      }
      finalTime = mutualTime;
    }

    // Create the shared event with tasks for both roles
    const eventId = `wo-${workOrderData.workOrderId}-${Date.now()}`;
    
    const sharedEvent: UniversalEvent = {
      id: eventId,
      type: 'work-order',
      title: workOrderData.title,
      description: workOrderData.description,
      date: targetDate,
      time: finalTime,
      status: 'scheduled',
      priority: workOrderData.priority,
      category: 'Work Order',
      tasks: [
        {
          id: `${eventId}-task-1`,
          title: 'Resident: Grant Access',
          description: 'Provide access to maintenance team',
          assignedRole: 'resident',
          isComplete: false,
          isRequired: true,
          status: 'available',
          estimatedDuration: 5
        },
        {
          id: `${eventId}-task-2`,
          title: 'Maintenance: Complete Work Order',
          description: `Complete: ${workOrderData.title}`,
          assignedRole: 'maintenance',
          isComplete: false,
          isRequired: true,
          status: 'available',
          estimatedDuration: workOrderData.estimatedDuration - 15
        },
        {
          id: `${eventId}-task-3`,
          title: 'Maintenance: Update Status',
          description: 'Update work order completion status',
          assignedRole: 'maintenance',
          isComplete: false,
          isRequired: true,
          status: 'available',
          estimatedDuration: 10
        }
      ],
      assignedUsers: [
        { role: 'resident', userId: this.SHARED_TEST_RESIDENT_ID, name: 'Test Resident' },
        { role: 'maintenance', userId: this.SHARED_TEST_MAINTENANCE_ID, name: 'Test Maintenance User' }
      ],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        workOrderId: workOrderData.workOrderId,
        residentId: this.SHARED_TEST_RESIDENT_ID,
        maintenanceUserId: this.SHARED_TEST_MAINTENANCE_ID,
        estimatedDuration: workOrderData.estimatedDuration,
        unit: 'Test Unit 417',
        building: 'Test Building A'
      },
      taskCompletionStamps: []
    };

    // Add the event to shared service (it will be visible to all roles)
    const success = sharedEventService.addEvent(sharedEvent);
    
    if (success) {
      console.log('Work order scheduled successfully:', {
        eventId,
        time: finalTime,
        date: format(targetDate, 'yyyy-MM-dd')
      });
      
      return {
        success: true,
        scheduledTime: finalTime,
        eventId
      };
    }
    
    return { success: false };
  }

  /**
   * Get work order details from event metadata
   */
  getWorkOrderFromEvent(event: UniversalEvent): WorkOrderScheduleData | null {
    if (event.type !== 'work-order' || !event.metadata?.workOrderId) {
      return null;
    }

    return {
      workOrderId: event.metadata.workOrderId,
      title: event.title,
      description: event.description,
      category: event.category,
      priority: event.priority,
      assignedResidentId: event.metadata.residentId || this.SHARED_TEST_RESIDENT_ID,
      assignedMaintenanceUserId: event.metadata.maintenanceUserId || this.SHARED_TEST_MAINTENANCE_ID,
      estimatedDuration: event.metadata.estimatedDuration || 60
    };
  }
}

export const sharedSchedulingService = new SharedSchedulingService();
export type { WorkOrderScheduleData };
