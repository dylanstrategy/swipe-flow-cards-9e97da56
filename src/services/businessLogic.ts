import type { AppRole } from '@/types/supabase';

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<AppRole, number> = {
  super_admin: 100,
  senior_operator: 80,
  operator: 60,
  maintenance: 40,
  leasing: 50,
  resident: 20,
  prospect: 10,
  former_resident: 5,
  vendor: 30
};

// Function to check if a user has permission based on role hierarchy
export const hasPermission = (userRole: AppRole, requiredRole: AppRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Example function to count users by role
export const countUsersByRole = (users: any[]): Record<AppRole, number> => {
  const roleCounts: Record<AppRole, number> = {
    super_admin: 0,
    senior_operator: 0,
    operator: 0,
    maintenance: 0,
    leasing: 0,
    resident: 0,
    prospect: 0,
    former_resident: 0,
    vendor: 0,
  };

  users.forEach(user => {
    if (user.role in roleCounts) {
      roleCounts[user.role]++;
    }
  });

  return roleCounts;
};

export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
};

export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: string | Date, locale = 'en-US', options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const mergedOptions = { ...defaultOptions, ...options };
  return new Intl.DateTimeFormat(locale, mergedOptions).format(new Date(date));
};
