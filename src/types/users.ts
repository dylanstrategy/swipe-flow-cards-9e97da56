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
  firstName: string;
  lastName: string;
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

export type UserRole = 'resident' | 'prospect' | 'operator' | 'senior_operator' | 'maintenance' | 'leasing' | 'management';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'maintenance' | 'leasing' | 'management' | 'messaging' | 'billing' | 'user_management';
  level: 'basic' | 'advanced' | 'admin';
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  permissions: string[];
  sendWelcomeEmail: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  resident: [
    { id: 'submit_maintenance', name: 'Submit Maintenance Requests', description: 'Can create work orders', category: 'maintenance', level: 'basic' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view and send messages', category: 'messaging', level: 'basic' },
    { id: 'view_billing', name: 'View Billing', description: 'Can view payment history', category: 'billing', level: 'basic' }
  ],
  prospect: [
    { id: 'schedule_tours', name: 'Schedule Tours', description: 'Can schedule property tours', category: 'leasing', level: 'basic' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view and send messages', category: 'messaging', level: 'basic' }
  ],
  maintenance: [
    { id: 'manage_work_orders', name: 'Manage Work Orders', description: 'Can view and update work orders', category: 'maintenance', level: 'advanced' },
    { id: 'manage_inventory', name: 'Manage Inventory', description: 'Can update inventory levels', category: 'maintenance', level: 'advanced' },
    { id: 'manage_vendors', name: 'Manage Vendors', description: 'Can contact and manage vendors', category: 'maintenance', level: 'advanced' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view and send messages', category: 'messaging', level: 'basic' }
  ],
  leasing: [
    { id: 'manage_prospects', name: 'Manage Prospects', description: 'Can manage prospect pipeline', category: 'leasing', level: 'advanced' },
    { id: 'manage_tours', name: 'Manage Tours', description: 'Can schedule and conduct tours', category: 'leasing', level: 'advanced' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view and send messages', category: 'messaging', level: 'basic' },
    { id: 'view_billing', name: 'View Billing', description: 'Can view resident billing', category: 'billing', level: 'basic' }
  ],
  operator: [
    { id: 'create_basic_users', name: 'Create Basic Users', description: 'Can create maintenance and leasing users', category: 'user_management', level: 'advanced' },
    { id: 'manage_work_orders', name: 'Manage Work Orders', description: 'Can oversee all maintenance', category: 'maintenance', level: 'advanced' },
    { id: 'manage_prospects', name: 'Manage Prospects', description: 'Can oversee leasing pipeline', category: 'leasing', level: 'advanced' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view all messages', category: 'messaging', level: 'advanced' },
    { id: 'manage_billing', name: 'Manage Billing', description: 'Can manage all billing', category: 'billing', level: 'advanced' }
  ],
  senior_operator: [
    { id: 'create_all_users', name: 'Create All Users', description: 'Can create any type of user including operators', category: 'user_management', level: 'admin' },
    { id: 'manage_users', name: 'Manage All Users', description: 'Can edit and delete all user accounts', category: 'user_management', level: 'admin' },
    { id: 'manage_work_orders', name: 'Manage Work Orders', description: 'Can oversee all maintenance', category: 'maintenance', level: 'admin' },
    { id: 'manage_prospects', name: 'Manage Prospects', description: 'Can oversee leasing pipeline', category: 'leasing', level: 'admin' },
    { id: 'view_messages', name: 'View Messages', description: 'Can view all messages', category: 'messaging', level: 'admin' },
    { id: 'manage_billing', name: 'Manage Billing', description: 'Can manage all billing', category: 'billing', level: 'admin' },
    { id: 'system_settings', name: 'System Settings', description: 'Can modify system-wide settings', category: 'management', level: 'admin' }
  ],
  management: [
    { id: 'full_access', name: 'Full Access', description: 'Complete system access', category: 'management', level: 'admin' }
  ]
};
