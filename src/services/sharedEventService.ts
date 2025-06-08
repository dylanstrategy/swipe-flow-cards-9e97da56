
import { addDays, subDays, startOfDay, addHours } from 'date-fns';
import { UniversalEvent } from '@/types/eventTasks';
import { format, isSameDay } from 'date-fns';

// Centralized event store that all roles share
class SharedEventService {
  private events: UniversalEvent[] = [];
  private subscribers: (() => void)[] = [];

  constructor() {
    // Initialize with some test events including shared work orders
    this.initializeTestEvents();
  }

  private initializeTestEvents() {
    const today = new Date();
    
    // Create some shared events that appear for both resident and maintenance
    const sharedEvents: UniversalEvent[] = [
      {
        id: 'shared-wo-001',
        type: 'work-order',
        title: 'Fix Kitchen Faucet',
        description: 'Repair dripping kitchen faucet in Test Unit 417',
        date: today,
        time: '10:00',
        status: 'scheduled',
        priority: 'medium',
        category: 'Work Order',
        tasks: [
          {
            id: 'shared-wo-001-task-1',
            title: 'Resident: Grant Access',
            description: 'Provide access to maintenance team',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 5
          },
          {
            id: 'shared-wo-001-task-2',
            title: 'Maintenance: Fix Faucet',
            description: 'Repair or replace the dripping kitchen faucet',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 45
          },
          {
            id: 'shared-wo-001-task-3',
            title: 'Maintenance: Clean Up',
            description: 'Clean work area and test repair',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          }
        ],
        assignedUsers: [
          { role: 'resident', userId: 'test-resident-001', name: 'Test Resident' },
          { role: 'maintenance', userId: 'test-maintenance-001', name: 'Test Maintenance User' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          workOrderId: 'WO-TEST-001',
          residentId: 'test-resident-001',
          maintenanceUserId: 'test-maintenance-001',
          unit: 'Test Unit 417',
          building: 'Test Building A',
          estimatedDuration: 60
        },
        taskCompletionStamps: []
      }
    ];

    this.events = sharedEvents;
  }

  // Subscribe to changes
  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(l => l !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(listener => listener());
  }

  // Get events for specific role
  getEventsForRole(role: 'resident' | 'maintenance' | 'operator'): UniversalEvent[] {
    if (role === 'operator') {
      // Operators can see all events
      return [...this.events];
    }
    
    // Filter events based on role assignment or tasks
    return this.events.filter(event => {
      // Check if user is directly assigned
      const hasAssignedRole = event.assignedUsers?.some(user => user.role === role);
      
      // Check if event has tasks for this role
      const hasRoleTasks = event.tasks?.some(task => task.assignedRole === role);
      
      return hasAssignedRole || hasRoleTasks;
    });
  }

  // Get events for specific date
  getEventsForDate(date: Date): UniversalEvent[] {
    return this.events.filter(event => {
      try {
        const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
        return isSameDay(eventDate, date);
      } catch (error) {
        console.error('Date comparison error:', error);
        return false;
      }
    });
  }

  // Get events for role and date
  getEventsForRoleAndDate(role: 'resident' | 'maintenance' | 'operator', date: Date): UniversalEvent[] {
    const roleEvents = this.getEventsForRole(role);
    return roleEvents.filter(event => {
      try {
        const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
        return isSameDay(eventDate, date);
      } catch (error) {
        console.error('Date comparison error:', error);
        return false;
      }
    });
  }

  // Get all events
  getAllEvents(): UniversalEvent[] {
    return [...this.events];
  }

  // Add event
  addEvent(event: UniversalEvent): boolean {
    try {
      // Check for duplicates
      const exists = this.events.some(e => e.id === event.id);
      if (exists) {
        console.warn('Event with this ID already exists:', event.id);
        return false;
      }
      
      this.events.push(event);
      this.notifySubscribers();
      console.log('Event added to shared service:', event.id);
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      return false;
    }
  }

  // Update event (maintains cross-role sync)
  updateEvent(eventId: string, updatedEvent: Partial<UniversalEvent>): boolean {
    try {
      const index = this.events.findIndex(event => event.id === eventId);
      if (index === -1) {
        console.error('Event not found for update:', eventId);
        return false;
      }
      
      this.events[index] = { 
        ...this.events[index], 
        ...updatedEvent,
        updatedAt: new Date()
      };
      
      this.notifySubscribers();
      console.log('Event updated in shared service:', eventId);
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  }

  // Complete task (syncs across all roles)
  completeTask(eventId: string, taskId: string, userRole: string): boolean {
    try {
      const event = this.getEventById(eventId);
      if (!event) {
        console.error('Event not found for task completion:', eventId);
        return false;
      }

      const task = event.tasks?.find(t => t.id === taskId);
      if (!task) {
        console.error('Task not found for completion:', taskId);
        return false;
      }

      // Check if user has permission to complete this task
      if (task.assignedRole !== userRole) {
        console.error('User does not have permission to complete this task');
        return false;
      }

      // Mark task as complete
      task.isComplete = true;
      task.status = 'complete';

      // Add completion stamp
      if (!event.taskCompletionStamps) {
        event.taskCompletionStamps = [];
      }

      event.taskCompletionStamps.push({
        id: `${taskId}-completion-${Date.now()}`,
        taskId,
        taskName: task.title,
        eventId,
        eventType: event.type,
        completedAt: new Date(),
        completedBy: userRole as any,
        completedByName: `Test ${userRole} User`,
        canUndo: true
      });

      // Check if all required tasks are complete
      const allRequiredComplete = event.tasks
        ?.filter(t => t.isRequired)
        .every(t => t.isComplete);

      if (allRequiredComplete) {
        event.status = 'completed';
      }

      this.updateEvent(eventId, event);
      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      return false;
    }
  }

  // Undo task completion
  undoTaskCompletion(eventId: string, taskId: string): boolean {
    try {
      const event = this.getEventById(eventId);
      if (!event) {
        console.error('Event not found for task undo:', eventId);
        return false;
      }

      const task = event.tasks?.find(t => t.id === taskId);
      if (!task) {
        console.error('Task not found for undo:', taskId);
        return false;
      }

      // Mark task as incomplete
      task.isComplete = false;
      task.status = 'available';

      // Remove completion stamp
      if (event.taskCompletionStamps) {
        event.taskCompletionStamps = event.taskCompletionStamps.filter(
          stamp => stamp.taskId !== taskId
        );
      }

      // Update event status if it was completed
      if (event.status === 'completed') {
        event.status = 'scheduled';
      }

      this.updateEvent(eventId, event);
      return true;
    } catch (error) {
      console.error('Error undoing task completion:', error);
      return false;
    }
  }

  // Reschedule event
  rescheduleEvent(eventId: string, newDate: Date, newTime: string): boolean {
    try {
      const event = this.getEventById(eventId);
      if (!event) {
        console.error('Event not found for reschedule:', eventId);
        return false;
      }

      const updatedEvent = {
        ...event,
        date: newDate,
        time: newTime,
        rescheduledCount: (event.rescheduledCount || 0) + 1
      };

      return this.updateEvent(eventId, updatedEvent);
    } catch (error) {
      console.error('Error rescheduling event:', error);
      return false;
    }
  }

  // Remove event
  removeEvent(eventId: string): boolean {
    try {
      const index = this.events.findIndex(event => event.id === eventId);
      if (index === -1) {
        console.error('Event not found for removal:', eventId);
        return false;
      }
      
      this.events.splice(index, 1);
      this.notifySubscribers();
      console.log('Event removed from shared service:', eventId);
      return true;
    } catch (error) {
      console.error('Error removing event:', error);
      return false;
    }
  }

  // Get event by ID
  getEventById(eventId: string): UniversalEvent | undefined {
    return this.events.find(event => event.id === eventId);
  }
}

// Export singleton instance
export const sharedEventService = new SharedEventService();
