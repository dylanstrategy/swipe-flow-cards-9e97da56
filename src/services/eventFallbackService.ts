
import { UniversalEvent, FallbackRule, EscalationRule } from '@/types/eventTasks';
import { getEventType } from '@/services/eventTypeService';
import { emailAutomationService } from '@/services/emailAutomationService';

export interface FallbackAction {
  eventId: string;
  ruleId: string;
  action: string;
  triggeredAt: Date;
  reason: string;
  result: string;
}

export class EventFallbackService {
  private static instance: EventFallbackService;
  private fallbackHistory: FallbackAction[] = [];
  
  public static getInstance(): EventFallbackService {
    if (!EventFallbackService.instance) {
      EventFallbackService.instance = new EventFallbackService();
    }
    return EventFallbackService.instance;
  }

  async checkEventFallbacks(event: UniversalEvent): Promise<void> {
    const eventType = getEventType(event.type);
    if (!eventType || !eventType.fallbackRules) return;

    for (const rule of eventType.fallbackRules) {
      const shouldTrigger = await this.evaluateFallbackCondition(event, rule);
      
      if (shouldTrigger) {
        await this.executeFallbackAction(event, rule);
      }
    }
  }

  async checkEventEscalations(event: UniversalEvent): Promise<void> {
    const eventType = getEventType(event.type);
    if (!eventType || !eventType.escalationRules) return;

    const now = new Date();
    const eventDateTime = new Date(event.date);
    eventDateTime.setHours(
      parseInt(event.time.split(':')[0]),
      parseInt(event.time.split(':')[1])
    );

    const hoursOverdue = (now.getTime() - eventDateTime.getTime()) / (1000 * 60 * 60);

    for (const rule of eventType.escalationRules) {
      if (hoursOverdue >= rule.threshold) {
        await this.executeEscalationAction(event, rule);
      }
    }
  }

  private async evaluateFallbackCondition(
    event: UniversalEvent, 
    rule: FallbackRule
  ): Promise<boolean> {
    const now = new Date();
    const eventDateTime = new Date(event.date);
    
    switch (rule.condition) {
      case 'move_in_date_passed_incomplete':
        return this.isMoveInDatePassedIncomplete(event, now);
      
      case 'not_signed_5_days':
        return this.isLeaseNotSignedAfterDays(event, 5, now);
      
      case 'no_show_no_interest':
        return this.isNoShowNoInterest(event, now);
      
      case 'no_response_final_followup':
        return this.isNoResponseToFinalFollowup(event, now);
      
      case 'no_response_7_days':
        return this.isNoResponseAfterDays(event, 7, now);
      
      case 'overdue_72_hours':
        return this.isOverdueByHours(event, 72, now);
      
      case 'inspection_not_complete':
        return this.isInspectionNotComplete(event, now);
      
      case 'no_payment_fee_required':
        return this.isPaymentRequired(event, now);
      
      case 'less_than_3_rsvps':
        return this.hasLessThanMinimumRsvps(event, 3);
      
      case 'payment_overdue':
        return this.isPaymentOverdue(event, now);
      
      case 'incomplete_due_date':
        return this.isIncompletePastDueDate(event, now);
      
      default:
        console.warn(`Unknown fallback condition: ${rule.condition}`);
        return false;
    }
  }

