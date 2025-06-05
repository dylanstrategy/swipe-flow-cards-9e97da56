
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

export interface Resident {
  id: string;
  user_id: string;
  property_id: string;
  unit_id?: string;
  lease_start?: string;
  lease_end?: string;
  status: ResidentStatus;
  insurance_uploaded: boolean;
  onboarding_status: string;
  move_in_checklist_complete: boolean;
  move_out_checklist_complete: boolean;
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

export interface Property {
  id: string;
  name: string;
  address: string;
  senior_operator_id?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  floor?: number;
  sq_ft?: number;
  bedroom_type?: string;
  bath_type?: string;
  status: UnitStatus;
  lease_start?: string;
  lease_end?: string;
  current_resident_id?: string;
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
