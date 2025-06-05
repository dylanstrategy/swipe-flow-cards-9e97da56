
export interface ResidentProfile {
  id: string;
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  unitNumber: string;
  unitId: string;
  status: 'current' | 'future' | 'notice' | 'prospect' | 'past';
  leaseStatus: 'active' | 'expiring' | 'delinquent' | 'move_in_progress' | 'prospect' | 'expired';
  moveInDate: string;
  moveOutDate?: string;
  leaseEndDate: string;
  currentRent: number;
  balance: number;
  birthdate: string;
  workOrders: number;
  renewalStatus: 'pending' | 'offered' | 'not_due' | 'declined';
  hasMoveInProgress: boolean;
  hasMoveOutProgress: boolean;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents: {
    id: number;
    name: string;
    type: 'lease' | 'id' | 'application' | 'legal';
    uploadDate: string;
    size: string;
  }[];
}

// Generate 90 current residents + 5 future residents + 5 vacant units = 100 units
export const mockResidents: ResidentProfile[] = [
  // Current Residents (90)
  {
    id: '1',
    fullName: 'Sarah Johnson',
    preferredName: 'Sarah',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    unitNumber: '102',
    unitId: 'unit-2',
    status: 'current',
    leaseStatus: 'active',
    moveInDate: '2023-06-15',
    leaseEndDate: '2024-06-14',
    currentRent: 2450,
    balance: 0,
    birthdate: '1985-03-15',
    workOrders: 1,
    renewalStatus: 'pending',
    hasMoveInProgress: false,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: 'John Johnson',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    },
    documents: [
      { id: 1, name: 'Lease Agreement.pdf', type: 'lease', uploadDate: '2023-06-10', size: '2.3 MB' },
      { id: 2, name: 'Driver License.jpg', type: 'id', uploadDate: '2023-06-10', size: '1.1 MB' }
    ]
  },
  {
    id: '2',
    fullName: 'Michael Chen',
    preferredName: 'Mike',
    email: 'michael.chen@email.com',
    phone: '(555) 234-5678',
    unitNumber: '204',
    unitId: 'unit-14',
    status: 'current',
    leaseStatus: 'active',
    moveInDate: '2022-08-20',
    leaseEndDate: '2025-08-19',
    currentRent: 2900,
    balance: 0,
    birthdate: '1990-11-22',
    workOrders: 0,
    renewalStatus: 'not_due',
    hasMoveInProgress: false,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: 'Linda Chen',
      phone: '(555) 345-6789',
      relationship: 'Mother'
    },
    documents: [
      { id: 3, name: 'Lease Agreement.pdf', type: 'lease', uploadDate: '2022-08-15', size: '2.1 MB' }
    ]
  },
  {
    id: '3',
    fullName: 'Emily Rodriguez',
    preferredName: 'Emily',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 345-6789',
    unitNumber: '306',
    unitId: 'unit-26',
    status: 'current',
    leaseStatus: 'active',
    moveInDate: '2023-11-10',
    leaseEndDate: '2024-11-09',
    currentRent: 3650,
    balance: 0,
    birthdate: '1988-07-08',
    workOrders: 2,
    renewalStatus: 'not_due',
    hasMoveInProgress: false,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: 'Carlos Rodriguez',
      phone: '(555) 456-7890',
      relationship: 'Brother'
    },
    documents: [
      { id: 4, name: 'Lease Agreement.pdf', type: 'lease', uploadDate: '2023-11-05', size: '2.2 MB' }
    ]
  },
  {
    id: '4',
    fullName: 'David Thompson',
    preferredName: 'Dave',
    email: 'david.thompson@email.com',
    phone: '(555) 456-7890',
    unitNumber: '408',
    unitId: 'unit-38',
    status: 'current',
    leaseStatus: 'delinquent',
    moveInDate: '2023-03-05',
    leaseEndDate: '2024-03-04',
    currentRent: 3700,
    balance: 850.00,
    birthdate: '1982-12-03',
    workOrders: 1,
    renewalStatus: 'not_due',
    hasMoveInProgress: false,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: 'Mary Thompson',
      phone: '(555) 567-8901',
      relationship: 'Wife'
    },
    documents: [
      { id: 5, name: 'Lease Agreement.pdf', type: 'lease', uploadDate: '2023-03-01', size: '2.4 MB' },
      { id: 6, name: 'Late Notice.pdf', type: 'legal', uploadDate: '2024-01-15', size: '180 KB' }
    ]
  },
  {
    id: '5',
    fullName: 'Jessica Parker',
    preferredName: 'Jess',
    email: 'jessica.parker@email.com',
    phone: '(555) 567-8901',
    unitNumber: '510',
    unitId: 'unit-50',
    status: 'current',
    leaseStatus: 'active',
    moveInDate: '2023-01-15',
    leaseEndDate: '2024-01-14',
    currentRent: 5200,
    balance: 0,
    birthdate: '1995-04-12',
    workOrders: 0,
    renewalStatus: 'pending',
    hasMoveInProgress: false,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: 'Robert Parker',
      phone: '(555) 678-9012',
      relationship: 'Father'
    },
    documents: [
      { id: 7, name: 'Lease Agreement.pdf', type: 'lease', uploadDate: '2023-01-10', size: '2.5 MB' }
    ]
  },
  // Add 85 more current residents (abbreviated for space)
  ...Array.from({ length: 85 }, (_, index) => ({
    id: (index + 6).toString(),
    fullName: `Resident ${index + 6}`,
    preferredName: `Resident ${index + 6}`,
    email: `resident${index + 6}@email.com`,
    phone: `(555) ${(123 + index).toString().padStart(3, '0')}-${(4567 + index).toString().padStart(4, '0')}`,
    unitNumber: `${Math.floor((index + 5) / 10) + 1}${((index + 5) % 10 + 1).toString().padStart(2, '0')}`,
    unitId: `unit-${index + 6}`,
    status: 'current' as const,
    leaseStatus: Math.random() > 0.9 ? 'expiring' as const : 'active' as const,
    moveInDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    leaseEndDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    currentRent: 2400 + Math.floor(Math.random() * 3000),
    balance: Math.random() > 0.85 ? Math.floor(Math.random() * 1000) : 0,
    birthdate: `${1980 + Math.floor(Math.random() * 25)}-${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
    workOrders: Math.floor(Math.random() * 3),
    renewalStatus: Math.random() > 0.7 ? 'pending' as const : 'not_due' as const,
    hasMoveInProgress: false,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: `Emergency Contact ${index + 6}`,
      phone: `(555) ${(234 + index).toString().padStart(3, '0')}-${(5678 + index).toString().padStart(4, '0')}`,
      relationship: ['Spouse', 'Parent', 'Sibling', 'Friend'][Math.floor(Math.random() * 4)]
    },
    documents: [
      { id: index + 8, name: 'Lease Agreement.pdf', type: 'lease' as const, uploadDate: '2023-01-01', size: '2.3 MB' }
    ]
  })),
  
  // Future Residents (5) - staggered move-in dates
  {
    id: '91',
    fullName: 'April Chen',
    preferredName: 'April',
    email: 'april.chen@email.com',
    phone: '(555) 991-0001',
    unitNumber: '701',
    unitId: 'unit-91',
    status: 'future',
    leaseStatus: 'move_in_progress',
    moveInDate: '2025-06-15',
    leaseEndDate: '2026-06-14',
    currentRent: 2500,
    balance: 0,
    birthdate: '1992-08-15',
    workOrders: 0,
    renewalStatus: 'not_due',
    hasMoveInProgress: true,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: 'David Chen',
      phone: '(555) 991-0002',
      relationship: 'Brother'
    },
    documents: [
      { id: 101, name: 'Application.pdf', type: 'application', uploadDate: '2025-05-15', size: '1.2 MB' }
    ]
  },
  {
    id: '92',
    fullName: 'Zhihan He',
    preferredName: 'Zhihan',
    email: 'zhihan.he@email.com',
    phone: '(555) 992-0002',
    unitNumber: '702',
    unitId: 'unit-92',
    status: 'future',
    leaseStatus: 'move_in_progress',
    moveInDate: '2025-06-22',
    leaseEndDate: '2026-06-21',
    currentRent: 2850,
    balance: 0,
    birthdate: '1994-03-10',
    workOrders: 0,
    renewalStatus: 'not_due',
    hasMoveInProgress: true,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: 'Li He',
      phone: '(555) 992-0003',
      relationship: 'Parent'
    },
    documents: [
      { id: 102, name: 'Application.pdf', type: 'application', uploadDate: '2025-05-20', size: '1.1 MB' }
    ]
  },
  {
    id: '93',
    fullName: 'Marcus Williams',
    preferredName: 'Marcus',
    email: 'marcus.williams@email.com',
    phone: '(555) 993-0003',
    unitNumber: '703',
    unitId: 'unit-93',
    status: 'future',
    leaseStatus: 'move_in_progress',
    moveInDate: '2025-07-01',
    leaseEndDate: '2026-06-30',
    currentRent: 3600,
    balance: 0,
    birthdate: '1989-11-25',
    workOrders: 0,
    renewalStatus: 'not_due',
    hasMoveInProgress: true,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: 'Sarah Williams',
      phone: '(555) 993-0004',
      relationship: 'Spouse'
    },
    documents: [
      { id: 103, name: 'Application.pdf', type: 'application', uploadDate: '2025-05-25', size: '1.3 MB' }
    ]
  },
  {
    id: '94',
    fullName: 'Amanda Garcia',
    preferredName: 'Amanda',
    email: 'amanda.garcia@email.com',
    phone: '(555) 994-0004',
    unitNumber: '704',
    unitId: 'unit-94',
    status: 'future',
    leaseStatus: 'move_in_progress',
    moveInDate: '2025-07-15',
    leaseEndDate: '2026-07-14',
    currentRent: 5300,
    balance: 0,
    birthdate: '1987-06-18',
    workOrders: 0,
    renewalStatus: 'not_due',
    hasMoveInProgress: true,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '(555) 994-0005',
      relationship: 'Father'
    },
    documents: [
      { id: 104, name: 'Application.pdf', type: 'application', uploadDate: '2025-06-01', size: '1.4 MB' }
    ]
  },
  {
    id: '95',
    fullName: 'Kevin Zhang',
    preferredName: 'Kevin',
    email: 'kevin.zhang@email.com',
    phone: '(555) 995-0005',
    unitNumber: '705',
    unitId: 'unit-95',
    status: 'future',
    leaseStatus: 'move_in_progress',
    moveInDate: '2025-08-01',
    leaseEndDate: '2026-07-31',
    currentRent: 2900,
    balance: 0,
    birthdate: '1991-09-12',
    workOrders: 0,
    renewalStatus: 'not_due',
    hasMoveInProgress: true,
    hasMoveOutProgress: false,
    emergencyContact: {
      name: 'Lisa Zhang',
      phone: '(555) 995-0006',
      relationship: 'Sister'
    },
    documents: [
      { id: 105, name: 'Application.pdf', type: 'application', uploadDate: '2025-06-05', size: '1.0 MB' }
    ]
  }
];

// Units that are vacant (5 units)
export const vacantUnits = [
  'unit-96', 'unit-97', 'unit-98', 'unit-99', 'unit-100'
];