  private async executeFallbackAction(
    event: UniversalEvent, 
    rule: FallbackRule
  ): Promise<void> {
    console.log(`Executing fallback action for event ${event.id}:`, rule);

    const action: FallbackAction = {
      eventId: event.id,
      ruleId: rule.id,
      action: rule.action,
      triggeredAt: new Date(),
      reason: rule.condition,
      result: ''
    };

    try {
      switch (rule.action) {
        case 'auto-cancel':
          await this.cancelEvent(event, rule.notification || 'Auto-cancelled due to timeout');
          action.result = 'Event cancelled';
          break;
        
        case 'reschedule':
          await this.rescheduleEvent(event, rule.delayHours);
          action.result = `Event rescheduled by ${rule.delayHours} hours`;
          break;
        
        case 'escalate':
          await this.escalateEvent(event, rule.notification || 'Event requires attention');
          action.result = 'Event escalated';
          break;
        
        case 'archive':
          await this.archiveEvent(event, 'Auto-archived due to inactivity');
          action.result = 'Event archived';
          break;
        
        default:
          console.warn(`Unknown fallback action: ${rule.action}`);
          action.result = 'Unknown action';
      }
    } catch (error) {
      console.error('Failed to execute fallback action:', error);
      action.result = 'Failed to execute';
    }

    this.fallbackHistory.push(action);
  }

  private async executeEscalationAction(
    event: UniversalEvent, 
    rule: EscalationRule
  ): Promise<void> {
    console.log(`Executing escalation action for event ${event.id}:`, rule);

    switch (rule.action) {
      case 'escalate_to_manager':
        await this.notifyManager(event, rule.notification);
        break;
      
      case 'escalate_to_collections':
        await this.escalateToCollections(event, rule.notification);
        break;
      
      default:
        console.warn(`Unknown escalation action: ${rule.action}`);
    }
  }

  // Condition evaluation methods
  private isMoveInDatePassedIncomplete(event: UniversalEvent, now: Date): boolean {
    if (event.type !== 'move-in') return false;
    
    const moveInDate = new Date(event.date);
    const hasIncompleteRequiredTasks = event.tasks
      .filter(task => task.isRequired)
      .some(task => !task.isComplete);
    
    return now > moveInDate && hasIncompleteRequiredTasks;
  }

  private isLeaseNotSignedAfterDays(event: UniversalEvent, days: number, now: Date): boolean {
    if (event.type !== 'lease-signing') return false;
    
    const createdDate = new Date(event.createdAt);
    const daysSinceCreated = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    
    const isLeaseNotSigned = event.tasks
      .find(task => task.title.includes('Sign Lease'))?.isComplete === false;
    
    return daysSinceCreated >= days && isLeaseNotSigned;
  }

  private isNoShowNoInterest(event: UniversalEvent, now: Date): boolean {
    if (event.type !== 'tour') return false;
    
    const tourDate = new Date(event.date);
    const hoursAfterTour = (now.getTime() - tourDate.getTime()) / (1000 * 60 * 60);
    
    const tourCompleted = event.tasks
      .find(task => task.title.includes('Complete Tour'))?.isComplete;
    
    const interestMarked = event.metadata?.interestLevel !== 'not-interested';
    
    return hoursAfterTour >= 2 && !tourCompleted && interestMarked;
  }

  private isNoResponseToFinalFollowup(event: UniversalEvent, now: Date): boolean {
    // Check if final follow-up was sent and no response received
    return event.followUpHistory.some(followUp => 
      followUp.templateId === 'tour-final-follow-up' && 
      followUp.delayHours < 0 // Final follow-up sent
    ) && !event.metadata?.hasResponded;
  }

  private isNoResponseAfterDays(event: UniversalEvent, days: number, now: Date): boolean {
    const lastActivity = new Date(event.updatedAt);
    const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceActivity >= days && !event.metadata?.hasResponse;
  }

  private isOverdueByHours(event: UniversalEvent, hours: number, now: Date): boolean {
    const eventDateTime = new Date(event.date);
    eventDateTime.setHours(
      parseInt(event.time.split(':')[0]),
      parseInt(event.time.split(':')[1])
    );
    
    const hoursOverdue = (now.getTime() - eventDateTime.getTime()) / (1000 * 60 * 60);
    
    return hoursOverdue >= hours && event.status !== 'completed';
  }

