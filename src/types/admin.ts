
export interface Company {
  id: string;
  name: string;
  domain?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan_type: 'basic' | 'standard' | 'premium' | 'enterprise';
  created_at: Date;
  updated_at: Date;
}

export interface Property {
  id: string;
  company_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  unit_count: number;
  property_type: 'apartment' | 'condo' | 'house' | 'townhouse' | 'commercial';
  status: 'active' | 'inactive' | 'maintenance';
  created_at: Date;
  updated_at: Date;
  company?: Company;
}

export interface AdminStats {
  totalCompanies: number;
  totalProperties: number;
  totalUsers: number;
  activeUsers: number;
  recentSignups: number;
}
