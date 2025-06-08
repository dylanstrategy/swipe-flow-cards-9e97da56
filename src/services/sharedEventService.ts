import { addDays, subDays, startOfDay, addHours } from 'date-fns';
import { UniversalEvent } from '@/types/eventTasks';
import { format, isSameDay } from 'date-fns';

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
            estimatedDuration: 90
          },
          {
            id: 'shared-wo-001-task-3',
            title: 'Maintenance: Update Status',
            description: 'Update work order completion status',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          },
          {
            id: 'shared-wo-001-task-4',
            title: 'Resident: Confirm Completion',
            description: 'Confirm work has been completed satisfactorily',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 5
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
          building: 'Building A',
          estimatedDuration: 120
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
            estimatedDuration: 15
          },
          {
            id: 'lease-sign-001-task-3',
            title: 'Operator: Verify Documents',
            description: 'Verify all signatures and documentation',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
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
            estimatedDuration: 15
          },
          {
            id: 'collections-001-task-3',
            title: 'Operator: Confirm Payment',
            description: 'Verify payment has been received',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 5
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
            estimatedDuration: 10
          },
          {
            id: 'pet-reg-001-task-4',
            title: 'Operator: Approve Registration',
            description: 'Review and approve pet registration',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
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
            estimatedDuration: 30
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
      },

      // Inspection - Today, shared between resident and operator
      {
        id: 'inspection-001',
        type: 'inspection',
        title: 'Annual Unit Inspection',
        description: 'Annual safety and maintenance inspection',
        date: today,
        time: '11:30',
        status: 'scheduled',
        priority: 'medium',
        category: 'Maintenance',
        estimatedDuration: 60,
        tasks: [
          {
            id: 'inspection-001-task-1',
            title: 'Resident: Prepare Unit',
            description: 'Ensure unit is accessible for inspection',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'inspection-001-task-2',
            title: 'Operator: Perform Inspection',
            description: 'Complete thorough unit inspection',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 45
          },
          {
            id: 'inspection-001-task-3',
            title: 'Operator: Generate Report',
            description: 'Create and submit inspection report',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          }
        ],
        assignedUsers: [testResident, testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          inspectionType: 'annual',
          unit: 'Unit 417',
          building: 'Building A'
        },
        taskCompletionStamps: []
      },

      // Poll - Today, community wide
      {
        id: 'poll-001',
        type: 'poll',
        title: 'Pool Hours Survey',
        description: 'Vote on preferred pool operating hours for summer',
        date: today,
        time: '12:00',
        status: 'scheduled',
        priority: 'low',
        category: 'Community',
        estimatedDuration: 15,
        tasks: [
          {
            id: 'poll-001-task-1',
            title: 'Operator: Create Poll',
            description: 'Create community poll with options',
            assignedRole: 'operator',
            isComplete: true,
            isRequired: true,
            status: 'complete',
            estimatedDuration: 10
          },
          {
            id: 'poll-001-task-2',
            title: 'Resident: Cast Vote',
            description: 'Submit vote in community poll',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 5
          }
        ],
        assignedUsers: [testResident, testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          pollType: 'multiple-choice',
          options: ['6AM-10PM', '7AM-9PM', '8AM-8PM'],
          building: 'Building A'
        },
        taskCompletionStamps: [
          {
            id: 'poll-001-task-1-completion-1703123456789',
            taskId: 'poll-001-task-1',
            taskName: 'Operator: Create Poll',
            eventId: 'poll-001',
            eventType: 'poll',
            completedAt: new Date(),
            completedBy: testOperator,
            completedByName: 'Lisa Chen',
            canUndo: true
          }
        ]
      },

      // Promotional Offer - Today
      {
        id: 'promo-001',
        type: 'promotional',
        title: 'Free Gym Membership',
        description: '3 months free gym membership for lease renewals',
        date: today,
        time: '08:00',
        status: 'scheduled',
        priority: 'low',
        category: 'Marketing',
        estimatedDuration: 10,
        tasks: [
          {
            id: 'promo-001-task-1',
            title: 'Resident: Review Offer',
            description: 'Review promotional offer details',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 5
          },
          {
            id: 'promo-001-task-2',
            title: 'Resident: Redeem Offer',
            description: 'Redeem promotional offer if interested',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 5
          }
        ],
        assignedUsers: [testResident],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          offerType: 'gym-membership',
          validUntil: addDays(today, 30).toISOString(),
          building: 'Building A'
        },
        taskCompletionStamps: []
      },

      // Unit Turn - Today, maintenance only
      {
        id: 'unit-turn-001',
        type: 'unit-turn',
        title: 'Unit 412 Turnover',
        description: 'Complete unit turnover for new resident move-in',
        date: today,
        time: '08:00',
        status: 'in-progress',
        priority: 'high',
        category: 'Maintenance',
        estimatedDuration: 480,
        tasks: [
          {
            id: 'unit-turn-001-task-1',
            title: 'Maintenance: Deep Cleaning',
            description: 'Complete deep cleaning of unit',
            assignedRole: 'maintenance',
            isComplete: true,
            isRequired: true,
            status: 'complete',
            estimatedDuration: 180
          },
          {
            id: 'unit-turn-001-task-2',
            title: 'Maintenance: Paint Touch-ups',
            description: 'Complete any necessary painting',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'in-progress',
            estimatedDuration: 120
          },
          {
            id: 'unit-turn-001-task-3',
            title: 'Maintenance: Final Inspection',
            description: 'Conduct final quality inspection',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 30
          },
          {
            id: 'unit-turn-001-task-4',
            title: 'Operator: Mark Unit Ready',
            description: 'Update unit status to available',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 5
          }
        ],
        assignedUsers: [testMaintenance, testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          unit: 'Unit 412',
          building: 'Building A',
          nextMoveInDate: addDays(today, 3).toISOString()
        },
        taskCompletionStamps: [
          {
            id: 'unit-turn-001-task-1-completion-1703123456789',
            taskId: 'unit-turn-001-task-1',
            taskName: 'Maintenance: Deep Cleaning',
            eventId: 'unit-turn-001',
            eventType: 'unit-turn',
            completedAt: new Date(),
            completedBy: testMaintenance,
            completedByName: 'Mike Rodriguez',
            canUndo: true
          }
        ]
      }
    ];

    this.events = seededEvents;
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