  private isInspectionNotComplete(event: UniversalEvent, now: Date): boolean {
    const dueDate = event.metadata?.dueDate ? new Date(event.metadata.dueDate) : new Date(event.date);
    const inspectionTask = event.tasks.find(task => task.title.includes('Inspection'));
    
    return now > dueDate && inspectionTask && !inspectionTask.isComplete;
  }

  private isPaymentRequired(event: UniversalEvent, now: Date): boolean {
    return event.type === 'amenity-reservation' && 
           event.metadata?.feeRequired && 
           !event.metadata?.paymentReceived;
  }

  private hasLessThanMinimumRsvps(event: UniversalEvent, minimum: number): boolean {
    return event.type === 'community-event' && 
           (event.metadata?.rsvpCount || 0) < minimum;
  }

  private isPaymentOverdue(event: UniversalEvent, now: Date): boolean {
    if (event.type !== 'payment') return false;
    
    const dueDate = new Date(event.date);
    const paymentTask = event.tasks.find(task => task.title.includes('Payment'));
    
    return now > dueDate && paymentTask && !paymentTask.isComplete;
  }

  private isIncompletePastDueDate(event: UniversalEvent, now: Date): boolean {
    const dueDate = new Date(event.date);
    const hasIncompleteRequiredTasks = event.tasks
      .filter(task => task.isRequired)
      .some(task => !task.isComplete);
    
    return now > dueDate && hasIncompleteRequiredTasks;
  }

  // Action execution methods
  private async cancelEvent(event: UniversalEvent, reason: string): Promise<void> {
    console.log(`Cancelling event ${event.id}: ${reason}`);
    
    // Update event status
    event.status = 'cancelled';
    event.metadata = { ...event.metadata, cancellationReason: reason };
    
    // Send notification
    await emailAutomationService.sendEmail(
      'event-cancelled-notification',
      event.assignedUsers[0]?.email || 'admin@property.com',
      {
        event_title: event.title,
        cancellation_reason: reason,
        event_date: event.date.toLocaleDateString()
      }
    );
  }

  private async rescheduleEvent(event: UniversalEvent, delayHours: number): Promise<void> {
    console.log(`Rescheduling event ${event.id} by ${delayHours} hours`);
    
    const newDate = new Date(event.date);
    newDate.setHours(newDate.getHours() + delayHours);
    
    event.date = newDate;
    event.rescheduledCount += 1;
    event.updatedAt = new Date();
  }

  private async escalateEvent(event: UniversalEvent, notification: string): Promise<void> {
    console.log(`Escalating event ${event.id}: ${notification}`);
    
    // Notify management
    await emailAutomationService.sendEmail(
      'event-escalation-notification',
      'management@property.com',
      {
        event_title: event.title,
        event_id: event.id,
        escalation_reason: notification,
        event_date: event.date.toLocaleDateString()
      }
    );
  }

  private async archiveEvent(event: UniversalEvent, reason: string): Promise<void> {
    console.log(`Archiving event ${event.id}: ${reason}`);
    
    event.status = 'cancelled';
    event.metadata = { ...event.metadata, archived: true, archiveReason: reason };
  }

  private async notifyManager(event: UniversalEvent, notification: string): Promise<void> {
    console.log(`Notifying manager about event ${event.id}: ${notification}`);
    
    await emailAutomationService.sendEmail(
      'manager-notification',
      'manager@property.com',
      {
        event_title: event.title,
        notification: notification,
        event_date: event.date.toLocaleDateString()
      }
    );
  }

  private async escalateToCollections(event: UniversalEvent, notification: string): Promise<void> {
    console.log(`Escalating event ${event.id} to collections: ${notification}`);
    
    await emailAutomationService.sendEmail(
      'collections-escalation',
      'collections@property.com',
      {
        event_title: event.title,
        notification: notification,
        event_date: event.date.toLocaleDateString()
      }
    );
  }

  getFallbackHistory(): FallbackAction[] {
    return this.fallbackHistory;
  }
}

export const eventFallbackService = EventFallbackService.getInstance();
