import { addDays, subDays, startOfDay, addHours, isSameDay, format } from 'date-fns';
import { UniversalEvent } from '@/types/eventTasks';
import { Role } from '@/types/roles';
import { TaskCompletionStamp } from '@/types/taskStamps';

// Utility function to check if a user role is authorized to complete a task
const isRoleAuthorizedToComplete = (userRole: Role, taskRole: Role): boolean => {
  if (userRole === taskRole) return true;
  if (userRole === 'operator' && (taskRole === 'leasing' || taskRole === 'maintenance')) return true;
  return false;
};

// Utility function to check if a task is unlocked based on dependencies
const isTaskUnlocked = (task: any, eventTasks: any[]): boolean => {
  if (!task.dependsOnTaskId) return true;
  const prerequisite = eventTasks.find(t => t.id === task.dependsOnTaskId);
  return prerequisite?.isComplete === true;
};

// Utility function to check if it's past midnight
const isPastMidnight = (): boolean => {
  const now = new Date();
  return now.getHours() >= 23 && now.getMinutes() >= 59;
};

// Centralized event store that all roles share
class SharedEventService {
  private events: UniversalEvent[] = [];
  private subscribers: (() => void)[] = [];

  constructor() {
    // Initialize with comprehensive test events for all event types
    this.initializeTestEvents();
  }

