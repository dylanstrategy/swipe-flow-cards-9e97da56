
export interface ContactInfo {
  email: string;
  phone: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  permissions: Permission[];
  contactInfo: ContactInfo;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  lastLogin?: Date;
  createdBy?: string; // ID of operator who created this user
}

export type UserRole = 'resident' | 'prospect' | 'operator' | 'maintenance' | 'leasing' | 'management';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'maintenance' | 'leasing' | 'management' | 'messaging' | 'billing';
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  permissions: string[];
  sendWelcomeEmail: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  resident: [
    { id: 'submit_maintenance', name: 'Submit Maintenance Requests', description: 'Can create work orders', category: 'maintenance' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view and send messages', category: 'messaging' },
    { id: 'view_billing', name: 'View Billing', description: 'Can view payment history', category: 'billing' }
  ],
  prospect: [
    { id: 'schedule_tours', name: 'Schedule Tours', description: 'Can schedule property tours', category: 'leasing' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view and send messages', category: 'messaging' }
  ],
  maintenance: [
    { id: 'manage_work_orders', name: 'Manage Work Orders', description: 'Can view and update work orders', category: 'maintenance' },
    { id: 'manage_inventory', name: 'Manage Inventory', description: 'Can update inventory levels', category: 'maintenance' },
    { id: 'manage_vendors', name: 'Manage Vendors', description: 'Can contact and manage vendors', category: 'maintenance' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view and send messages', category: 'messaging' }
  ],
  leasing: [
    { id: 'manage_prospects', name: 'Manage Prospects', description: 'Can manage prospect pipeline', category: 'leasing' },
    { id: 'manage_tours', name: 'Manage Tours', description: 'Can schedule and conduct tours', category: 'leasing' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view and send messages', category: 'messaging' },
    { id: 'view_billing', name: 'View Billing', description: 'Can view resident billing', category: 'billing' }
  ],
  operator: [
    { id: 'manage_users', name: 'Manage Users', description: 'Can create and manage all user accounts', category: 'management' },
    { id: 'manage_work_orders', name: 'Manage Work Orders', description: 'Can oversee all maintenance', category: 'maintenance' },
    { id: 'manage_prospects', name: 'Manage Prospects', description: 'Can oversee leasing pipeline', category: 'leasing' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view all messages', category: 'messaging' },
    { id: 'manage_billing', name: 'Manage Billing', description: 'Can manage all billing', category: 'billing' }
  ],
  management: [
    { id: 'full_access', name: 'Full Access', description: 'Complete system access', category: 'management' }
  ]
};
