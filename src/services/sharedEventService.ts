import { UniversalEvent, EventTask } from '@/types/eventTasks';
import { Role } from '@/types/roles';
import { TaskCompletionStamp } from '@/types/taskStamps';
import { userHasAccessToTask } from '@/types/roles';

class SharedEventService {
  private events: UniversalEvent[] = [
    {
      id: '1',
      type: 'move-in',
      title: 'Move-in for John Smith',
      description: 'New resident move-in',
      date: new Date(),
      time: '10:00',
      status: 'scheduled',
      priority: 'high',
      category: 'Leasing',
      tasks: [
        {
          id: '1-1',
          title: 'Welcome Email',
          description: 'Send welcome email to resident',
          assignedRole: 'leasing',
          isComplete: false,
          isRequired: true,
          status: 'available',
          estimatedDuration: 15
        },
        {
          id: '1-2',
          title: 'Prepare Keys',
          description: 'Prepare keys for resident',
          assignedRole: 'leasing',
          isComplete: false,
          isRequired: true,
          status: 'available',
          estimatedDuration: 15
        }
      ],
      assignedUsers: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        unit: '417',
        building: 'A'
      },
      taskCompletionStamps: []
    },
    {
      id: '2',
      type: 'lease-signing',
      title: 'Lease Signing with Emily Johnson',
      description: 'Finalize lease agreement',
      date: new Date(),
      time: '14:00',
      status: 'scheduled',
      priority: 'medium',
      category: 'Leasing',
      tasks: [
        {
          id: '2-1',
          title: 'Review Lease',
          description: 'Review lease agreement with applicant',
          assignedRole: 'leasing',
          isComplete: false,
          isRequired: true,
          status: 'available',
          estimatedDuration: 30
        },
        {
          id: '2-2',
          title: 'Sign Lease',
          description: 'Sign lease agreement',
          assignedRole: 'leasing',
          isComplete: false,
          isRequired: true,
          status: 'available',
          estimatedDuration: 15
        }
      ],
      assignedUsers: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        unit: '417',
        building: 'A'
      },
      taskCompletionStamps: []
    },
    {
      id: '3',
      type: 'maintenance',
      title: 'Fix leaky faucet',
      description: 'Bathroom faucet dripping',
      date: new Date(),
      time: '09:00',
      status: 'scheduled',
      priority: 'high',
      category: 'Maintenance',
      tasks: [
        {
          id: '3-1',
          title: 'Diagnose Problem',
          description: 'Identify cause of leak',
          assignedRole: 'maintenance',
          isComplete: false,
          isRequired: true,
          status: 'available',
          estimatedDuration: 30
        },
        {
          id: '3-2',
          title: 'Repair Faucet',
          description: 'Replace worn parts',
          assignedRole: 'maintenance',
          isComplete: false,
          isRequired: true,
          status: 'available',
          estimatedDuration: 60
        }
      ],
      assignedUsers: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        unit: '417',
        building: 'A'
      },
      taskCompletionStamps: []
    },
    {
      id: '4',
      type: 'community-event',
      title: 'Community BBQ',
      description: 'Community BBQ',
      date: new Date(),
      time: '12:00',
      status: 'scheduled',
      priority: 'low',
      category: 'Community',
      tasks: [],
      assignedUsers: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        unit: '417',
        building: 'A'
      },
      taskCompletionStamps: []
    },
    {
      id: '5',
      type: 'inspection',
      title: 'Unit Inspection',
      description: 'Annual unit inspection',
      date: new Date(),
      time: '11:00',
      status: 'scheduled',
      priority: 'medium',
      category: 'Inspection',
      tasks: [
        {
          id: '5-1',
          title: 'Inspect Unit',
          description: 'Inspect unit',
          assignedRole: 'maintenance',
          isComplete: false,
          isRequired: true,
          status: 'available',
          estimatedDuration: 60
        }
      ],
      assignedUsers: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        unit: '417',
        building: 'A'
      },
      taskCompletionStamps: []
    },
    {
      id: '6',
      type: 'payment',
      title: 'Rent Payment Due',
      description: 'Rent payment due',
      date: new Date(),
      time: '00:00',
      status: 'scheduled',
      priority: 'high',
      category: 'Payment',
      tasks: [],
      assignedUsers: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        unit: '417',
        building: 'A'
      },
      taskCompletionStamps: []
    },
    {
      id: '7',
      type: 'message',
      title: 'Package Delivery',
      description: 'Package delivered to unit',
      date: new Date(),
      time: '15:00',
      status: 'scheduled',
      priority: 'low',
      category: 'Message',
      tasks: [],
      assignedUsers: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        unit: '417',
        building: 'A'
      },
      taskCompletionStamps: []
    },
    {
      id: '8',
      type: 'tour',
      title: 'Apartment Tour',
      description: 'Apartment tour',
      date: new Date(),
      time: '16:00',
      status: 'scheduled',
      priority: 'medium',
      category: 'Tour',
      tasks: [],
      assignedUsers: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        unit: '417',
        building: 'A'
      },
      taskCompletionStamps: []
    },
    {
      id: '9',
      type: 'amenity-reservation',
      title: 'Gym Reservation',
      description: 'Gym reservation',
      date: new Date(),
      time: '17:00',
      status: 'scheduled',
      priority: 'low',
      category: 'Amenity',
      tasks: [],
      assignedUsers: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        unit: '417',
        building: 'A'
      },
      taskCompletionStamps: []
    },
    {
      id: '10',
      type: 'move-out',
      title: 'Move-out Inspection',
      description: 'Move-out inspection',
      date: new Date(),
      time: '18:00',
      status: 'scheduled',
      priority: 'medium',
      category: 'Leasing',
      tasks: [],
      assignedUsers: [],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      rescheduledCount: 0,
      followUpHistory: [],
      metadata: {
        unit: '417',
        building: 'A'
      },
      taskCompletionStamps: []
    }
  ];

  constructor() {
    // Seed initial events
    this.seedInitialEvents();
  }

  seedInitialEvents() {
    // Check if events are already seeded
    if (this.events.length === 0) {
      const now = new Date();
      this.addEvent({
        id: 'initial-1',
        type: 'message',
        title: 'Welcome to the Community!',
        description: 'A warm welcome message to all new residents.',
        date: now,
        time: '09:00',
        status: 'scheduled',
        priority: 'low',
        category: 'Community',
        tasks: [],
        assignedUsers: [],
        createdBy: 'system',
        createdAt: now,
        updatedAt: now,
        rescheduledCount: 0,
        followUpHistory: [],
        metadata: {
          unit: 'All',
          building: 'All'
        },
        taskCompletionStamps: []
      });
    }
  }

  getAllEvents(): UniversalEvent[] {
    return this.events;
  }

  getEventsForRole(role: Role): UniversalEvent[] {
    return this.events.filter(event => this.isEventRelevantForRole(event, role));
  }

  private isEventRelevantForRole(event: UniversalEvent, role: Role): boolean {
    // Check if the event has assigned users
    if (event.assignedUsers && event.assignedUsers.length > 0) {
      // Check if the role is assigned to the event
      return event.assignedUsers.some(user => user.role === role);
    }

    // If no assigned users, consider the event relevant for all roles
    return true;
  }

  addEvent(event: UniversalEvent): void {
    this.events.push(event);
    this.notifyListeners();
  }

  updateEvent(id: string, updatedEvent: UniversalEvent): void {
    const index = this.events.findIndex(event => event.id === id);
    if (index !== -1) {
      this.events[index] = updatedEvent;
      this.notifyListeners();
    }
  }

  deleteEvent(id: string): void {
    this.events = this.events.filter(event => event.id !== id);
    this.notifyListeners();
  }

  getEventById(id: string): UniversalEvent | undefined {
    return this.events.find(event => event.id === id);
  }

  rescheduleEvent(eventId: string, newDate: Date, newTime: string): boolean {
    const eventIndex = this.events.findIndex(event => event.id === eventId);
    if (eventIndex === -1) {
      console.warn(`Event with ID ${eventId} not found for rescheduling.`);
      return false;
    }

    const event = this.events[eventIndex];
    const updatedEvent = {
      ...event,
      date: newDate,
      time: newTime,
      updatedAt: new Date(),
      rescheduledCount: (event.rescheduledCount || 0) + 1
    };

    this.events[eventIndex] = updatedEvent;
    this.notifyListeners();
    return true;
  }

  completeTask(taskId: string, userRole: Role): boolean {
    const eventIndex = this.events.findIndex(event =>
      event.tasks.some(task => task.id === taskId)
    );

    if (eventIndex === -1) {
      console.warn(`No event found with task ID ${taskId}`);
      return false;
    }

    const event = this.events[eventIndex];
    const taskIndex = event.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      console.warn(`Task with ID ${taskId} not found in event ${event.id}`);
      return false;
    }

    const task = event.tasks[taskIndex];

    // UPDATED: Use role hierarchy instead of strict role check
    if (!userHasAccessToTask(userRole, task.assignedRole)) {
      console.warn(`User role ${userRole} is not authorized to complete task ${taskId} (assigned to ${task.assignedRole})`);
      return false;
    }

    const updatedTask: EventTask = {
      ...task,
      isComplete: true,
      status: 'complete'
    };

    const completionTime = new Date();
    const taskStamp: TaskCompletionStamp = {
      id: `${taskId}-completed-${Date.now()}`,
      taskId: task.id,
      taskName: task.title,
      eventId: event.id,
      eventType: event.type,
      completedAt: completionTime,
      actualCompletionTime: completionTime,
      completedBy: userRole,
      completedByName: userRole, // Replace with actual user name if available
      userId: 'system', // Replace with actual user ID if available
      canUndo: true,
      displayTime: completionTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      permanent: false
    };

    const updatedEvent: UniversalEvent = {
      ...event,
      tasks: [
        ...event.tasks.slice(0, taskIndex),
        updatedTask,
        ...event.tasks.slice(taskIndex + 1)
      ],
      taskCompletionStamps: [
        ...(event.taskCompletionStamps || []),
        taskStamp
      ]
    };

    this.events[eventIndex] = updatedEvent;
    this.notifyListeners();
    return true;
  }

  undoTaskCompletion(taskId: string): boolean {
    const eventIndex = this.events.findIndex(event =>
      event.tasks.some(task => task.id === taskId)
    );

    if (eventIndex === -1) {
      console.warn(`No event found with task ID ${taskId}`);
      return false;
    }

    const event = this.events[eventIndex];
    const taskIndex = event.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      console.warn(`Task with ID ${taskId} not found in event ${event.id}`);
      return false;
    }

    const task = event.tasks[taskIndex];

    const updatedTask: EventTask = {
      ...task,
      isComplete: false,
      status: 'available'
    };

    const updatedEvent: UniversalEvent = {
      ...event,
      tasks: [
        ...event.tasks.slice(0, taskIndex),
        updatedTask,
        ...event.tasks.slice(taskIndex + 1)
      ],
      taskCompletionStamps: (event.taskCompletionStamps || []).filter(stamp => stamp.taskId !== taskId)
    };

    this.events[eventIndex] = updatedEvent;
    this.notifyListeners();
    return true;
  }

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Unified method to get events for a specific date and role
   * This ensures TodayTab and ScheduleTab always show the same events
   */
  getEventsForRoleAndDate(role: Role, date: Date): UniversalEvent[] {
    const targetDateString = date.toDateString();
    
    return this.events.filter(event => {
      // Check if event is for the target date
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
      const eventDateString = eventDate.toDateString();
      
      if (eventDateString !== targetDateString) {
        return false;
      }
      
      // Check if event is relevant for the role
      return this.isEventRelevantForRole(event, role);
    }).sort((a, b) => a.time.localeCompare(b.time));
  }

  /**
   * Get today's events specifically for a role
   */
  getTodaysEventsForRole(role: Role): UniversalEvent[] {
    const today = new Date();
    return this.getEventsForRoleAndDate(role, today);
  }
}

export const sharedEventService = new SharedEventService();
