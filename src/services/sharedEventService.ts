
import { addDays, subDays, startOfDay, addHours } from 'date-fns';
import { UniversalEvent } from '@/types/eventTasks';

// Centralized event store that all roles share
class SharedEventService {
  private events: UniversalEvent[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.initializeTestEvents();
  }

  private initializeTestEvents() {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const tomorrow = addDays(today, 1);

    this.events = [
      // Today's Events (for Today tab and Schedule tab consistency)
      {
        id: 'move-in-001',
        type: 'move-in',
        title: 'Move-In Process - Unit 4B',
        description: 'Complete move-in checklist for new resident Sarah Johnson',
        date: today,
        time: '09:00',
        status: 'scheduled',
        priority: 'high',
        category: 'Resident Services',
        tasks: [
          {
            id: 'move-in-001-keys',
            title: 'Distribute Keys & Access Cards',
            description: 'Provide unit keys, mailbox key, and building access card',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          },
          {
            id: 'move-in-001-walkthrough',
            title: 'Unit Walkthrough',
            description: 'Complete walkthrough inspection with resident',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 30,
            dependencies: ['Distribute Keys & Access Cards']
          },
          {
            id: 'move-in-001-utilities',
            title: 'Verify Utilities Setup',
            description: 'Confirm electricity, water, and internet are active',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'move-in-001-welcome',
            title: 'Welcome Package Delivery',
            description: 'Deliver welcome package and community information',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 5
          }
        ],
        assignedUsers: [
          { role: 'resident', name: 'Sarah Johnson' },
          { role: 'operator', name: 'Alex Smith' },
          { role: 'maintenance', name: 'Mike Wilson' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          unit: '4B',
          building: 'Building A',
          residentName: 'Sarah Johnson',
          residentId: 'res-001'
        },
        taskCompletionStamps: []
      },

      {
        id: 'lease-signing-002',
        type: 'lease-signing',
        title: 'Lease Signing - Unit 2C',
        description: 'Mike Chen lease renewal signing appointment',
        date: today,
        time: '10:30',
        status: 'scheduled',
        priority: 'medium',
        category: 'Leasing',
        tasks: [
          {
            id: 'lease-002-review',
            title: 'Review Lease Terms',
            description: 'Go through lease agreement with resident',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 20
          },
          {
            id: 'lease-002-sign',
            title: 'Sign Documents',
            description: 'Complete signature process for all lease documents',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15,
            dependencies: ['Review Lease Terms']
          },
          {
            id: 'lease-002-payment',
            title: 'Process Security Deposit',
            description: 'Collect and process security deposit payment',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          }
        ],
        assignedUsers: [
          { role: 'resident', name: 'Mike Chen' },
          { role: 'operator', name: 'Lisa Rodriguez' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          unit: '2C',
          building: 'Building B',
          residentName: 'Mike Chen',
          residentId: 'res-002'
        },
        taskCompletionStamps: []
      },

      {
        id: 'work-order-003',
        type: 'work-order',
        title: 'Work Order - Kitchen Faucet Repair',
        description: 'Repair leaky kitchen faucet in Unit 3A',
        date: today,
        time: '14:00',
        status: 'scheduled',
        priority: 'urgent',
        category: 'Maintenance',
        tasks: [
          {
            id: 'work-003-assess',
            title: 'Assess Damage',
            description: 'Inspect faucet and determine repair scope',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'work-003-parts',
            title: 'Gather Parts & Tools',
            description: 'Collect necessary replacement parts and tools',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10,
            dependencies: ['Assess Damage']
          },
          {
            id: 'work-003-repair',
            title: 'Complete Repair',
            description: 'Fix the leaky faucet and test functionality',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 45,
            dependencies: ['Gather Parts & Tools']
          },
          {
            id: 'work-003-cleanup',
            title: 'Clean Work Area',
            description: 'Clean up work area and dispose of old parts',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10,
            dependencies: ['Complete Repair']
          }
        ],
        assignedUsers: [
          { role: 'resident', name: 'Emily Davis' },
          { role: 'maintenance', name: 'Tom Martinez' },
          { role: 'operator', name: 'Alex Smith' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          unit: '3A',
          building: 'Building C',
          residentName: 'Emily Davis',
          residentId: 'res-003',
          workOrderType: 'plumbing'
        },
        taskCompletionStamps: []
      },

      {
        id: 'amenity-006',
        type: 'amenity-reservation',
        title: 'Pool Reservation - Weekend',
        description: 'Private pool access for Johnson family',
        date: today,
        time: '16:00',
        status: 'scheduled',
        priority: 'low',
        category: 'Amenities',
        tasks: [
          {
            id: 'amenity-006-setup',
            title: 'Setup Pool Area',
            description: 'Prepare pool area for private reservation',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'amenity-006-checkin',
            title: 'Check-in Residents',
            description: 'Welcome residents and explain pool rules',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 5,
            dependencies: ['Setup Pool Area']
          }
        ],
        assignedUsers: [
          { role: 'resident', name: 'Sarah Johnson' },
          { role: 'operator', name: 'Lisa Rodriguez' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          amenityType: 'pool',
          residentName: 'Sarah Johnson',
          residentId: 'res-001',
          duration: '2 hours'
        },
        taskCompletionStamps: []
      },

      {
        id: 'message-008',
        type: 'message',
        title: 'Maintenance Follow-up',
        description: 'Follow-up message regarding AC repair completion',
        date: today,
        time: '13:30',
        status: 'scheduled', // Fixed: changed from "pending" to "scheduled"
        priority: 'medium',
        category: 'Communication',
        tasks: [
          {
            id: 'message-008-respond',
            title: 'Respond to Message',
            description: 'Review and respond to resident inquiry',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          }
        ],
        assignedUsers: [
          { role: 'resident', name: 'Emily Davis' },
          { role: 'operator', name: 'Alex Smith' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          messageType: 'follow-up',
          relatedWorkOrder: 'work-order-003',
          residentId: 'res-003'
        },
        taskCompletionStamps: []
      },

      // Overdue Event (Yesterday)
      {
        id: 'overdue-001',
        type: 'collections',
        title: 'Payment Plan Discussion',
        description: 'Discuss payment arrangement for outstanding balance',
        date: yesterday,
        time: '12:00',
        status: 'overdue',
        priority: 'high',
        category: 'Collections',
        tasks: [
          {
            id: 'collections-001-contact',
            title: 'Contact Resident',
            description: 'Reach out to discuss payment options',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'collections-001-plan',
            title: 'Setup Payment Plan',
            description: 'Establish payment plan agreement',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 20,
            dependencies: ['Contact Resident']
          }
        ],
        assignedUsers: [
          { role: 'resident', name: 'Robert Kim' },
          { role: 'operator', name: 'Lisa Rodriguez' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          balanceAmount: 2350,
          daysPastDue: 15,
          residentId: 'res-005'
        },
        taskCompletionStamps: []
      },

      // Tomorrow's Events
      {
        id: 'tour-004',
        type: 'tour',
        title: 'Property Tour - Prospect Visit',
        description: 'Show available units to prospective tenant Alex Rivera',
        date: tomorrow,
        time: '15:00',
        status: 'scheduled',
        priority: 'medium',
        category: 'Leasing',
        tasks: [
          {
            id: 'tour-004-prep',
            title: 'Prepare Tour Route',
            description: 'Plan tour route and gather unit keys',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          },
          {
            id: 'tour-004-conduct',
            title: 'Conduct Tour',
            description: 'Show available units and amenities',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 45,
            dependencies: ['Prepare Tour Route']
          },
          {
            id: 'tour-004-followup',
            title: 'Follow-up Contact',
            description: 'Send follow-up information and application',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 15
          }
        ],
        assignedUsers: [
          { role: 'prospect', name: 'Alex Rivera' },
          { role: 'operator', name: 'Alex Smith' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          unit: '1D',
          building: 'Building A',
          prospectName: 'Alex Rivera',
          prospectId: 'pros-001'
        },
        taskCompletionStamps: []
      },

      {
        id: 'inspection-005',
        type: 'inspection',
        title: 'Move-Out Inspection - Unit 5F',
        description: 'Final inspection before tenant move-out',
        date: addDays(today, 2),
        time: '11:00',
        status: 'scheduled',
        priority: 'medium',
        category: 'Resident Services',
        tasks: [
          {
            id: 'inspection-005-schedule',
            title: 'Schedule Inspection',
            description: 'Coordinate inspection time with resident',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10
          },
          {
            id: 'inspection-005-conduct',
            title: 'Conduct Inspection',
            description: 'Complete thorough unit inspection',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 60,
            dependencies: ['Schedule Inspection']
          },
          {
            id: 'inspection-005-report',
            title: 'Generate Report',
            description: 'Document findings and damage assessment',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 20,
            dependencies: ['Conduct Inspection']
          }
        ],
        assignedUsers: [
          { role: 'operator', name: 'Lisa Rodriguez' },
          { role: 'resident', name: 'Jennifer Walsh' },
          { role: 'maintenance', name: 'Tom Martinez' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          unit: '5F',
          building: 'Building D',
          residentName: 'Jennifer Walsh',
          residentId: 'res-004',
          inspectionType: 'move-out'
        },
        taskCompletionStamps: []
      },

      {
        id: 'community-007',
        type: 'community-event',
        title: 'Community BBQ - Summer Kickoff',
        description: 'Annual summer community barbecue event',
        date: addDays(today, 3),
        time: '18:00',
        status: 'scheduled',
        priority: 'low',
        category: 'Community',
        tasks: [
          {
            id: 'community-007-setup',
            title: 'Event Setup',
            description: 'Setup tables, grills, and decorations',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 120
          },
          {
            id: 'community-007-catering',
            title: 'Coordinate Catering',
            description: 'Manage food preparation and service',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 60
          },
          {
            id: 'community-007-cleanup',
            title: 'Event Cleanup',
            description: 'Clean up after event completion',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 90
          }
        ],
        assignedUsers: [
          { role: 'operator', name: 'Alex Smith' },
          { role: 'resident', name: 'All Residents' },
          { role: 'maintenance', name: 'Mike Wilson' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          eventType: 'bbq',
          capacity: 50,
          rsvpDeadline: addDays(today, 2)
        },
        taskCompletionStamps: []
      },

      {
        id: 'move-out-010',
        type: 'move-out',
        title: 'Move-Out Process - Unit 7C',
        description: 'Complete move-out checklist for departing resident',
        date: addDays(today, 7),
        time: '10:00',
        status: 'scheduled',
        priority: 'medium',
        category: 'Resident Services',
        tasks: [
          {
            id: 'move-out-010-schedule',
            title: 'Schedule Move-Out',
            description: 'Coordinate move-out time and logistics',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 15
          },
          {
            id: 'move-out-010-keys',
            title: 'Collect Keys & Access',
            description: 'Collect all keys and access cards',
            assignedRole: 'operator',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 10,
            dependencies: ['Schedule Move-Out']
          },
          {
            id: 'move-out-010-utilities',
            title: 'Disconnect Utilities',
            description: 'Coordinate utility disconnection',
            assignedRole: 'maintenance',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 20
          }
        ],
        assignedUsers: [
          { role: 'resident', name: 'Michael Torres' },
          { role: 'operator', name: 'Lisa Rodriguez' },
          { role: 'maintenance', name: 'Tom Martinez' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          unit: '7C',
          building: 'Building F',
          residentName: 'Michael Torres',
          residentId: 'res-006',
          moveOutDate: addDays(today, 7)
        },
        taskCompletionStamps: []
      },

      // Promotional Event
      {
        id: 'promo-001',
        type: 'promotional',
        title: 'Wellness Package - 50% Off Yoga',
        description: 'Special wellness promotion for residents',
        date: today,
        time: '15:30',
        status: 'scheduled',
        priority: 'low',
        category: 'Promotional',
        tasks: [
          {
            id: 'promo-001-view',
            title: 'View Promotional Offer',
            description: 'Review details for wellness package promotion',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: true,
            status: 'available',
            estimatedDuration: 5
          },
          {
            id: 'promo-001-redeem',
            title: 'Redeem Offer',
            description: 'Claim your discount: $30 → $15',
            assignedRole: 'resident',
            isComplete: false,
            isRequired: false,
            status: 'available',
            estimatedDuration: 10
          }
        ],
        assignedUsers: [
          { role: 'resident', name: 'All Residents' }
        ],
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          promoType: 'wellness',
          originalPrice: '$30',
          discountPrice: '$15',
          vendor: 'Zen Studio Downtown',
          validUntil: addDays(today, 7),
          canRedeem: true,
          isRedeemed: false
        },
        taskCompletionStamps: []
      }
    ];
  }

  // Get events for specific role
  getEventsForRole(role: string): UniversalEvent[] {
    return this.events.filter(event => 
      event.assignedUsers.some(user => user.role === role) ||
      event.tasks.some(task => task.assignedRole === role)
    );
  }

  // Get events for specific date
  getEventsForDate(date: Date): UniversalEvent[] {
    return this.events.filter(event => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      return startOfDay(eventDate).getTime() === startOfDay(date).getTime();
    });
  }

  // Get events for role and date
  getEventsForRoleAndDate(role: string, date: Date): UniversalEvent[] {
    return this.getEventsForDate(date).filter(event => 
      event.assignedUsers.some(user => user.role === role) ||
      event.tasks.some(task => task.assignedRole === role)
    );
  }

  // Get all events
  getAllEvents(): UniversalEvent[] {
    return [...this.events];
  }

  // Update event (maintains cross-role sync)
  updateEvent(eventId: string, updates: Partial<UniversalEvent>): boolean {
    const eventIndex = this.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return false;

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.notifyListeners();
    return true;
  }

  // Complete task (syncs across all roles)
  completeTask(eventId: string, taskId: string, completedBy: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return false;

    const task = event.tasks.find(t => t.id === taskId);
    if (!task) return false;

    // Update task
    task.isComplete = true;
    task.completedAt = new Date();
    task.completedBy = completedBy as any;
    task.status = 'complete';
    task.canUndo = true;

    // Add completion stamp
    event.taskCompletionStamps.push({
      id: `${Date.now()}-${Math.random()}`,
      taskId: taskId,
      taskName: task.title,
      eventId: eventId,
      eventType: event.type,
      completedAt: new Date(),
      completedBy: completedBy as any,
      completedByName: `${completedBy} User`,
      canUndo: true
    });

    // Check if all required tasks are complete
    const allRequiredComplete = event.tasks
      .filter(t => t.isRequired)
      .every(t => t.isComplete);

    if (allRequiredComplete) {
      event.status = 'completed';
      event.completedAt = new Date();
    }

    event.updatedAt = new Date();
    this.notifyListeners();
    return true;
  }

  // Undo task completion
  undoTaskCompletion(eventId: string, taskId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return false;

    const task = event.tasks.find(t => t.id === taskId);
    if (!task) return false;

    // Update task
    task.isComplete = false;
    task.completedAt = undefined;
    task.completedBy = undefined;
    task.status = 'available';
    task.canUndo = false;

    // Remove completion stamp
    event.taskCompletionStamps = event.taskCompletionStamps.filter(s => s.taskId !== taskId);

    // Update event status
    if (event.status === 'completed') {
      event.status = 'scheduled';
      event.completedAt = undefined;
    }

    event.updatedAt = new Date();
    this.notifyListeners();
    return true;
  }

  // Subscribe to changes
  subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Get event by ID
  getEventById(id: string): UniversalEvent | undefined {
    return this.events.find(e => e.id === id);
  }

  // Reschedule event
  rescheduleEvent(eventId: string, newDate: Date, newTime: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return false;

    event.date = newDate;
    event.time = newTime;
    event.rescheduledCount += 1;
    event.updatedAt = new Date();

    this.notifyListeners();
    return true;
  }
}

// Export singleton instance
export const sharedEventService = new SharedEventService();
