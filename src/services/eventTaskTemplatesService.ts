
import { Role } from '@/types/roles';

export interface TaskTemplate {
  name: string;
  role: Role;
}

export const eventTaskTemplates: Record<string, TaskTemplate[]> = {
  "move-in": [
    { "name": "Sign Lease", "role": "resident" },
    { "name": "Make Payment", "role": "resident" },
    { "name": "Upload Insurance", "role": "resident" },
    { "name": "Set Up Utilities", "role": "resident" },
    { "name": "Book Inspection", "role": "resident" },
    { "name": "Review Community Guidelines", "role": "resident" },
    { "name": "Final Inspection", "role": "operator" },
    { "name": "Prepare Gift Package", "role": "operator" },
    { "name": "Access Setup (Fob/App)", "role": "operator" },
    { "name": "Confirm Keys Issued", "role": "operator" }
  ],
  "move-out": [
    { "name": "Submit Notice", "role": "resident" },
    { "name": "Confirm Move-Out Date", "role": "resident" },
    { "name": "Complete Exit Survey", "role": "resident" },
    { "name": "Schedule Final Inspection", "role": "operator" },
    { "name": "Revoke Access", "role": "operator" },
    { "name": "Confirm Key Return", "role": "operator" }
  ],
  "lease": [
    { "name": "Upload Lease Template", "role": "operator" },
    { "name": "Assign Lease", "role": "operator" },
    { "name": "Set Lease Expiration", "role": "operator" },
    { "name": "Sign Lease", "role": "resident" },
    { "name": "Pay Initial Deposit", "role": "resident" },
    { "name": "Confirm Renter's Insurance", "role": "resident" }
  ],
  "lease-signing": [
    { "name": "Upload Lease Template", "role": "operator" },
    { "name": "Assign Lease", "role": "operator" },
    { "name": "Set Lease Expiration", "role": "operator" },
    { "name": "Sign Lease", "role": "resident" },
    { "name": "Pay Initial Deposit", "role": "resident" },
    { "name": "Confirm Renter's Insurance", "role": "resident" }
  ],
  "tour": [
    { "name": "Confirm RSVP", "role": "prospect" },
    { "name": "Confirm Unit Availability", "role": "operator" },
    { "name": "Mark Tour Complete", "role": "operator" },
    { "name": "Log Tour Notes", "role": "operator" }
  ],
  "work-order": [
    { "name": "Submit Request with Photos", "role": "resident" },
    { "name": "Diagnose Issue", "role": "maintenance" },
    { "name": "Resolve Issue", "role": "maintenance" },
    { "name": "Upload Completion Photo", "role": "maintenance" },
    { "name": "Approve Work Completion", "role": "operator" }
  ],
  "amenity-reservation": [
    { "name": "Select Amenity Time", "role": "resident" },
    { "name": "Agree to Amenity Rules", "role": "resident" },
    { "name": "Pay Amenity Fee", "role": "resident" },
    { "name": "Confirm Booking", "role": "operator" },
    { "name": "Grant Amenity Access", "role": "operator" }
  ],
  "community-event": [
    { "name": "Publish Event Details", "role": "operator" },
    { "name": "Set RSVP Deadline", "role": "operator" },
    { "name": "Set Attendance Limit", "role": "operator" },
    { "name": "RSVP to Event", "role": "resident" },
    { "name": "Add Guest (Optional)", "role": "resident" },
    { "name": "Confirm Attendance", "role": "resident" }
  ],
  "inspection": [
    { "name": "Schedule Inspection", "role": "operator" },
    { "name": "Perform Inspection", "role": "maintenance" },
    { "name": "Upload Inspection Report", "role": "operator" },
    { "name": "Confirm Inspection Time", "role": "resident" },
    { "name": "Acknowledge Condition", "role": "resident" }
  ],
  "message": [
    { "name": "Acknowledge Message", "role": "resident" },
    { "name": "Reply to Message", "role": "operator" }
  ],
  "collections": [
    { "name": "Generate Ledger Statement", "role": "operator" },
    { "name": "Send Balance Reminder", "role": "operator" },
    { "name": "Log Follow-Up", "role": "operator" },
    { "name": "Acknowledge Balance Due", "role": "resident" },
    { "name": "Submit Payment Plan", "role": "resident" }
  ]
};

export const getTasksForEventType = (eventType: string): TaskTemplate[] => {
  return eventTaskTemplates[eventType] || [];
};

export const getTasksForUserRole = (eventType: string, userRole: Role): TaskTemplate[] => {
  const allTasks = getTasksForEventType(eventType);
  return allTasks.filter(task => task.role === userRole || userRole === 'operator');
};
