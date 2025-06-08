
import { UniversalEvent } from '@/types/eventTasks';
import { eventFallbackService } from '@/services/eventFallbackService';
import { emailAutomationService } from '@/services/emailAutomationService';

export class EventMonitoringService {
  private static instance: EventMonitoringService;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private events: UniversalEvent[] = [];
  
  public static getInstance(): EventMonitoringService {
    if (!EventMonitoringService.instance) {
      EventMonitoringService.instance = new EventMonitoringService();
    }
    return EventMonitoringService.instance;
  }

  startMonitoring(events: UniversalEvent[], intervalMs: number = 60000): void {
    this.events = events;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    console.log('Starting event monitoring service...');
    
    this.monitoringInterval = setInterval(() => {
      this.checkAllEvents();
    }, intervalMs);

    // Run initial check
    this.checkAllEvents();
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('Event monitoring service stopped');
    }
  }

  updateEvents(events: UniversalEvent[]): void {
    this.events = events;
  }

  private async checkAllEvents(): Promise<void> {
    console.log(`Checking ${this.events.length} events for fallback conditions...`);
    
    for (const event of this.events) {
      try {
        // Skip completed or cancelled events
        if (event.status === 'completed' || event.status === 'cancelled') {
          continue;
        }

        // Check for fallback conditions
        await eventFallbackService.checkEventFallbacks(event);
        
        // Check for escalation conditions
        await eventFallbackService.checkEventEscalations(event);
        
        // Check for scheduled follow-up emails
        await this.checkFollowUpEmails(event);
        
      } catch (error) {
        console.error(`Error checking event ${event.id}:`, error);
      }
    }
  }

  private async checkFollowUpEmails(event: UniversalEvent): Promise<void> {
    const now = new Date();
    const eventDateTime = new Date(event.date);
    
    // Check if any follow-up emails should be triggered
    const eventType = event.type;
    const templates = emailAutomationService.getTemplatesForEventType(eventType);
    
    for (const template of templates) {
      const shouldSend = this.shouldSendFollowUp(event, template, now, eventDateTime);
      
      if (shouldSend && !this.hasFollowUpBeenSent(event, template.id)) {
        await this.sendFollowUpEmail(event, template);
      }
    }
  }

  private shouldSendFollowUp(
    event: UniversalEvent, 
    template: any, 
    now: Date, 
    eventDateTime: Date
  ): boolean {
    // Check if this is a tour event and handle pre/post tour emails
    if (event.type === 'tour') {
      const hoursFromEvent = (now.getTime() - eventDateTime.getTime()) / (1000 * 60 * 60);
      
      // Pre-tour emails (negative delay hours)
      if (template.delayHours < 0) {
        const hoursBeforeEvent = Math.abs(template.delayHours);
        const timeUntilEvent = (eventDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        return timeUntilEvent <= hoursBeforeEvent && timeUntilEvent > (hoursBeforeEvent - 1);
      }
      
      // Post-tour emails (positive delay hours)
      if (template.delayHours > 0) {
        return hoursFromEvent >= template.delayHours && hoursFromEvent < (template.delayHours + 1);
      }
    }
    
    // For other event types, check based on creation time or event time
    const hoursSinceCreated = (now.getTime() - event.createdAt.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceCreated >= template.delayHours && 
           hoursSinceCreated < (template.delayHours + 1);
  }

  private hasFollowUpBeenSent(event: UniversalEvent, templateId: string): boolean {
    return event.followUpHistory.some(followUp => followUp.templateId === templateId);
  }

  private async sendFollowUpEmail(event: UniversalEvent, template: any): Promise<void> {
    console.log(`Sending follow-up email for event ${event.id}:`, template.id);
    
    // Get recipient email
    const recipientEmail = this.getRecipientEmail(event, template);
    if (!recipientEmail) {
      console.warn(`No recipient email found for event ${event.id}`);
      return;
    }

    // Prepare template variables
    const variables = this.prepareTemplateVariables(event);
    
    // Send email
    const success = await emailAutomationService.sendEmail(
      template.id,
      recipientEmail,
      variables
    );

    if (success) {
      // Record in follow-up history
      event.followUpHistory.push({
        id: `${template.id}-${Date.now()}`,
        templateId: template.id,
        delayHours: template.delayHours,
        condition: template.condition,
        stopOnResponse: template.stopOnResponse
      });
      
      event.updatedAt = new Date();
    }
  }

  private getRecipientEmail(event: UniversalEvent, template: any): string | null {
    // For tour events, get prospect email
    if (event.type === 'tour') {
      return event.metadata?.prospectEmail || event.assignedUsers.find(u => u.role === 'prospect')?.email;
    }
    
    // For other events, get resident or first assigned user email
    const recipient = event.assignedUsers.find(u => u.role === 'resident') || 
                     event.assignedUsers.find(u => u.role === 'prospect') ||
                     event.assignedUsers[0];
    
    return recipient?.email || null;
  }

  private prepareTemplateVariables(event: UniversalEvent): Record<string, string> {
    return {
      // Event-specific variables
      event_title: event.title,
      event_date: event.date.toLocaleDateString(),
      event_time: event.time,
      event_id: event.id.toString(),
      
      // Property variables (would come from property config in real app)
      property_name: 'The Meridian',
      property_address: '123 Main St, City, State 12345',
      property_phone: '(555) 123-4567',
      leasing_agent_name: 'Sarah Johnson',
      property_manager_name: 'Mike Rodriguez',
      
      // Resident/prospect variables
      prospect_name: event.metadata?.prospectName || 'Valued Prospect',
      resident_name: event.metadata?.residentName || 'Valued Resident',
      unit_number: event.metadata?.unit || '',
      building_name: event.metadata?.building || '',
      
      // Dynamic variables based on event metadata
      ...event.metadata
    };
  }

  getMonitoringStats(): {
    isRunning: boolean;
    eventsMonitored: number;
    lastCheck: Date | null;
  } {
    return {
      isRunning: this.monitoringInterval !== null,
      eventsMonitored: this.events.length,
      lastCheck: new Date() // In real app, would track actual last check time
    };
  }
}

export const eventMonitoringService = EventMonitoringService.getInstance();
