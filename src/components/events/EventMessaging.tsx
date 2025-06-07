
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, AlertTriangle } from 'lucide-react';

interface EventMessagingProps {
  event: any;
  messageText: string;
  setMessageText: (text: string) => void;
  onSendMessage: () => void;
  userRole: string;
}

const EventMessaging = ({ event, messageText, setMessageText, onSendMessage, userRole }: EventMessagingProps) => {
  const getRecipientInfo = () => {
    switch (event.type) {
      case 'move-in':
      case 'move-out':
      case 'payment':
        return {
          name: event.description.split(' - ')[1] || 'Resident',
          role: 'Resident',
          context: `regarding ${event.type.replace('-', ' ')} for ${event.unit}`
        };
      case 'tour':
        return {
          name: event.description.split(' - ')[1] || 'Prospect',
          role: 'Prospect',
          context: `regarding tour of ${event.unit}`
        };
      case 'lease':
        return {
          name: event.description.split(' - ')[1] || 'Resident',
          role: 'Resident',
          context: `regarding lease signing for ${event.unit}`
        };
      case 'message':
        return {
          name: event.description.split(' - ')[0] || 'Resident',
          role: 'Resident',
          context: `regarding their message about ${event.description.split(' - ')[1] || 'inquiry'}`
        };
      default:
        return {
          name: 'Contact',
          role: 'Contact',
          context: `regarding ${event.title}`
        };
    }
  };

  const recipient = getRecipientInfo();
  const canSendUrgent = userRole === 'operator' && (event.priority === 'high' || event.status === 'urgent');

  return (
    <div className="p-6 space-y-6">
      {/* Recipient Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium text-gray-900">Send Message to {recipient.role}</h3>
            <p className="text-sm text-gray-600">{recipient.name}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {recipient.role}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{recipient.context}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setMessageText(`Hi ${recipient.name}, I wanted to follow up ${recipient.context}. `)}
        >
          Quick Follow-up
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setMessageText(`Hi ${recipient name}, we need to reschedule ${recipient.context}. `)}
        >
          Request Reschedule
        </Button>
        {canSendUrgent && (
          <Button 
            variant="outline" 
            size="sm"
            className="col-span-2 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setMessageText(`URGENT: ${recipient.name}, immediate attention required ${recipient.context}. Please contact us ASAP.`)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Send Urgent Notice
          </Button>
        )}
      </div>

      {/* Message Compose */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Type your message to ${recipient.name} here...`}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm">
            <Paperclip className="w-4 h-4 mr-2" />
            Attach File
          </Button>
          
          <Button 
            onClick={onSendMessage}
            disabled={!messageText.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventMessaging;
