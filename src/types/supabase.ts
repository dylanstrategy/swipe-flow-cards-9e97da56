export type AppRole = 
  | 'super_admin'
  | 'senior_operator' 
  | 'operator'
  | 'maintenance'
  | 'leasing'
  | 'prospect'
  | 'resident'
  | 'former_resident'
  | 'vendor';

export type UnitStatus = 
  | 'available'
  | 'occupied'
  | 'maintenance'
  | 'turn'
  | 'leased_not_moved_in'
  | 'off_market';

export type UnitReadyStatus = 
  | 'ready'
  | 'maintenance'
  | 'cleaning'
  | 'inspection_pending';

export type PaymentStatus = 
  | 'current'
  | 'late'
  | 'delinquent'
  | 'paid_ahead';

export type PaymentMethod = 
  | 'ach'
  | 'credit_card'
  | 'check'
  | 'cash'
  | 'money_order';

export type DelinquencyStatus = 
  | 'current'
  | 'notice'
  | 'legal'
  | 'eviction';

export type PropertyType = 
  | 'apartment'
  | 'townhouse'
  | 'single_family'
  | 'condo'
  | 'other';

export type MoveInStatus = 'pending' | 'approved' | 'canceled';
export type MoveOutStatus = 'scheduled' | 'completed' | 'canceled';

export type WorkOrderStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type InspectionType = 'move_in' | 'move_out' | 'routine' | 'maintenance';
export type MessageStatus = 'sent' | 'delivered' | 'read';
export type ResidentStatus = 'active' | 'notice' | 'past';
export type ProspectStatus = 'new' | 'touring' | 'applied' | 'approved' | 'denied' | 'converted';
export type FileCategory = 'lease' | 'insurance' | 'inspection' | 'work_order' | 'notice' | 'profile' | 'marketing';

export interface User {
  id: string;
  email: string;
  role: AppRole;
  first_name: string;
  last_name: string;
  phone?: string;
  company_domain?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  property_name: string;
  property_code?: string;
  property_type?: PropertyType;
  management_company?: string;
  total_units?: number;
  
  // Address information
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  
  // Operational details
  timezone?: string;
  default_rent_due_day?: number;
  default_late_fee_policy?: string;
  
  // Contact information
  maintenance_contact_email?: string;
  cleaning_contact_email?: string;
  on_site_contact_phone?: string;
  super_operator_email?: string;
  
  // Policies and thresholds
  auto_late_fee_threshold?: number;
  auto_legal_threshold?: number;
  allow_guests?: boolean;
  default_inspection_required?: boolean;
  
  // Amenities and services
  concierge_available?: boolean;
  concierge_hours?: string;
  concierge_contact?: string;
  available_wifi_providers?: string[];
  amenity_wifi_name?: string;
  amenity_wifi_password?: string;
  guest_wifi_available?: boolean;
  
  // Operational schedules
  trash_pickup_schedule?: string;
  recycling_schedule?: string;
  move_in_instructions?: string;
  door_access_system?: string;
  on_site_support_hours?: string;
  
  // Tags and categorization
  property_tags?: string[];
  unit_feature_tags?: string[];
  lifestyle_tags?: string[];
  
  // NEW FIELDS ADDED
  unit_count?: number;
  recycling_pickup_schedule?: string;
  utility_company?: string;
  utility_contact?: string;
  super_contact?: string;
  late_fee_policy?: string;
  late_fee_threshold?: number;
  
  // Legacy fields for compatibility
  name?: string; // Alias for property_name
  address?: string; // Alias for address_line_1
  website?: string;
  amenities?: string;
  parking_info?: string;
  pet_policy?: string;
  smoking_policy?: string;
  special_instructions?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  maintenance_company?: string;
  maintenance_contact?: string;
  maintenance_phone?: string;
  leasing_office_hours?: string;
  property_manager_name?: string;
  property_manager_email?: string;
  property_manager_phone?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  property_id: string;
  
  // Unit identification
  unit_number: string;
  unit_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  sq_ft?: number;
  
  // Status and availability
  unit_status?: UnitStatus;
  unit_ready_status?: UnitReadyStatus;
  inspection_completed?: boolean;
  
  // Rent and financial information
  market_rent?: number;
  
