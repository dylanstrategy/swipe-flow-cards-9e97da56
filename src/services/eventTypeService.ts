import { EventType } from '@/types/eventTasks';

const eventTypes: EventType[] = [
  {
    id: 'move-in',
    name: 'Move-In',
    category: 'Resident Services',
    icon: '🏠',
    description: 'Resident move-in process with checklist',
    estimatedDuration: 120,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Unit Walkthrough',
        description: 'Complete unit inspection with resident',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 30,
        instructions: 'Check all rooms, fixtures, and document any existing damage',
        status: 'available'
      },
      {
        title: 'Key Handover',
        description: 'Provide unit keys and access cards',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 10,
        instructions: 'Test all keys and access cards with resident',
        status: 'available'
      },
      {
        title: 'Welcome Package',
        description: 'Deliver welcome materials and property information',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 15,
        instructions: 'Include property rules, amenity information, and contact details',
        status: 'available'
      },
      {
        title: 'Lease Documents Review',
        description: 'Review signed lease documents with resident',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 20,
        instructions: 'Ensure all documents are signed and resident understands terms',
        status: 'available'
      },
      {
        title: 'Update Property Records',
        description: 'Update unit status and resident information in system',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 15,
        instructions: 'Mark unit as occupied, update resident contact info',
        status: 'available'
      },
      {
        title: 'Schedule Follow-up',
        description: 'Schedule 30-day check-in with resident',
        assignedRole: 'operator',
        isRequired: false,
        estimatedDuration: 5,
        instructions: 'Set reminder for satisfaction survey and any issues',
        status: 'available'
      },
      {
        title: 'Final Documentation',
        description: 'Complete all move-in paperwork and file appropriately',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 10,
        instructions: 'File inspection forms, update unit records',
        dependencies: ['unit-walkthrough'],
        status: 'locked'
      }
    ],
    fallbackRules: [],
    overdueThreshold: 24,
    escalationRules: []
  },
  {
    id: 'move-out',
    name: 'Move-Out',
    category: 'Resident Services',
    icon: '📦',
    description: 'Resident move-out process and unit preparation',
    estimatedDuration: 90,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Pre-Move-Out Inspection',
        description: 'Conduct preliminary unit inspection',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 30,
        status: 'available'
      },
      {
        title: 'Key Return',
        description: 'Collect all unit keys and access cards',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 10,
        status: 'available'
      },
      {
        title: 'Final Walkthrough',
        description: 'Complete final unit inspection',
        assignedRole: 'resident',
        isRequired: false,
        estimatedDuration: 20,
        status: 'available'
      },
      {
        title: 'Damage Assessment',
        description: 'Document any unit damage for security deposit',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 20,
        status: 'available'
      },
      {
        title: 'Security Deposit Processing',
        description: 'Calculate and process security deposit return',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 15,
        status: 'available'
      },
      {
        title: 'Unit Status Update',
        description: 'Update unit availability in system',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 5,
        status: 'available'
      }
    ],
    fallbackRules: [],
    overdueThreshold: 48,
    escalationRules: []
  },
  {
    id: 'tour',
    name: 'Property Tour',
    category: 'Leasing',
    icon: '👁️',
    description: 'Guided property and unit tour for prospects',
    estimatedDuration: 45,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Prospect Check-in',
        description: 'Welcome prospect and verify appointment',
        assignedRole: 'prospect',
        isRequired: true,
        estimatedDuration: 5,
        status: 'available'
      },
      {
        title: 'Property Overview',
        description: 'Present property amenities and features',
        assignedRole: 'prospect',
        isRequired: true,
        estimatedDuration: 15,
        status: 'available'
      },
      {
        title: 'Unit Viewing',
        description: 'Show available unit(s)',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 20,
        status: 'available'
      },
      {
        title: 'Application Discussion',
        description: 'Discuss application process and requirements',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 10,
        status: 'available'
      }
    ],
    fallbackRules: [],
    overdueThreshold: 2,
    escalationRules: []
  },
  {
    id: 'lease-signing',
    name: 'Lease Signing',
    category: 'Leasing',
    icon: '📄',
    description: 'Lease signing appointment',
    estimatedDuration: 60,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Upload Lease Template',
        description: 'Upload and prepare lease documents',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 15,
        instructions: 'Ensure all lease terms are accurate and up to date',
        status: 'available'
      },
      {
        title: 'Assign Lease to Prospect',
        description: 'Send lease for digital signature',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 10,
        dependencies: ['Upload Lease Template'],
        status: 'locked'
      },
      {
        title: 'Sign Lease Agreement',
        description: 'Review and digitally sign the lease',
        assignedRole: 'prospect',
        isRequired: true,
        estimatedDuration: 30,
        instructions: 'Please review all terms carefully before signing',
        dependencies: ['Assign Lease to Prospect'],
        status: 'locked'
      },
      {
        title: 'Pay Initial Deposit',
        description: 'Submit security deposit and first month rent',
        assignedRole: 'prospect',
        isRequired: true,
        estimatedDuration: 15,
        instructions: 'Payment can be made via bank transfer or certified check',
        dependencies: ['Sign Lease Agreement'],
        status: 'locked'
      },
      {
        title: 'Confirm Renter\'s Insurance',
        description: 'Upload proof of renter\'s insurance policy',
        assignedRole: 'prospect',
        isRequired: true,
        estimatedDuration: 10,
        instructions: 'Policy must meet minimum coverage requirements',
        dependencies: ['Pay Initial Deposit'],
        status: 'locked'
      },
      {
        title: 'Finalize Lease Processing',
        description: 'Complete lease setup and schedule move-in',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 15,
        dependencies: ['Confirm Renter\'s Insurance'],
        status: 'locked'
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 24,
    escalationRules: []
  },
  {
    id: 'payment',
    name: 'Payment Processing',
    category: 'Finance',
    icon: '💳',
    description: 'Process resident payment',
    estimatedDuration: 15,
    allowsReschedule: false,
    defaultTasks: [
      {
        title: 'Payment Acknowledgment',
        description: 'Acknowledge payment received',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 5,
        status: 'available'
      },
      {
        title: 'Update Records',
        description: 'Update payment records in system',
        assignedRole: 'operator',
        isRequired: false,
        estimatedDuration: 10,
        status: 'available'
      }
    ],
    fallbackRules: [],
    overdueThreshold: 12,
    escalationRules: []
  },
  {
    id: 'work-order',
    name: 'Work Order',
    category: 'Maintenance',
    icon: '🔧',
    description: 'Maintenance work order processing',
    estimatedDuration: 120,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Issue Assessment',
        description: 'Evaluate maintenance request',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 15,
        status: 'available'
      },
      {
        title: 'Work Completion',
        description: 'Complete maintenance work',
        assignedRole: 'maintenance',
        isRequired: true,
        estimatedDuration: 90,
        status: 'available'
      },
      {
        title: 'Quality Check',
        description: 'Verify work completion',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 10,
        status: 'available'
      },
      {
        title: 'Work Order Closure',
        description: 'Close work order in system',
        assignedRole: 'maintenance',
        isRequired: true,
        estimatedDuration: 5,
        status: 'available'
      },
      {
        title: 'Resident Satisfaction',
        description: 'Confirm resident satisfaction',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 5,
        status: 'available'
      }
    ],
    fallbackRules: [],
    overdueThreshold: 72,
    escalationRules: []
  },
  {
    id: 'inspection',
    name: 'Unit Inspection',
    category: 'Maintenance',
    icon: '🔍',
    description: 'Scheduled unit inspection',
    estimatedDuration: 45,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Pre-Inspection Notice',
        description: 'Notify resident of inspection',
        assignedRole: 'resident',
        isRequired: true,
        estimatedDuration: 5,
        status: 'available'
      },
      {
        title: 'Inspection Completion',
        description: 'Complete unit inspection',
        assignedRole: 'operator',
        isRequired: false,
        estimatedDuration: 30,
        status: 'available'
      }
    ],
    fallbackRules: [],
    overdueThreshold: 24,
    escalationRules: []
  },
  {
    id: 'amenity-reservation',
    name: 'Amenity Reservation',
    category: 'Community',
    icon: '🏊',
    description: 'Process amenity reservation request',
    estimatedDuration: 10,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Reservation Confirmation',
        description: 'Confirm amenity availability and book',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 5,
        status: 'available'
      },
      {
        title: 'Guidelines Review',
        description: 'Send amenity usage guidelines',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 5,
        status: 'available'
      }
    ],
    fallbackRules: [],
    overdueThreshold: 4,
    escalationRules: []
  },
  {
    id: 'community-event',
    name: 'Community Event',
    category: 'Community',
    icon: '🎉',
    description: 'Community event organization and RSVP',
    estimatedDuration: 180,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'RSVP Confirmation',
        description: 'Confirm resident attendance',
        assignedRole: 'operator',
        isRequired: true,
        estimatedDuration: 5,
        status: 'available'
      }
    ],
    fallbackRules: [],
    overdueThreshold: 48,
    escalationRules: []
  }
];

export const getEventTypes = (): EventType[] => {
  return eventTypes;
};

export const getEventType = (id: string): EventType | undefined => {
  return eventTypes.find(type => type.id === id);
};

export const getEventTypesByCategory = (category: string): EventType[] => {
  return eventTypes.filter(type => type.category === category);
};