  private initializeTestEvents() {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const yesterday = subDays(today, 1);
    
    // Shared test resident and maintenance user
    const testResident = { role: 'resident' as const, userId: 'test-resident-001', name: 'Sarah Johnson' };
    const testMaintenance = { role: 'maintenance' as const, userId: 'test-maintenance-001', name: 'Mike Rodriguez' };
    const testOperator = { role: 'operator' as const, userId: 'test-operator-001', name: 'Lisa Chen' };
    
    // Create comprehensive seeded events for testing all workflows
    const seededEvents: UniversalEvent[] = [
      // Work Order - Today, shared between resident and maintenance
      {
        id: 'shared-wo-001',
        type: 'work-order',
        title: 'Fix Kitchen Faucet',
        description: 'Repair dripping kitchen faucet in Unit 417',
        date: today,
        time: '10:00',
        status: 'scheduled',
        priority: 'medium',
        category: 'Work Order',
        estimatedDuration: 120,
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
            title: 'Maintenance: Complete Work Order',
            description: 'Repair or replace the dripping kitchen faucet',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 90,
            dependsOnTaskId: 'shared-wo-001-task-1'
          },
          {
            id: 'shared-wo-001-task-3',
            title: 'Maintenance: Update Status',
            description: 'Update work order completion status',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10,
            dependsOnTaskId: 'shared-wo-001-task-2'
          },
          {
            id: 'shared-wo-001-task-4',
            title: 'Resident: Confirm Completion',
            description: 'Confirm work has been completed satisfactorily',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 5,
            dependsOnTaskId: 'shared-wo-001-task-3'
          }
        ],
        assignedUsers: [testResident, testMaintenance],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          workOrderId: 'WO-TEST-001',
          residentId: 'test-resident-001',
          maintenanceUserId: 'test-maintenance-001',
          unit: 'Unit 417',
          building: 'Building A'
        },
        taskCompletionStamps: []
      },

      // Message Follow-Up - Today, testing dependencies between operator and resident
      {
        id: 'message-followup-001',
        type: 'resident-message',
        title: 'Message Follow-Up: Lease Inquiry',
        description: 'Follow up on resident lease renewal inquiry',
        date: today,
        time: '14:30',
        status: 'scheduled',
        priority: 'medium',
        category: 'Communication',
        estimatedDuration: 30,
        tasks: [
          {
            id: 'message-followup-001-task-1',
            title: 'Resident: Acknowledge Message',
            description: 'Acknowledge receipt of lease renewal information',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 5
          },
          {
            id: 'message-followup-001-task-2',
            title: 'Operator: Reply to Message',
            description: 'Provide detailed response to resident inquiry',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15,
            dependsOnTaskId: 'message-followup-001-task-1'
          },
          {
            id: 'message-followup-001-task-3',
            title: 'Operator: Schedule Follow-up',
            description: 'Schedule follow-up call if needed',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 10,
            dependsOnTaskId: 'message-followup-001-task-2'
          }
        ],
        assignedUsers: [testResident, testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          messageId: 'MSG-TEST-001',
          residentId: 'test-resident-001',
          operatorId: 'test-operator-001',
          unit: 'Unit 417'
        },
        taskCompletionStamps: []
      },
      
      // Lease Signing - Today, shared between resident and operator
      {
        id: 'lease-sign-001',
        type: 'lease-signing',
        title: 'Lease Renewal Signing',
        description: 'Sign lease renewal documents for Unit 417',
        date: today,
        time: '14:00',
        status: 'scheduled',
        priority: 'high',
        category: 'Leasing',
        estimatedDuration: 60,
        tasks: [
          {
            id: 'lease-sign-001-task-1',
            title: 'Resident: Review Lease Terms',
            description: 'Review all lease terms and conditions',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 20
          },
          {
            id: 'lease-sign-001-task-2',
            title: 'Resident: Sign Lease Documents',
            description: 'Digitally sign lease agreement',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15,
            dependsOnTaskId: 'lease-sign-001-task-1'
          },
          {
            id: 'lease-sign-001-task-3',
            title: 'Leasing: Verify Documents',
            description: 'Verify all signatures and documentation',
            assignedRole: 'leasing',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10,
            dependsOnTaskId: 'lease-sign-001-task-2'
          }
        ],
        assignedUsers: [testResident, testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          leaseId: 'LEASE-2024-417',
          unit: 'Unit 417',
          building: 'Building A'
        },
        taskCompletionStamps: []
      },

      // Collections - Overdue (yesterday), urgent priority
      {
        id: 'collections-001',
        type: 'collections',
        title: 'Outstanding Rent Payment',
        description: 'Rent payment is overdue - immediate action required',
        date: yesterday,
        time: '09:00',
        status: 'overdue',
        priority: 'urgent',
        category: 'Financial',
        estimatedDuration: 30,
        tasks: [
          {
            id: 'collections-001-task-1',
            title: 'Resident: Review Outstanding Balance',
            description: 'Review current balance and charges',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          },
          {
            id: 'collections-001-task-2',
            title: 'Resident: Make Payment',
            description: 'Submit payment for outstanding balance',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15,
            dependsOnTaskId: 'collections-001-task-1'
          },
          {
            id: 'collections-001-task-3',
            title: 'Operator: Confirm Payment',
            description: 'Verify payment has been received',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 5,
            dependsOnTaskId: 'collections-001-task-2'
          }
        ],
        assignedUsers: [testResident, testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          amount: 1550,
          unit: 'Unit 417',
          paymentType: 'rent'
        },
        taskCompletionStamps: []
      },

      // Pet Registration - Today
      {
        id: 'pet-reg-001',
        type: 'pet-registration',
        title: 'Register New Pet: Luna',
        description: 'Complete pet registration for Luna (Golden Retriever)',
        date: today,
        time: '16:00',
        status: 'scheduled',
        priority: 'medium',
        category: 'Administrative',
        estimatedDuration: 45,
        tasks: [
          {
            id: 'pet-reg-001-task-1',
            title: 'Resident: Upload Pet Photos',
            description: 'Upload photos of pet for registration',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          },
          {
            id: 'pet-reg-001-task-2',
            title: 'Resident: Upload Vaccination Records',
            description: 'Provide current vaccination documentation',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'pet-reg-001-task-3',
            title: 'Resident: Pay Pet Fee',
            description: 'Submit pet deposit and monthly fee',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10,
            dependsOnTaskId: 'pet-reg-001-task-1'
          },
          {
            id: 'pet-reg-001-task-4',
            title: 'Operator: Approve Registration',
            description: 'Review and approve pet registration',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10,
            dependsOnTaskId: 'pet-reg-001-task-3'
          }
        ],
        assignedUsers: [testResident, testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          petName: 'Luna',
          petType: 'Dog',
          breed: 'Golden Retriever',
          unit: 'Unit 417'
        },
        taskCompletionStamps: []
      },

      // Community Event - Tomorrow
      {
        id: 'community-001',
        type: 'community-event',
        title: 'Rooftop BBQ & Social',
        description: 'Monthly community BBQ on the rooftop terrace',
        date: tomorrow,
        time: '18:00',
        status: 'scheduled',
        priority: 'low',
        category: 'Community Event',
        estimatedDuration: 180,
        tasks: [
          {
            id: 'community-001-task-1',
            title: 'Resident: RSVP for Event',
            description: 'Confirm attendance for community event',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 2
          },
          {
            id: 'community-001-task-2',
            title: 'Operator: Setup Event Space',
            description: 'Prepare venue and amenities',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 60
          },
          {
            id: 'community-001-task-3',
            title: 'Operator: Event Check-in',
            description: 'Manage event check-in process',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 30,
            dependsOnTaskId: 'community-001-task-2'
          }
        ],
        assignedUsers: [testResident, testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          location: 'Rooftop Terrace',
          maxAttendees: 50,
          building: 'Building A'
        },
        taskCompletionStamps: []
      }
    ];

    this.events = seededEvents;
    console.log(`SharedEventService: Initialized with ${this.events.length} test events`);
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
  getEventsForRole(role: Role): UniversalEvent[] {
    return this.events.filter(event => 
      event.assignedUsers.some(user => user.role === role)
    );
  }

  getEventsForRoleAndDate(role: Role, date: Date): UniversalEvent[] {
    return this.getEventsForRole(role).filter(event => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      return isSameDay(eventDate, date);
    });
  }

  // Get events for a specific date (all roles)
  getEventsForDate(date: Date): UniversalEvent[] {
    return this.events.filter(event => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      return isSameDay(eventDate, date);
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

  // Reschedule event
  rescheduleEvent(eventId: string, newDate: Date, newTime: string): boolean {
    try {
      const event = this.events.find(e => e.id === eventId);
      if (!event) {
        console.error('Event not found for reschedule:', eventId);
        return false;
      }

      event.date = newDate;
      event.time = newTime;
      event.rescheduledCount = (event.rescheduledCount || 0) + 1;
      event.updatedAt = new Date();

      this.notifySubscribers();
      console.log('Event rescheduled in shared service:', eventId);
      return true;
    } catch (error) {
      console.error('Error rescheduling event:', error);
      return false;
    }
  }

  completeTask(eventId: string, taskId: string, completedBy: Role): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return false;

    const task = event.tasks.find(t => t.id === taskId);
    if (!task) return false;

    // Check role permission using the authorization utility
    if (!isRoleAuthorizedToComplete(completedBy, task.assignedRole)) {
      console.warn(`User role ${completedBy} is not authorized to complete task assigned to ${task.assignedRole}`);
      return false;
    }

    // Check if task is unlocked (dependencies met)
    if (!isTaskUnlocked(task, event.tasks)) {
      console.warn(`Task ${taskId} is locked due to unmet dependencies`);
      return false;
    }

    // Complete the task
    task.isComplete = true;
    task.status = 'complete';
    task.completedAt = new Date();
    task.completedBy = completedBy;

    // Add completion stamp with improved logic
    const completedAt = new Date();
    const stamp: TaskCompletionStamp = {
      id: `${taskId}-completion-${Date.now()}`,
      taskId,
      taskName: task.title,
      eventId,
      eventType: event.type,
      completedAt,
      actualCompletionTime: completedAt,
      completedBy: completedBy,
      completedByName: this.getRoleDisplayName(completedBy),
      userId: this.getUserIdForRole(completedBy),
      canUndo: !isPastMidnight(),
      displayTime: format(completedAt, 'h:mm a'),
      permanent: isPastMidnight()
    };

    event.taskCompletionStamps = event.taskCompletionStamps || [];
    
    // Remove any existing stamp for this task (for re-completion)
    event.taskCompletionStamps = event.taskCompletionStamps.filter(
      existingStamp => existingStamp.taskId !== taskId
    );
    
    // Add the new stamp
    event.taskCompletionStamps.push(stamp);

    // Check if all required tasks are complete
    const allRequiredComplete = event.tasks
      .filter(task => task.isRequired)
      .every(task => task.isComplete);

    if (allRequiredComplete) {
      event.status = 'completed';
      event.completedAt = new Date();
      
      // Add final event completion stamp
      const eventCompletionStamp: TaskCompletionStamp = {
        id: `${eventId}-event-completion-${Date.now()}`,
        taskId: 'event-completion',
        taskName: `${event.title} Completed`,
        eventId,
        eventType: event.type,
        completedAt: new Date(),
        actualCompletionTime: new Date(),
        completedBy: completedBy,
        completedByName: this.getRoleDisplayName(completedBy),
        userId: this.getUserIdForRole(completedBy),
        canUndo: false,
        displayTime: format(new Date(), 'h:mm a'),
        permanent: true
      };
      
      event.taskCompletionStamps.push(eventCompletionStamp);
    }

    event.updatedAt = new Date();
    this.notifySubscribers();
    console.log('Task completed with timestamp:', stamp);
    return true;
  }

  // Undo task completion
  undoTaskCompletion(eventId: string, taskId: string): boolean {
    try {
      const event = this.events.find(e => e.id === eventId);
      if (!event) {
        console.error('Event not found for task undo:', eventId);
        return false;
      }

      const task = event.tasks.find(t => t.id === taskId);
      if (!task) {
        console.error('Task not found for undo:', taskId);
        return false;
      }

      // Check if undo is allowed (not past midnight and not permanent)
      const stamp = event.taskCompletionStamps.find(s => s.taskId === taskId);
      if (stamp && (stamp.permanent || isPastMidnight())) {
        console.log('Cannot undo task - it is permanent or past midnight');
        return false;
      }

      // Reset task status
      task.isComplete = false;
      task.status = 'available';
      task.completedAt = undefined;
      task.completedBy = undefined;

      // Remove completion stamp and any event completion stamps
      event.taskCompletionStamps = event.taskCompletionStamps.filter(
        stamp => stamp.taskId !== taskId && stamp.taskId !== 'event-completion'
      );

      // Reset event status if it was completed
      if (event.status === 'completed') {
        event.status = 'in-progress';
        event.completedAt = undefined;
      }

      event.updatedAt = new Date();
      this.notifySubscribers();
      console.log('Task completion undone and timestamp removed:', taskId);
      return true;
    } catch (error) {
      console.error('Error undoing task completion:', error);
      return false;
    }
  }

  private getRoleDisplayName(role: Role): string {
    const roleNames = {
      'resident': 'Sarah Johnson',
      'operator': 'Lisa Chen', 
      'maintenance': 'Mike Rodriguez',
      'prospect': 'Prospect User',
      'vendor': 'Vendor User',
      'leasing': 'Leasing Agent'
    };
    return roleNames[role] || role;
  }

  private getUserIdForRole(role: Role): string {
    const userIds = {
      'resident': 'test-resident-001',
      'operator': 'test-operator-001', 
      'maintenance': 'test-maintenance-001',
      'prospect': 'test-prospect-001',
      'vendor': 'test-vendor-001',
      'leasing': 'test-leasing-001'
    };
    return userIds[role] || 'system';
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

export const sharedEventService = new SharedEventService();
export { isRoleAuthorizedToComplete, isTaskUnlocked };
