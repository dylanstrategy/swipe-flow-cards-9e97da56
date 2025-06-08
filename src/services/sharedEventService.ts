
import { addDays, subDays, startOfDay, addHours, isSameDay, format } from 'date-fns';
import { UniversalEvent } from '@/types/eventTasks';
import { Role } from '@/types/roles';
import { TaskCompletionStamp } from '@/types/taskStamps';

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
    
    // Shared test users
    const testResident = { role: 'resident' as const, userId: 'test-resident-001', name: 'Sarah Johnson' };
    const testMaintenance = { role: 'maintenance' as const, userId: 'test-maintenance-001', name: 'Mike Rodriguez' };
    const testOperator = { role: 'operator' as const, userId: 'test-operator-001', name: 'Lisa Chen' };
    
    // Create all 17 event types for comprehensive testing
    const seededEvents: UniversalEvent[] = [
      // 1. Move-In Event
      {
        id: 'move-in-001',
        type: 'move-in',
        title: 'Move-In: Unit 417',
        description: 'Resident move-in process for Sarah Johnson',
        date: today,
        time: '09:00',
        status: 'scheduled',
        priority: 'high',
        category: 'Move-In',
        estimatedDuration: 180,
        tasks: [
          {
            id: 'move-in-001-task-1',
            title: 'Resident: Complete Move-In Inspection',
            description: 'Walk through unit and document any pre-existing conditions',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 30
          },
          {
            id: 'move-in-001-task-2',
            title: 'Operator: Process Move-In Documentation',
            description: 'Review and file all move-in paperwork',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 20
          }
        ],
        assignedUsers: [testResident, testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { unit: 'Unit 417', building: 'Building A' },
        taskCompletionStamps: []
      },

      // 2. Move-Out Event
      {
        id: 'move-out-001',
        type: 'move-out',
        title: 'Move-Out: Unit 305',
        description: 'Final move-out inspection and key return',
        date: today,
        time: '10:30',
        status: 'scheduled',
        priority: 'medium',
        category: 'Move-Out',
        estimatedDuration: 120,
        tasks: [
          {
            id: 'move-out-001-task-1',
            title: 'Resident: Return Keys and Access Cards',
            description: 'Return all keys, fobs, and access cards',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          },
          {
            id: 'move-out-001-task-2',
            title: 'Operator: Conduct Final Inspection',
            description: 'Document unit condition and damages',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 45
          }
        ],
        assignedUsers: [testResident, testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { unit: 'Unit 305', building: 'Building B' },
        taskCompletionStamps: []
      },

      // 3. Lease Signing Event
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
        metadata: { unit: 'Unit 417', leaseType: 'renewal' },
        taskCompletionStamps: []
      },

      // 4. Work Order Event
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
          building: 'Building A'
        },
        taskCompletionStamps: []
      },

      // 5. Inspection Event
      {
        id: 'inspection-001',
        type: 'inspection',
        title: 'Annual Unit Inspection',
        description: 'Routine annual inspection of Unit 420',
        date: today,
        time: '11:00',
        status: 'scheduled',
        priority: 'medium',
        category: 'Inspection',
        estimatedDuration: 90,
        tasks: [
          {
            id: 'inspection-001-task-1',
            title: 'Resident: Prepare Unit for Inspection',
            description: 'Ensure unit is accessible for inspection',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'inspection-001-task-2',
            title: 'Maintenance: Conduct Inspection',
            description: 'Complete thorough unit inspection checklist',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 60
          }
        ],
        assignedUsers: [testResident, testMaintenance],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { unit: 'Unit 420', inspectionType: 'annual' },
        taskCompletionStamps: []
      },

      // 6. Community Event
      {
        id: 'community-001',
        type: 'community-event',
        title: 'Summer BBQ & Pool Party',
        description: 'Community gathering at the pool area',
        date: today,
        time: '17:00',
        status: 'scheduled',
        priority: 'low',
        category: 'Community Event',
        estimatedDuration: 180,
        tasks: [
          {
            id: 'community-001-task-1',
            title: 'Operator: Set Up Event Space',
            description: 'Arrange tables, chairs, and decorations',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 60
          }
        ],
        assignedUsers: [testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { location: 'Pool Area', capacity: 50 },
        taskCompletionStamps: []
      },

      // 7. Message Event
      {
        id: 'message-001',
        type: 'message',
        title: 'Urgent: Water Shutoff Notice',
        description: 'Building-wide water maintenance scheduled',
        date: today,
        time: '08:00',
        status: 'scheduled',
        priority: 'urgent',
        category: 'Management',
        estimatedDuration: 30,
        tasks: [
          {
            id: 'message-001-task-1',
            title: 'Operator: Send Building Notice',
            description: 'Distribute water shutoff notice to all residents',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 20
          }
        ],
        assignedUsers: [testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { messageType: 'building-notice', urgency: 'high' },
        taskCompletionStamps: []
      },

      // 8. Collections Event
      {
        id: 'collections-001',
        type: 'collections',
        title: 'Late Rent Follow-Up',
        description: 'Follow up on overdue rent payment',
        date: today,
        time: '13:00',
        status: 'scheduled',
        priority: 'high',
        category: 'Collections',
        estimatedDuration: 45,
        tasks: [
          {
            id: 'collections-001-task-1',
            title: 'Operator: Contact Resident',
            description: 'Call resident regarding overdue payment',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'collections-001-task-2',
            title: 'Operator: Document Contact Attempt',
            description: 'Log contact attempt and response',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          }
        ],
        assignedUsers: [testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { amountDue: 1850, daysPastDue: 7 },
        taskCompletionStamps: []
      },

      // 9. Promotional Event
      {
        id: 'promotional-001',
        type: 'promotional',
        title: 'Pet Grooming Special Offer',
        description: '20% off mobile pet grooming services',
        date: today,
        time: '12:00',
        status: 'scheduled',
        priority: 'low',
        category: 'Promotional',
        estimatedDuration: 60,
        tasks: [
          {
            id: 'promotional-001-task-1',
            title: 'Resident: Review Offer Details',
            description: 'Check promotional offer and terms',
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
        metadata: { discount: 20, validUntil: '2025-06-15' },
        taskCompletionStamps: []
      },

      // 10. Poll Event
      {
        id: 'poll-001',
        type: 'poll',
        title: 'Community Amenity Preferences',
        description: 'Vote on new amenity priorities',
        date: today,
        time: '15:00',
        status: 'scheduled',
        priority: 'low',
        category: 'Poll',
        estimatedDuration: 15,
        tasks: [
          {
            id: 'poll-001-task-1',
            title: 'Resident: Submit Vote',
            description: 'Vote on preferred amenity improvements',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 10
          }
        ],
        assignedUsers: [testResident],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { pollType: 'amenity-preference', deadline: '2025-06-20' },
        taskCompletionStamps: []
      },

      // 11. Pet Registration Event
      {
        id: 'pet-reg-001',
        type: 'pet-registration',
        title: 'Pet Registration: Buddy',
        description: 'Register new pet with building management',
        date: today,
        time: '16:00',
        status: 'scheduled',
        priority: 'medium',
        category: 'Pet Registration',
        estimatedDuration: 30,
        tasks: [
          {
            id: 'pet-reg-001-task-1',
            title: 'Resident: Submit Pet Documents',
            description: 'Provide vaccination records and registration',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'pet-reg-001-task-2',
            title: 'Operator: Process Registration',
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
        metadata: { petName: 'Buddy', petType: 'dog', breed: 'Golden Retriever' },
        taskCompletionStamps: []
      },

      // 12. Tour Appointment Event
      {
        id: 'tour-001',
        type: 'tour-appointment',
        title: 'Unit Tour: Unit 523',
        description: 'Show available unit to prospective tenant',
        date: today,
        time: '18:00',
        status: 'scheduled',
        priority: 'medium',
        category: 'Tour Appointment',
        estimatedDuration: 45,
        tasks: [
          {
            id: 'tour-001-task-1',
            title: 'Operator: Prepare Unit for Tour',
            description: 'Ensure unit is clean and ready for showing',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'tour-001-task-2',
            title: 'Operator: Conduct Tour',
            description: 'Show unit and answer prospect questions',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 30
          }
        ],
        assignedUsers: [testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { unit: 'Unit 523', prospectName: 'John Smith' },
        taskCompletionStamps: []
      },

      // 13. Services Event
      {
        id: 'services-001',
        type: 'services',
        title: 'Package Delivery Assistance',
        description: 'Large package delivery coordination',
        date: today,
        time: '14:30',
        status: 'scheduled',
        priority: 'medium',
        category: 'Services',
        estimatedDuration: 30,
        tasks: [
          {
            id: 'services-001-task-1',
            title: 'Operator: Coordinate Delivery',
            description: 'Arrange package delivery to resident unit',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 20
          }
        ],
        assignedUsers: [testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { packageSize: 'large', carrier: 'FedEx' },
        taskCompletionStamps: []
      },

      // 14. Lease Violation Event
      {
        id: 'violation-001',
        type: 'lease-violation',
        title: 'Noise Complaint Follow-Up',
        description: 'Address reported noise violation',
        date: today,
        time: '19:00',
        status: 'scheduled',
        priority: 'high',
        category: 'Lease Violation',
        estimatedDuration: 45,
        tasks: [
          {
            id: 'violation-001-task-1',
            title: 'Operator: Document Violation',
            description: 'Record violation details and evidence',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 20
          },
          {
            id: 'violation-001-task-2',
            title: 'Operator: Issue Warning Notice',
            description: 'Prepare and deliver violation notice',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          }
        ],
        assignedUsers: [testOperator],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { violationType: 'noise', reportedBy: 'Unit 418' },
        taskCompletionStamps: []
      },

      // 15. Resident Complaint Event
      {
        id: 'complaint-001',
        type: 'resident-complaint',
        title: 'AC Not Working Properly',
        description: 'Resident complaint about air conditioning issues',
        date: today,
        time: '15:30',
        status: 'scheduled',
        priority: 'high',
        category: 'Resident Complaint',
        estimatedDuration: 60,
        tasks: [
          {
            id: 'complaint-001-task-1',
            title: 'Operator: Log Complaint',
            description: 'Document complaint details and urgency',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          },
          {
            id: 'complaint-001-task-2',
            title: 'Maintenance: Assess Issue',
            description: 'Investigate AC problem and determine solution',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 45
          }
        ],
        assignedUsers: [testOperator, testMaintenance],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: { complaintType: 'HVAC', unit: 'Unit 417' },
        taskCompletionStamps: []
      },

      // 16. Amenity Reservation Event
      {
        id: 'amenity-001',
        type: 'amenity-reservation',
        title: 'Gym Room Reservation',
        description: 'Private gym reservation for workout session',
        date: today,
        time: '07:00',
        status: 'scheduled',
        priority: 'low',
        category: 'Amenity Reservation',
        estimatedDuration: 90,
        tasks: [
          {
            id: 'amenity-001-task-1',
            title: 'Resident: Check-In for Reservation',
            description: 'Confirm arrival and access amenity',
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
        metadata: { amenity: 'Gym', reservationTime: '07:00-08:30' },
        taskCompletionStamps: []
      },

      // 17. Vendor Visit Event
      {
        id: 'vendor-001',
        type: 'vendor-visit',
        title: 'Internet Installation',
        description: 'Comcast technician visit for internet setup',
        date: today,
        time: '13:30',
        status: 'scheduled',
        priority: 'medium',
        category: 'Vendor Visit',
        estimatedDuration: 120,
        tasks: [
          {
            id: 'vendor-001-task-1',
            title: 'Resident: Grant Vendor Access',
            description: 'Provide access to vendor for installation',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          },
          {
            id: 'vendor-001-task-2',
            title: 'Operator: Monitor Vendor Visit',
            description: 'Ensure vendor follows building protocols',
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
        metadata: { vendor: 'Comcast', serviceType: 'Internet Installation' },
        taskCompletionStamps: []
      }
    ];

    this.events = seededEvents;
    console.log('SharedEventService: Initialized with', this.events.length, 'comprehensive test events for all 17 types');
  }

  // Subscribe to event changes
  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers of changes
  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  // Get all events
  getAllEvents(): UniversalEvent[] {
    return [...this.events];
  }

  // Get events for a specific role
  getEventsForRole(role: Role): UniversalEvent[] {
    return this.events.filter(event => 
      event.assignedUsers.some(user => user.role === role)
    );
  }

  // Get events for a specific date
  getEventsForDate(date: Date): UniversalEvent[] {
    return this.events.filter(event => 
      isSameDay(event.date, date)
    );
  }

  // Get events for a specific role and date - UNIFIED METHOD FOR SYNC
  getEventsForRoleAndDate(role: Role, date: Date): UniversalEvent[] {
    console.log(`SharedEventService: Getting events for role ${role} on ${format(date, 'yyyy-MM-dd')}`);
    const roleEvents = this.getEventsForRole(role);
    const dateFilteredEvents = roleEvents.filter(event => 
      isSameDay(event.date, date)
    );
    console.log(`SharedEventService: Found ${dateFilteredEvents.length} events for ${role} on ${format(date, 'yyyy-MM-dd')}`);
    return dateFilteredEvents;
  }

  // Add or update event
  updateEvent(eventId: string, updatedEvent: Partial<UniversalEvent>) {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...updatedEvent };
      this.notifySubscribers();
      console.log('SharedEventService: Updated event', eventId);
    }
  }

  // Reschedule event
  rescheduleEvent(eventId: string, newDate: Date, newTime: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.date = newDate;
      event.time = newTime;
      event.rescheduledCount = (event.rescheduledCount || 0) + 1;
      event.updatedAt = new Date();
      this.notifySubscribers();
      console.log('SharedEventService: Rescheduled event', eventId, 'to', newTime);
      return true;
    }
    return false;
  }

  // Add task completion stamp to event
  addTaskCompletionStamp(eventId: string, stamp: TaskCompletionStamp) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      if (!event.taskCompletionStamps) {
        event.taskCompletionStamps = [];
      }
      // Remove any existing stamp for the same task
      event.taskCompletionStamps = event.taskCompletionStamps.filter(s => s.taskId !== stamp.taskId);
      // Add the new stamp
      event.taskCompletionStamps.push(stamp);
      this.notifySubscribers();
      console.log('SharedEventService: Added task completion stamp to event', eventId);
    }
  }

  // Remove task completion stamp from event
  removeTaskCompletionStamp(eventId: string, taskId: string) {
    const event = this.events.find(e => e.id === eventId);
    if (event && event.taskCompletionStamps) {
      event.taskCompletionStamps = event.taskCompletionStamps.filter(s => s.taskId !== taskId);
      this.notifySubscribers();
      console.log('SharedEventService: Removed task completion stamp from event', eventId);
    }
  }
}

// Export singleton instance
export const sharedEventService = new SharedEventService();
