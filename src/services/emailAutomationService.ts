
import { EmailFollowUp } from '@/types/eventTasks';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  eventType: string;
  sequenceStep?: number;
  variables: string[]; // Available template variables like {resident_name}, {unit_number}
}

export interface EmailSequence {
  id: string;
  name: string;
  eventType: string;
  templates: EmailTemplate[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const EMAIL_TEMPLATES: Record<string, EmailTemplate[]> = {
  'tour': [
    // Pre-tour sequence
    {
      id: 'tour-confirmation',
      name: 'Tour Confirmation',
      subject: 'Your Property Tour is Confirmed!',
      body: `Hi {prospect_name},

Thank you for scheduling a tour at {property_name}! We're excited to show you around.

Tour Details:
Date: {tour_date}
Time: {tour_time}
Address: {property_address}

Please reply to confirm your attendance. If you need to reschedule, let us know at least 24 hours in advance.

Looking forward to meeting you!

Best regards,
{leasing_agent_name}
{property_name} Leasing Team`,
      eventType: 'tour',
      sequenceStep: 1,
      variables: ['prospect_name', 'property_name', 'tour_date', 'tour_time', 'property_address', 'leasing_agent_name']
    },
    {
      id: 'pre-tour-info',
      name: 'Pre-Tour Information',
      subject: 'Tomorrow\'s Tour - What to Expect',
      body: `Hi {prospect_name},

Your tour at {property_name} is tomorrow at {tour_time}!

What to bring:
- Photo ID
- Proof of income (if ready to apply)
- Any questions about the community

What we'll show you:
- Available units matching your criteria
- Community amenities
- The neighborhood

Parking: {parking_instructions}

See you tomorrow!

{leasing_agent_name}
{property_name}`,
      eventType: 'tour',
      sequenceStep: 2,
      variables: ['prospect_name', 'property_name', 'tour_time', 'parking_instructions', 'leasing_agent_name']
    },
    
    // Post-tour sequence
    {
      id: 'tour-thank-you',
      name: 'Tour Thank You',
      subject: 'Thank you for touring {property_name}!',
      body: `Hi {prospect_name},

Thank you for visiting {property_name} today! It was great meeting you and showing you around.

As discussed, here are the next steps:
- {next_steps}

Available units we discussed:
- {discussed_units}

Special offers currently available:
- {current_offers}

I'm here to answer any questions. Would you like to schedule a follow-up call?

Best regards,
{leasing_agent_name}`,
      eventType: 'tour',
      sequenceStep: 3,
      variables: ['prospect_name', 'property_name', 'next_steps', 'discussed_units', 'current_offers', 'leasing_agent_name']
    },
    {
      id: 'tour-follow-up-1',
      name: 'Tour Follow-up #1',
      subject: 'Following up on your visit to {property_name}',
      body: `Hi {prospect_name},

I wanted to follow up on your tour of {property_name} yesterday. Do you have any additional questions about the community or the units we viewed?

Quick reminders:
- The unit in {building_name} is still available
- Our current special offer ends {offer_end_date}
- We can schedule a second viewing anytime

Would you like to discuss next steps? I'm available for a quick call at your convenience.

{leasing_agent_name}
{property_name}`,
      eventType: 'tour',
      sequenceStep: 4,
      variables: ['prospect_name', 'property_name', 'building_name', 'offer_end_date', 'leasing_agent_name']
    },
    {
      id: 'tour-follow-up-2',
      name: 'Tour Follow-up #2',
      subject: 'Still interested in {property_name}?',
      body: `Hi {prospect_name},

I hope you're doing well! I wanted to check in about your housing search and see if {property_name} is still a good fit for your needs.

Updates since your visit:
- {property_updates}

If you're still considering us, I'd love to help move things forward. If your timeline has changed or you've found another place, just let me know so I can update your file.

Thanks!
{leasing_agent_name}`,
      eventType: 'tour',
      sequenceStep: 5,
      variables: ['prospect_name', 'property_name', 'property_updates', 'leasing_agent_name']
    },
    {
      id: 'tour-follow-up-3',
      name: 'Tour Follow-up #3',
      subject: 'New availability at {property_name}',
      body: `Hi {prospect_name},

We have some exciting updates at {property_name}!

New this week:
- {new_availability}
- {updated_amenities}

I remember you were interested in {prospect_preferences}. These new options might be perfect for you.

Would you like to schedule another visit or chat about these options?

{leasing_agent_name}`,
      eventType: 'tour',
      sequenceStep: 6,
      variables: ['prospect_name', 'property_name', 'new_availability', 'updated_amenities', 'prospect_preferences', 'leasing_agent_name']
    },
    {
      id: 'tour-final-follow-up',
      name: 'Final Tour Follow-up',
      subject: 'Last check-in from {property_name}',
      body: `Hi {prospect_name},

This will be my final follow-up regarding your interest in {property_name}. I don't want to be pushy, but I also don't want you to miss out if you're still interested.

Current status:
- {current_availability}
- {final_offers}

If you'd like to stay in touch about future availability or have any questions, please let me know. Otherwise, I'll remove you from our follow-up sequence.

Best of luck with your housing search!

{leasing_agent_name}
{property_name}`,
      eventType: 'tour',
      sequenceStep: 7,
      variables: ['prospect_name', 'property_name', 'current_availability', 'final_offers', 'leasing_agent_name']
    }
  ],

  'lease-signing': [
    {
      id: 'lease-signing-reminder',
      name: 'Lease Signing Reminder',
      subject: 'Action Required: Complete your lease signing',
      body: `Hi {resident_name},

Your lease for unit {unit_number} at {property_name} is ready for signing!

Lease Details:
- Unit: {unit_number}
- Monthly Rent: {monthly_rent}
- Lease Start: {lease_start_date}
- Lease End: {lease_end_date}

To complete your lease:
1. Review the documents: {lease_link}
2. Sign electronically
3. Submit security deposit: {deposit_amount}

Please complete within 48 hours to secure your unit.

Questions? Reply to this email or call {leasing_phone}.

{leasing_agent_name}`,
      eventType: 'lease-signing',
      sequenceStep: 1,
      variables: ['resident_name', 'unit_number', 'property_name', 'monthly_rent', 'lease_start_date', 'lease_end_date', 'lease_link', 'deposit_amount', 'leasing_phone', 'leasing_agent_name']
    },
    {
      id: 'lease-signing-urgent',
      name: 'Urgent Lease Signing',
      subject: 'URGENT: Complete lease signing by {deadline}',
      body: `Hi {resident_name},

This is an urgent reminder that your lease signing for unit {unit_number} needs to be completed by {deadline}.

If we don't receive your signed lease and deposit by this deadline, we may need to release the unit to other applicants.

Complete now: {lease_link}

If you're experiencing any issues or need assistance, please call us immediately at {emergency_phone}.

{leasing_agent_name}`,
      eventType: 'lease-signing',
      sequenceStep: 2,
      variables: ['resident_name', 'unit_number', 'deadline', 'lease_link', 'emergency_phone', 'leasing_agent_name']
    }
  ],

  'move-in': [
    {
      id: 'move-in-reminder',
      name: 'Move-in Preparation Reminder',
      subject: 'Your move-in is coming up! Action items',
      body: `Hi {resident_name},

Your move-in to unit {unit_number} is scheduled for {move_in_date}!

Required before move-in:
☐ Submit renter's insurance proof
☐ Complete utility setup
☐ Pay remaining balance: {remaining_balance}
☐ Complete resident onboarding forms

Move-in checklist: {checklist_link}

Utility contacts:
- Electric: {electric_company} - {electric_phone}
- Gas: {gas_company} - {gas_phone}
- Internet: {internet_options}

Questions? Contact {property_manager_name} at {property_phone}.

Welcome to the community!`,
      eventType: 'move-in',
      sequenceStep: 1,
      variables: ['resident_name', 'unit_number', 'move_in_date', 'remaining_balance', 'checklist_link', 'electric_company', 'electric_phone', 'gas_company', 'gas_phone', 'internet_options', 'property_manager_name', 'property_phone']
    }
  ],

  'move-out': [
    {
      id: 'move-out-reminder',
      name: 'Move-out Process Reminder',
      subject: 'Your move-out is scheduled for {move_out_date}',
      body: `Hi {resident_name},

This is a reminder that your move-out from unit {unit_number} is scheduled for {move_out_date}.

Move-out checklist:
☐ Schedule final walkthrough
☐ Pack all belongings
☐ Clean unit thoroughly
☐ Return all keys and garage remotes
☐ Forward mail to new address
☐ Transfer/cancel utilities

Final inspection: {inspection_date} at {inspection_time}

Deposit return information:
- Security deposit: {deposit_amount}
- Processing time: 10-14 business days
- Forwarding address needed: {forwarding_address_needed}

Contact {property_manager_name} with questions.`,
      eventType: 'move-out',
      sequenceStep: 1,
      variables: ['resident_name', 'unit_number', 'move_out_date', 'inspection_date', 'inspection_time', 'deposit_amount', 'forwarding_address_needed', 'property_manager_name']
    }
  ],

  'work-order': [
    {
      id: 'work-order-reminder',
      name: 'Work Order Status Update',
      subject: 'Update on your maintenance request #{work_order_number}',
      body: `Hi {resident_name},

We received your maintenance request for unit {unit_number}.

Work Order Details:
- Request #: {work_order_number}
- Issue: {issue_description}
- Priority: {priority_level}
- Estimated completion: {estimated_completion}

Next steps:
{next_steps}

We'll keep you updated on the progress. For urgent issues, please call our emergency line at {emergency_phone}.

{maintenance_team_name}`,
      eventType: 'work-order',
      sequenceStep: 1,
      variables: ['resident_name', 'unit_number', 'work_order_number', 'issue_description', 'priority_level', 'estimated_completion', 'next_steps', 'emergency_phone', 'maintenance_team_name']
    }
  ]
};

export const EMAIL_SEQUENCES: EmailSequence[] = [
  {
    id: 'tour-prospect-sequence',
    name: 'Tour & Prospect Follow-up',
    eventType: 'tour',
    templates: EMAIL_TEMPLATES.tour,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'lease-signing-sequence',
    name: 'Lease Signing Reminders',
    eventType: 'lease-signing',
    templates: EMAIL_TEMPLATES['lease-signing'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'move-in-sequence',
    name: 'Move-in Preparation',
    eventType: 'move-in',
    templates: EMAIL_TEMPLATES['move-in'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class EmailAutomationService {
  private static instance: EmailAutomationService;
  
  public static getInstance(): EmailAutomationService {
    if (!EmailAutomationService.instance) {
      EmailAutomationService.instance = new EmailAutomationService();
    }
    return EmailAutomationService.instance;
  }

  async triggerEmailSequence(
    eventType: string, 
    recipientEmail: string, 
    templateVariables: Record<string, string>
  ): Promise<void> {
    console.log('Triggering email sequence:', { eventType, recipientEmail, templateVariables });
    
    const sequence = EMAIL_SEQUENCES.find(seq => seq.eventType === eventType && seq.isActive);
    if (!sequence) {
      console.warn(`No active email sequence found for event type: ${eventType}`);
      return;
    }

    // In a real implementation, this would schedule emails based on the delay hours
    for (const template of sequence.templates) {
      await this.scheduleEmail(template, recipientEmail, templateVariables);
    }
  }

  private async scheduleEmail(
    template: EmailTemplate, 
    recipientEmail: string, 
    variables: Record<string, string>
  ): Promise<void> {
    console.log('Scheduling email:', {
      templateId: template.id,
      recipient: recipientEmail,
      subject: this.interpolateTemplate(template.subject, variables)
    });

    // In a real implementation, this would integrate with an email service
    // For now, we'll just log the email details
  }

  private interpolateTemplate(template: string, variables: Record<string, string>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return result;
  }

  async sendEmail(
    templateId: string,
    recipientEmail: string,
    variables: Record<string, string>
  ): Promise<boolean> {
    try {
      // Find template
      const template = this.findTemplate(templateId);
      if (!template) {
        console.error(`Template not found: ${templateId}`);
        return false;
      }

      const subject = this.interpolateTemplate(template.subject, variables);
      const body = this.interpolateTemplate(template.body, variables);

      console.log('Sending email:', {
        to: recipientEmail,
        subject,
        body: body.substring(0, 100) + '...'
      });

      // In a real implementation, this would use a service like Resend
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private findTemplate(templateId: string): EmailTemplate | undefined {
    for (const templates of Object.values(EMAIL_TEMPLATES)) {
      const template = templates.find(t => t.id === templateId);
      if (template) return template;
    }
    return undefined;
  }

  getTemplatesForEventType(eventType: string): EmailTemplate[] {
    return EMAIL_TEMPLATES[eventType] || [];
  }

  getAllSequences(): EmailSequence[] {
    return EMAIL_SEQUENCES;
  }
}

export const emailAutomationService = EmailAutomationService.getInstance();
