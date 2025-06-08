
import { EventType } from '@/types/eventTasks';

export const EVENT_TYPES: Record<string, EventType> = {
  'move-in': {
    id: 'move-in',
    name: 'Move-In Event',
    category: 'Leasing',
    icon: '🔑',
    description: 'Complete resident move-in process',
    estimatedDuration: 180,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Submit Renter\'s Insurance',
        description: 'Upload proof of renter\'s insurance policy',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 15,
        instructions: 'Upload a copy of your renter\'s insurance policy that meets property requirements'
      },
      {
        title: 'Complete Utility Setup',
        description: 'Set up electricity, gas, and internet services',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 30,
        instructions: 'Contact utility providers to transfer services to your name'
      },
      {
        title: 'Pay Move-In Balance',
        description: 'Pay any remaining move-in fees and deposits',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 10,
        instructions: 'Pay outstanding balance before move-in date'
      },
      {
        title: 'Complete Onboarding',
        description: 'Fill out resident onboarding forms',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 20,
        instructions: 'Complete all required resident information forms'
      },
      {
        title: 'Unit Inspection',
        description: 'Complete pre-move-in unit inspection',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 45,
        instructions: 'Inspect unit condition and document any issues'
      },
      {
        title: 'Send Welcome Gift',
        description: 'Deliver welcome gift to resident',
        assignedRole: 'operator',
        isRequired: false,
        estimatedDuration: 15,
        instructions: 'Deliver welcome package to unit'
      },
      {
        title: 'Grant Access',
        description: 'Activate key fobs and access codes',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 10,
        instructions: 'Program access cards and provide access codes',
        dependencies: ['unit-inspection']
      }
    ],
    followUpSequence: [
      {
        id: 'move-in-reminder-1',
        templateId: 'move-in-reminder',
        delayHours: -24,
        condition: 'tasks_incomplete'
      }
    ],
    fallbackRules: [
      {
        id: 'block-access',
        condition: 'move_in_date_passed_incomplete',
        action: 'escalate',
        delayHours: 0,
        notification: 'Move-in incomplete - access blocked'
      }
    ],
    overdueThreshold: 2,
    escalationRules: [
      {
        id: 'escalate-overdue',
        threshold: 24,
        action: 'escalate_to_manager',
        notification: 'Move-in overdue - requires manager attention'
      }
    ]
  },
  
  'move-out': {
    id: 'move-out',
    name: 'Move-Out Event',
    category: 'Leasing',
    icon: '📤',
    description: 'Process resident move-out',
    estimatedDuration: 120,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Submit Move-Out Notice',
        description: 'Provide formal notice to vacate',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 10
      },
      {
        title: 'Confirm Move-Out Date',
        description: 'Confirm final move-out date and time',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 5
      },
      {
        title: 'Complete Exit Survey',
        description: 'Provide feedback about your residence',
        assignedRole: 'resident',
        isRequired: false,
        estimatedDuration: 15
      },
      {
        title: 'Schedule Final Inspection',
        description: 'Schedule move-out inspection',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 15
      },
      {
        title: 'Revoke Access',
        description: 'Deactivate key fobs and access codes',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 10
      },
      {
        title: 'Confirm Key Return',
        description: 'Verify all keys and remotes returned',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 10
      }
    ],
    followUpSequence: [
      {
        id: 'move-out-reminder',
        templateId: 'move-out-reminder',
        delayHours: -72
      }
    ],
    fallbackRules: [
      {
        id: 'reschedule-inspection',
        condition: 'inspection_not_complete',
        action: 'reschedule',
        delayHours: 24
      }
    ],
    overdueThreshold: 4,
    escalationRules: []
  },

  'lease-signing': {
    id: 'lease-signing',
    name: 'Lease Signing',
    category: 'Leasing',
    icon: '📝',
    description: 'Complete lease agreement signing',
    estimatedDuration: 60,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Sign Lease Agreement',
        description: 'Review and electronically sign lease',
        assignedRole: 'prospect',
        isRequired: true,
        estimatedDuration: 30
      },
      {
        title: 'Pay Security Deposit',
        description: 'Submit required security deposit',
        assignedRole: 'prospect',
        isRequired: true,
        estimatedDuration: 10
      },
      {
        title: 'Generate Lease Documents',
        description: 'Prepare final lease agreement',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 15
      },
      {
        title: 'Send Approval Letter',
        description: 'Send lease approval notification',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 5
      }
    ],
    followUpSequence: [
      {
        id: 'lease-reminder-1',
        templateId: 'lease-signing-reminder',
        delayHours: 24
      },
      {
        id: 'lease-reminder-2',
        templateId: 'lease-signing-urgent',
        delayHours: 72
      }
    ],
    fallbackRules: [
      {
        id: 'auto-cancel-application',
        condition: 'not_signed_5_days',
        action: 'auto-cancel',
        delayHours: 120
      }
    ],
    overdueThreshold: 6,
    escalationRules: []
  },

  'tour': {
    id: 'tour',
    name: 'Property Tour',
    category: 'Leasing',
    icon: '🏡',
    description: 'Conduct property tour for prospect',
    estimatedDuration: 45,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Confirm Tour Time',
        description: 'Confirm attendance and timing',
        assignedRole: 'prospect',
        isRequired: true,
        estimatedDuration: 5
      },
      {
        title: 'Complete Tour',
        description: 'Conduct property and unit tour',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 30
      },
      {
        title: 'Enter Tour Feedback',
        description: 'Record prospect feedback and interest level',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 10
      }
    ],
    followUpSequence: [
      // Pre-tour sequence (5 emails)
      {
        id: 'pre-tour-1',
        templateId: 'tour-confirmation',
        delayHours: 0
      },
      {
        id: 'pre-tour-2',
        templateId: 'pre-tour-info',
        delayHours: -24
      },
      // Post-tour sequence (5 emails)
      {
        id: 'post-tour-1',
        templateId: 'tour-thank-you',
        delayHours: 2
      },
      {
        id: 'post-tour-2',
        templateId: 'tour-follow-up-1',
        delayHours: 24
      },
      {
        id: 'post-tour-3',
        templateId: 'tour-follow-up-2',
        delayHours: 72
      },
      {
        id: 'post-tour-4',
        templateId: 'tour-follow-up-3',
        delayHours: 168
      },
      {
        id: 'post-tour-5',
        templateId: 'tour-final-follow-up',
        delayHours: 336,
        stopOnResponse: true
      }
    ],
    fallbackRules: [
      {
        id: 'auto-cancel-no-show',
        condition: 'no_show_no_interest',
        action: 'auto-cancel',
        delayHours: 2
      },
      {
        id: 'archive-unresponsive',
        condition: 'no_response_final_followup',
        action: 'archive',
        delayHours: 504 // 3 weeks after final follow-up
      }
    ],
    overdueThreshold: 1,
    escalationRules: []
  },

  'message': {
    id: 'message',
    name: 'Message',
    category: 'Communication',
    icon: '📮',
    description: 'Send message to resident or team',
    estimatedDuration: 15,
    allowsReschedule: false,
    defaultTasks: [
      {
        title: 'Send Message',
        description: 'Compose and send message',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 10
      },
      {
        title: 'Acknowledge Receipt',
        description: 'Confirm message received',
        assignedRole: 'operator',
        isRequired: false,
        estimatedDuration: 5
      }
    ],
    followUpSequence: [],
    fallbackRules: [
      {
        id: 'auto-archive',
        condition: 'no_response_7_days',
        action: 'archive',
        delayHours: 168
      }
    ],
    overdueThreshold: 24,
    escalationRules: []
  },

  'work-order': {
    id: 'work-order',
    name: 'Work Order',
    category: 'Maintenance',
    icon: '🛠',
    description: 'Complete maintenance work order',
    estimatedDuration: 90,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Create Work Order',
        description: 'Submit maintenance request details',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 10
      },
      {
        title: 'Diagnose Issue',
        description: 'Assess maintenance issue and requirements',
        assignedRole: 'maintenance',
        isRequired: true,
        estimatedDuration: 30
      },
      {
        title: 'Assign Vendor',
        description: 'Assign appropriate vendor or technician',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 15
      },
      {
        title: 'Complete Repair',
        description: 'Execute maintenance work',
        assignedRole: 'maintenance',
        isRequired: true,
        estimatedDuration: 60
      },
      {
        title: 'Confirm Resolution',
        description: 'Verify work completed satisfactorily',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 10
      }
    ],
    followUpSequence: [
      {
        id: 'work-order-reminder',
        templateId: 'work-order-reminder',
        delayHours: 24,
        condition: 'not_started'
      }
    ],
    fallbackRules: [
      {
        id: 'escalate-overdue',
        condition: 'overdue_72_hours',
        action: 'escalate',
        delayHours: 72
      }
    ],
    overdueThreshold: 4,
    escalationRules: [
      {
        id: 'urgent-escalation',
        threshold: 72,
        action: 'escalate_to_manager',
        notification: 'Work order overdue - requires immediate attention'
      }
    ]
  },

  'payment': {
    id: 'payment',
    name: 'Payment',
    category: 'Financial',
    icon: '💳',
    description: 'Process rent or fee payment',
    estimatedDuration: 15,
    allowsReschedule: false,
    defaultTasks: [
      {
        title: 'Submit Payment',
        description: 'Pay outstanding balance',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 10
      },
      {
        title: 'Confirm Receipt',
        description: 'Verify payment received',
        assignedRole: 'operator',
        isRequired: false,
        estimatedDuration: 5
      }
    ],
    followUpSequence: [],
    fallbackRules: [
      {
        id: 'collections-escalation',
        condition: 'payment_overdue',
        action: 'escalate',
        delayHours: 72
      }
    ],
    overdueThreshold: 24,
    escalationRules: [
      {
        id: 'collections',
        threshold: 72,
        action: 'escalate_to_collections',
        notification: 'Payment overdue - escalate to collections'
      }
    ]
  },

  'inspection': {
    id: 'inspection',
    name: 'Unit Inspection',
    category: 'Maintenance',
    icon: '🧰',
    description: 'Conduct unit inspection',
    estimatedDuration: 60,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Complete Inspection',
        description: 'Inspect unit condition and systems',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 45
      },
      {
        title: 'Document Findings',
        description: 'Record inspection results and issues',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 15
      }
    ],
    followUpSequence: [
      {
        id: 'inspection-reminder',
        templateId: 'inspection-reminder',
        delayHours: -24
      }
    ],
    fallbackRules: [
      {
        id: 'auto-reschedule',
        condition: 'incomplete_due_date',
        action: 'reschedule',
        delayHours: 24
      }
    ],
    overdueThreshold: 2,
    escalationRules: []
  },

  'amenity-reservation': {
    id: 'amenity-reservation',
    name: 'Amenity Reservation',
    category: 'Community',
    icon: '🧼',
    description: 'Reserve community amenity',
    estimatedDuration: 30,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Submit Reservation',
        description: 'Request amenity reservation',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 10
      },
      {
        title: 'Approve Reservation',
        description: 'Confirm amenity availability',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 5
      },
      {
        title: 'Manage Access',
        description: 'Provide access codes or keys',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 10
      }
    ],
    followUpSequence: [
      {
        id: 'amenity-reminder',
        templateId: 'amenity-reminder',
        delayHours: -1
      }
    ],
    fallbackRules: [
      {
        id: 'auto-cancel-no-payment',
        condition: 'no_payment_fee_required',
        action: 'auto-cancel',
        delayHours: 24
      }
    ],
    overdueThreshold: 1,
    escalationRules: []
  },

  'community-event': {
    id: 'community-event',
    name: 'Community Event',
    category: 'Community',
    icon: '🌆',
    description: 'Organize community event',
    estimatedDuration: 120,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'RSVP for Event',
        description: 'Confirm attendance',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 5
      },
      {
        title: 'Prepare Event Setup',
        description: 'Set up event space and materials',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 60
      },
      {
        title: 'Mark Attendance',
        description: 'Track event attendance',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 15
      }
    ],
    followUpSequence: [
      {
        id: 'event-reminder-1',
        templateId: 'event-reminder',
        delayHours: -72
      },
      {
        id: 'event-reminder-2',
        templateId: 'event-final-reminder',
        delayHours: -24
      }
    ],
    fallbackRules: [
      {
        id: 'auto-cancel-low-rsvp',
        condition: 'less_than_3_rsvps',
        action: 'auto-cancel',
        delayHours: -48
      }
    ],
    overdueThreshold: 2,
    escalationRules: []
  }
};

export const getEventType = (typeId: string): EventType | undefined => {
  return EVENT_TYPES[typeId];
};

export const getAllEventTypes = (): EventType[] => {
  return Object.values(EVENT_TYPES);
};

export const getEventTypesByCategory = (category: string): EventType[] => {
  return Object.values(EVENT_TYPES).filter(type => type.category === category);
};
