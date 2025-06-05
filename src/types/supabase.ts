
export type AppRole = 
  | 'super_admin'
  | 'senior_operator' 
  | 'operator'
  | 'maintenance'
  | 'leasing'
  | 'prospect'
  | 'resident'
  | 'former_resident';

export type UnitStatus = 
  | 'available'
  | 'occupied'
  | 'maintenance'
  | 'turn'
  | 'leased_not_moved_in'
  | 'off_market';

export type MoveInStatus = 'pending' | 'approved' | 'canceled';
export type MoveOutStatus = 'scheduled' | 'completed' | 'canceled';

export interface User {
  id: string;
  email: string;
  role: AppRole;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  operator_id: string;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  bed_count: number;
  bath_count: number;
  status: UnitStatus;
  lease_start?: string;
  lease_end?: string;
  current_resident_id?: string;
  created_at: string;
  updated_at: string;
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