  // Legacy fields for compatibility
  bedroom_type?: string;
  bath_type?: string;
  status?: UnitStatus; // Alias for unit_status
  lease_start?: string;
  lease_end?: string;
  current_resident_id?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Resident {
  id: string;
  user_id?: string;
  property_id: string;
  unit_id?: string;
  
  // Personal identification
  id_number?: string;
  
  // Contact and personal info
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  
  // Personal address information
  personal_address?: string;
  personal_city?: string;
  personal_state?: string;
  personal_zip?: string;
  
  // Company information
  employer?: string;
  company_name?: string;
  company_address?: string;
  company_city?: string;
  company_state?: string;
  company_zip?: string;
  gross_monthly_income?: number;
  
  // Lease information
  move_in_date?: string;
  move_out_date?: string;
  lease_start_date?: string;
  lease_end_date?: string;
  lease_term?: number;
  months_at_property?: number;
  is_active?: boolean;
  
  // Rent and financial details
  monthly_rent?: number;
  concession_amount?: number;
  net_effective_rent?: number;
  deposit_amount?: number;
  balance_due?: number;
  additional_charges?: number;
  late_fee_count?: number;
  loss_to_lease?: number;
  
  // Payment information
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  last_payment_amount?: number;
  last_payment_date?: string;
  auto_pay_enabled?: boolean;
  delinquency_status?: DelinquencyStatus;
  
  // Service setup and onboarding
  utilities_account_number?: string;
  renter_insurance_uploaded?: boolean;
  pseg_setup?: boolean;
  smart_access_setup?: boolean;
  carson_app_setup?: boolean;
  
  // Onboarding checklist
  move_in_checklist_complete?: boolean;
  move_out_checklist_complete?: boolean;
  gift_delivered?: boolean;
  welcome_email_sent?: boolean;
  
  // Assignment information
  assigned_operator_name?: string;
  assigned_operator_email?: string;
  assigned_vendor_name?: string;
  assigned_vendor_email?: string;
  maintenance_provider?: string;
  cleaning_provider?: string;
  
  // Additional information
  pet?: string;
  marketing_source?: string;
  resident_tags?: string[];
  custom_notes?: string;
  
  // Legacy status fields
  status?: ResidentStatus;
  onboarding_status?: string;
  insurance_uploaded?: boolean; // Alias for renter_insurance_uploaded
  lease_start?: string; // Alias for lease_start_date
  lease_end?: string; // Alias for lease_end_date
  
  created_at: string;
  updated_at: string;
}

export interface Prospect {
  id: string;
  name: string;
  email: string;
  phone?: string;
  property_id?: string;
  tour_date?: string;
  application_status: ProspectStatus;
  converted_to_resident: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkOrder {
  id: string;
  unit_id: string;
  resident_id?: string;
  category: string;
  description: string;
  images?: string[];
  status: WorkOrderStatus;
  created_by: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Inspection {
  id: string;
  type: InspectionType;
  performed_by: string;
  resident_id?: string;
  unit_id: string;
  images?: string[];
  videos?: string[];
  notes?: string;
  completed_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  from_id: string;
  to_id: string;
  topic?: string;
  body: string;
  timestamp: string;
  status: MessageStatus;
  created_at: string;
}

export interface FileRecord {
  id: string;
  user_id: string;
  resident_id?: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  category: FileCategory;
  created_at: string;
}

export interface UnitStatusLog {
  id: string;
  unit_id: string;
  old_status?: UnitStatus;
  new_status: UnitStatus;
  changed_by: string;
  changed_at: string;
  notes?: string;
}

export interface MoveIn {
  id: string;
  resident_id: string;
  unit_id: string;
  lease_signed_date?: string;
  lease_start_date: string;
  balance_due: number;
  checklist_completed: boolean;
  status: MoveInStatus;
  created_at: string;
  updated_at: string;
}

export interface MoveOut {
  id: string;
  resident_id: string;
  unit_id: string;
  move_out_date: string;
  notice_to_vacate_signed: boolean;
  forwarding_address?: string;
  inspection_video_link?: string;
  checklist_completed: boolean;
  status: MoveOutStatus;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  event_type: string;
  related_user_id?: string;
  related_unit_id?: string;
  created_by: string;
  created_at: string;
}
