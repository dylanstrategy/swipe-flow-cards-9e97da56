
import { supabase } from '@/integrations/supabase/client';
import type { MoveIn, MoveOut, Unit, AppRole } from '@/types/supabase';

export interface MoveInValidation {
  canMoveIn: boolean;
  blockers: string[];
}

export interface MoveOutValidation {
  canMoveOut: boolean;
  blockers: string[];
}

export async function validateMoveIn(moveInId: string): Promise<MoveInValidation> {
  try {
    const { data: moveIn, error } = await supabase
      .from('move_ins')
      .select('*')
      .eq('id', moveInId)
      .single();

    if (error || !moveIn) {
      return { canMoveIn: false, blockers: ['Move-in record not found'] };
    }

    const blockers: string[] = [];
    const today = new Date();
    const leaseStart = new Date(moveIn.lease_start_date);

    // Check if lease start date is on or before today
    if (leaseStart > today) {
      blockers.push('Lease start date has not arrived yet');
    }

    // Check if balance is fully paid
    if (moveIn.balance_due > 0) {
      blockers.push('Outstanding balance must be paid in full');
    }

    // Check if checklist is complete
    if (!moveIn.checklist_completed) {
      blockers.push('Move-in checklist must be 100% complete');
    }

    return { canMoveIn: blockers.length === 0, blockers };
  } catch (error) {
    console.error('Error validating move-in:', error);
    return { canMoveIn: false, blockers: ['System error during validation'] };
  }
}

export async function validateMoveOut(moveOutId: string): Promise<MoveOutValidation> {
  try {
    const { data: moveOut, error } = await supabase
      .from('move_outs')
      .select('*')
      .eq('id', moveOutId)
      .single();

    if (error || !moveOut) {
      return { canMoveOut: false, blockers: ['Move-out record not found'] };
    }

    const blockers: string[] = [];

    // Check if Notice to Vacate is signed
    if (!moveOut.notice_to_vacate_signed) {
      blockers.push('Notice to Vacate must be signed');
    }

    // Check if forwarding address is provided
    if (!moveOut.forwarding_address || moveOut.forwarding_address.trim() === '') {
      blockers.push('Forwarding address must be provided');
    }

    // Check if checklist is complete
    if (!moveOut.checklist_completed) {
      blockers.push('Move-out checklist must be 100% complete');
    }

    // Check if inspection video is uploaded
    if (!moveOut.inspection_video_link) {
      blockers.push('Move-out inspection video must be uploaded');
    }

    return { canMoveOut: blockers.length === 0, blockers };
  } catch (error) {
    console.error('Error validating move-out:', error);
    return { canMoveOut: false, blockers: ['System error during validation'] };
  }
}

export async function updateUnitStatus(
  unitId: string, 
  newStatus: Unit['status'], 
  changedBy: string,
  notes?: string
) {
  try {
    // Get current unit status
    const { data: unit, error: unitError } = await supabase
      .from('units')
      .select('status')
      .eq('id', unitId)
      .single();

    if (unitError || !unit) {
      throw new Error('Unit not found');
    }

    // Update unit status
    const { error: updateError } = await supabase
      .from('units')
      .update({ status: newStatus })
      .eq('id', unitId);

    if (updateError) throw updateError;

    // Log the status change
    const { error: logError } = await supabase
      .from('unit_status_logs')
      .insert({
        unit_id: unitId,
        old_status: unit.status,
        new_status: newStatus,
        changed_by: changedBy,
        notes
      });

    if (logError) throw logError;

    // Create calendar event for status change
    await createCalendarEvent({
      title: `Unit Status Changed: ${newStatus}`,
      description: notes || `Unit status changed from ${unit.status} to ${newStatus}`,
      event_date: new Date().toISOString().split('T')[0],
      event_type: 'unit_status_change',
      related_unit_id: unitId,
      created_by: changedBy
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating unit status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createCalendarEvent(event: Omit<import('@/types/supabase').CalendarEvent, 'id' | 'created_at'>) {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .insert(event);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function submitNoticeToVacate(
  residentId: string,
  unitId: string,
  moveOutDate: string,
  forwardingAddress: string
) {
  try {
    // Create move-out record
    const { data: moveOut, error: moveOutError } = await supabase
      .from('move_outs')
      .insert({
        resident_id: residentId,
        unit_id: unitId,
        move_out_date: moveOutDate,
        notice_to_vacate_signed: true,
        forwarding_address: forwardingAddress,
        status: 'scheduled'
      })
      .select()
      .single();

    if (moveOutError) throw moveOutError;

    // Update user role to indicate notice period
    const { error: userError } = await supabase
      .from('users')
      .update({ role: 'resident' }) // Keep as resident during notice period
      .eq('id', residentId);

    if (userError) throw userError;

    // Create calendar event
    await createCalendarEvent({
      title: 'Move-Out Scheduled',
      description: `Resident submitted notice to vacate for ${moveOutDate}`,
      event_date: moveOutDate,
      event_type: 'move_out',
      related_user_id: residentId,
      related_unit_id: unitId,
      created_by: residentId
    });

    return { success: true, moveOut };
  } catch (error) {
    console.error('Error submitting notice to vacate:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export function hasPermission(userRole: AppRole, requiredRoles: AppRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function canAccessRole(currentRole: AppRole, targetRole: AppRole): boolean {
  const roleHierarchy: Record<AppRole, number> = {
    'super_admin': 8,
    'senior_operator': 7,
    'operator': 6,
    'maintenance': 5,
    'leasing': 5,
    'resident': 3,
    'prospect': 2,
    'former_resident': 1
  };

  return roleHierarchy[currentRole] >= roleHierarchy[targetRole];
}
