
/**
 * Name utility functions for consistent name handling across the platform
 */

export interface NameFields {
  firstName: string;
  lastName: string;
}

export interface DatabaseNameFields {
  first_name: string;
  last_name: string;
}

/**
 * Safely combines firstName and lastName into a full name
 * Handles undefined values and trims whitespace
 */
export const getFullName = (firstName?: string, lastName?: string): string => {
  const first = (firstName || '').trim();
  const last = (lastName || '').trim();
  
  if (!first && !last) return '';
  if (!first) return last;
  if (!last) return first;
  
  return `${first} ${last}`;
};

/**
 * Maps database snake_case names to frontend camelCase
 */
export const mapDatabaseNamesToFrontend = (data: DatabaseNameFields): NameFields => {
  return {
    firstName: data.first_name || '',
    lastName: data.last_name || ''
  };
};

/**
 * Maps frontend camelCase names to database snake_case
 */
export const mapFrontendNamesToDatabase = (data: NameFields): DatabaseNameFields => {
  return {
    first_name: data.firstName || '',
    last_name: data.lastName || ''
  };
};

/**
 * Merge fields utility for messaging and template personalization
 */
export interface MergeFields extends NameFields {
  fullName: string;
  email?: string;
  unitNumber?: string;
  phone?: string;
}

export const getMergeFields = (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  unitNumber?: string;
  phone?: string;
}): MergeFields => {
  const firstName = data.firstName || '';
  const lastName = data.lastName || '';
  
  return {
    firstName,
    lastName,
    fullName: getFullName(firstName, lastName),
    email: data.email || '',
    unitNumber: data.unitNumber || '',
    phone: data.phone || ''
  };
};
