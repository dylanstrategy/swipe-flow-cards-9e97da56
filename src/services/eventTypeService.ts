
import { EventType, EventTask } from '@/types/eventTasks';
import { Role } from '@/types/roles';

const eventTypes: EventType[] = [
  {
    id: 'move-in',
    name: 'Move-In',
    category: 'Moving',
    icon: '📦',
    description: 'Move-in process and orientation',
    estimatedDuration: 120,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Resident: Complete Move-In Checklist',
        description: 'Review and sign move-in checklist',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 30
      },
      {
        title: 'Operator: Conduct Unit Walkthrough',
        description: 'Walk through unit with resident',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 45
      },
      {
        title: 'Resident: Upload Renter\'s Insurance',
        description: 'Provide proof of renter\'s insurance',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 24,
    escalationRules: []
  },
  {
    id: 'move-out',
    name: 'Move-Out',
    category: 'Moving',
    icon: '📤',
    description: 'Move-out process and inspection',
    estimatedDuration: 90,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Resident: Schedule Move-Out Inspection',
        description: 'Schedule final inspection',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      },
      {
        title: 'Operator: Conduct Move-Out Inspection',
        description: 'Perform final unit inspection',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 60
      },
      {
        title: 'Operator: Process Security Deposit',
        description: 'Calculate and process deposit return',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 12,
    escalationRules: []
  },
  {
    id: 'lease-signing',
    name: 'Lease Signing',
    category: 'Leasing',
    icon: '📝',
    description: 'Lease document signing process',
    estimatedDuration: 60,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Resident: Review Lease Terms',
        description: 'Review all lease terms and conditions',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 20
      },
      {
        title: 'Resident: Sign Lease Documents',
        description: 'Digitally sign lease agreement',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      },
      {
        title: 'Operator: Verify Documents',
        description: 'Verify all signatures and documentation',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 24,
    escalationRules: []
  },
  {
    id: 'work-order',
    name: 'Work Order',
    category: 'Maintenance',
    icon: '🔧',
    description: 'Maintenance work order completion',
    estimatedDuration: 120,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Resident: Grant Access',
        description: 'Provide access to maintenance team',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 5
      },
      {
        title: 'Maintenance: Complete Work Order',
        description: 'Perform requested maintenance work',
        assignedRole: 'maintenance',
        isRequired: true,
        status: 'available',
        estimatedDuration: 90
      },
      {
        title: 'Maintenance: Update Status',
        description: 'Update work order completion status',
        assignedRole: 'maintenance',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      },
      {
        title: 'Resident: Confirm Completion',
        description: 'Confirm work has been completed satisfactorily',
        assignedRole: 'resident',
        isRequired: false,
        status: 'available',
        estimatedDuration: 5
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 4,
    escalationRules: []
  },
  {
    id: 'unit-turn',
    name: 'Unit Turn',
    category: 'Maintenance',
    icon: '🏠',
    description: 'Unit turnover preparation',
    estimatedDuration: 480,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Maintenance: Deep Cleaning',
        description: 'Complete deep cleaning of unit',
        assignedRole: 'maintenance',
        isRequired: true,
        status: 'available',
        estimatedDuration: 180
      },
      {
        title: 'Maintenance: Paint Touch-ups',
        description: 'Complete any necessary painting',
        assignedRole: 'maintenance',
        isRequired: true,
        status: 'available',
        estimatedDuration: 120
      },
      {
        title: 'Maintenance: Final Inspection',
        description: 'Conduct final quality inspection',
        assignedRole: 'maintenance',
        isRequired: true,
        status: 'available',
        estimatedDuration: 30
      },
      {
        title: 'Operator: Mark Unit Ready',
        description: 'Update unit status to available',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 5
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 48,
    escalationRules: []
  },
  {
    id: 'inspection',
    name: 'Inspection',
    category: 'Maintenance',
    icon: '🔍',
    description: 'Unit inspection process',
    estimatedDuration: 60,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Resident: Prepare Unit',
        description: 'Ensure unit is accessible for inspection',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      },
      {
        title: 'Operator: Perform Inspection',
        description: 'Complete thorough unit inspection',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 45
      },
      {
        title: 'Operator: Generate Report',
        description: 'Create and submit inspection report',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 24,
    escalationRules: []
  },
  {
    id: 'community-event',
    name: 'Community Event',
    category: 'Community',
    icon: '🎉',
    description: 'Community gathering or event',
    estimatedDuration: 180,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Resident: RSVP for Event',
        description: 'Confirm attendance for community event',
        assignedRole: 'resident',
        isRequired: false,
        status: 'available',
        estimatedDuration: 2
      },
      {
        title: 'Operator: Setup Event Space',
        description: 'Prepare venue and amenities',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 60
      },
      {
        title: 'Operator: Event Check-in',
        description: 'Manage event check-in process',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 30
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 2,
    escalationRules: []
  },
  {
    id: 'message',
    name: 'Message',
    category: 'Communication',
    icon: '💬',
    description: 'Important message or communication',
    estimatedDuration: 15,
    allowsReschedule: false,
    defaultTasks: [
      {
        title: 'Resident: Read Message',
        description: 'Review important message from management',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 5
      },
      {
        title: 'Resident: Acknowledge Receipt',
        description: 'Confirm message has been received',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 2
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 48,
    escalationRules: []
  },
  {
    id: 'collections',
    name: 'Collections',
    category: 'Financial',
    icon: '💰',
    description: 'Collections and payment reminder',
    estimatedDuration: 30,
    allowsReschedule: false,
    defaultTasks: [
      {
        title: 'Resident: Review Outstanding Balance',
        description: 'Review current balance and charges',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      },
      {
        title: 'Resident: Make Payment',
        description: 'Submit payment for outstanding balance',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      },
      {
        title: 'Operator: Confirm Payment',
        description: 'Verify payment has been received',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 5
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 24,
    escalationRules: []
  },
  {
    id: 'promotional',
    name: 'Promotional',
    category: 'Marketing',
    icon: '🎁',
    description: 'Special offer or promotion',
    estimatedDuration: 10,
    allowsReschedule: false,
    defaultTasks: [
      {
        title: 'Resident: Review Offer',
        description: 'Review promotional offer details',
        assignedRole: 'resident',
        isRequired: false,
        status: 'available',
        estimatedDuration: 5
      },
      {
        title: 'Resident: Redeem Offer',
        description: 'Redeem promotional offer if interested',
        assignedRole: 'resident',
        isRequired: false,
        status: 'available',
        estimatedDuration: 5
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 168,
    escalationRules: []
  },
  {
    id: 'poll',
    name: 'Poll',
    category: 'Community',
    icon: '📊',
    description: 'Community poll or survey',
    estimatedDuration: 15,
    allowsReschedule: false,
    defaultTasks: [
      {
        title: 'Operator: Create Poll',
        description: 'Create community poll with options',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      },
      {
        title: 'Resident: Cast Vote',
        description: 'Submit vote in community poll',
        assignedRole: 'resident',
        isRequired: false,
        status: 'available',
        estimatedDuration: 5
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 168,
    escalationRules: []
  },
  {
    id: 'pet-registration',
    name: 'Pet Registration',
    category: 'Administrative',
    icon: '🐾',
    description: 'Pet registration and documentation',
    estimatedDuration: 45,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Resident: Upload Pet Photos',
        description: 'Upload photos of pet for registration',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      },
      {
        title: 'Resident: Upload Vaccination Records',
        description: 'Provide current vaccination documentation',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      },
      {
        title: 'Resident: Pay Pet Fee',
        description: 'Submit pet deposit and monthly fee',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      },
      {
        title: 'Operator: Approve Registration',
        description: 'Review and approve pet registration',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 72,
    escalationRules: []
  },
  {
    id: 'tour-appointment',
    name: 'Tour Appointment',
    category: 'Leasing',
    icon: '🚶',
    description: 'Property tour appointment',
    estimatedDuration: 45,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Operator: Prepare for Tour',
        description: 'Prepare units and materials for showing',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      },
      {
        title: 'Operator: Conduct Tour',
        description: 'Show units and amenities to prospect',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 30
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 2,
    escalationRules: []
  },
  {
    id: 'services',
    name: 'Services',
    category: 'Services',
    icon: '🛎️',
    description: 'Concierge or property services',
    estimatedDuration: 30,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Resident: Request Service',
        description: 'Submit service request details',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      },
      {
        title: 'Operator: Coordinate Service',
        description: 'Arrange service with vendor or staff',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      },
      {
        title: 'Operator: Confirm Completion',
        description: 'Verify service has been completed',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 5
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 24,
    escalationRules: []
  },
  {
    id: 'lease-violation',
    name: 'Lease Violation',
    category: 'Administrative',
    icon: '⚠️',
    description: 'Lease violation notice and resolution',
    estimatedDuration: 60,
    allowsReschedule: false,
    defaultTasks: [
      {
        title: 'Operator: Document Violation',
        description: 'Create formal violation report',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 20
      },
      {
        title: 'Resident: Respond to Notice',
        description: 'Provide response to violation notice',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 30
      },
      {
        title: 'Operator: Review Response',
        description: 'Review resident response and determine next steps',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 72,
    escalationRules: []
  },
  {
    id: 'resident-complaint',
    name: 'Resident Complaint',
    category: 'Administrative',
    icon: '📝',
    description: 'Resident complaint submission and resolution',
    estimatedDuration: 45,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Resident: Submit Complaint',
        description: 'File formal complaint with details',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 20
      },
      {
        title: 'Operator: Acknowledge Complaint',
        description: 'Acknowledge receipt and begin investigation',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      },
      {
        title: 'Operator: Provide Resolution',
        description: 'Investigate and provide resolution update',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 48,
    escalationRules: []
  },
  {
    id: 'amenity-reservation',
    name: 'Amenity Reservation',
    category: 'Amenities',
    icon: '🏊',
    description: 'Amenity booking and usage',
    estimatedDuration: 120,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Resident: Book Amenity',
        description: 'Reserve amenity for specified time',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      },
      {
        title: 'Operator: Confirm Booking',
        description: 'Verify amenity availability and confirm',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 5
      },
      {
        title: 'Resident: Check-in for Usage',
        description: 'Check in when using reserved amenity',
        assignedRole: 'resident',
        isRequired: false,
        status: 'available',
        estimatedDuration: 2
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 4,
    escalationRules: []
  },
  {
    id: 'vendor-visit',
    name: 'Vendor Visit',
    category: 'Maintenance',
    icon: '🚚',
    description: 'Vendor access and service coordination',
    estimatedDuration: 90,
    allowsReschedule: true,
    defaultTasks: [
      {
        title: 'Operator: Schedule Vendor',
        description: 'Coordinate vendor visit and access',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 15
      },
      {
        title: 'Resident: Approve Time Window',
        description: 'Confirm availability for vendor access',
        assignedRole: 'resident',
        isRequired: true,
        status: 'available',
        estimatedDuration: 5
      },
      {
        title: 'Operator: Coordinate Access',
        description: 'Ensure vendor has proper access',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      },
      {
        title: 'Operator: Verify Completion',
        description: 'Confirm vendor work has been completed',
        assignedRole: 'operator',
        isRequired: true,
        status: 'available',
        estimatedDuration: 10
      }
    ],
    followUpSequence: [],
    fallbackRules: [],
    overdueThreshold: 24,
    escalationRules: []
  }
];

export const getEventType = (typeId: string): EventType | undefined => {
  return eventTypes.find(type => type.id === typeId);
};

export const getAllEventTypes = (): EventType[] => {
  return eventTypes;
};

export const getEventTypesByCategory = (category: string): EventType[] => {
  return eventTypes.filter(type => type.category === category);
};
