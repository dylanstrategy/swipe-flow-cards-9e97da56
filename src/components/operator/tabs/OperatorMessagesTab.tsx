
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, MessageSquare, Bell } from 'lucide-react';

interface Message {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  priority: string;
  category: string;
  unread: boolean;
  fullMessage?: string;
  unit?: string;
  residentPhone?: string;
}

interface OperatorMessagesTabProps {
  onUnreadCountChange?: (count: number) => void;
}

const OperatorMessagesTab: React.FC<OperatorMessagesTabProps> = ({ 
  onUnreadCountChange 
}) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'Unit 204 - John Doe',
      subject: 'HVAC Not Working',
      preview: 'The air conditioning in my unit stopped working this morning...',
      fullMessage: 'The air conditioning in my unit stopped working this morning around 8 AM. The unit is not blowing cold air and seems to be making a strange noise. This is urgent as the temperature is quite high today. Please send someone as soon as possible.',
      time: '2 hours ago',
      priority: 'urgent',
      category: 'maintenance',
      unread: true,
      unit: '204',
      residentPhone: '(555) 123-4567'
    },
    {
      id: 2,
      from: 'Unit 156 - Sarah Johnson',
      subject: 'Lease Renewal Question',
      preview: 'I received my lease renewal notice and have some questions...',
      fullMessage: 'I received my lease renewal notice and have some questions about the new terms. The rent increase seems higher than expected and I wanted to discuss the options available. Could we schedule a meeting to go over the details?',
      time: '4 hours ago',
      priority: 'normal',
      category: 'leasing',
      unread: true,
      unit: '156',
      residentPhone: '(555) 234-5678'
    },
    {
      id: 3,
      from: 'Maintenance Team',
      subject: 'Work Order #1234 Complete',
      preview: 'Pool maintenance has been completed. All systems operational...',
      fullMessage: 'Pool maintenance has been completed. All systems are now operational and the pool is ready for use. Chemical levels have been balanced and all equipment is functioning properly. The next scheduled maintenance is in two weeks.',
      time: 'Yesterday',
      priority: 'low',
      category: 'maintenance',
      unread: false
    },
    {
      id: 4,
      from: 'Unit 302 - Mike Wilson',
      subject: 'Late Fee Inquiry',
      preview: 'I was charged a late fee but I believe my payment was on time...',
      fullMessage: 'I was charged a late fee but I believe my payment was on time. I have a confirmation email showing the payment was processed on the 1st, but I see a late fee on my account. Can you please review this and remove the fee if it was applied in error?',
      time: '2 days ago',
      priority: 'normal',
      category: 'collections',
      unread: true,
      unit: '302',
      residentPhone: '(555) 345-6789'
    },
    {
      id: 5,
      from: 'Community Manager',
      subject: 'Pool Party Event This Weekend',
      preview: 'Reminder about the community pool party this Saturday...',
      fullMessage: 'Reminder about the community pool party this Saturday from 2-6 PM. We will have food, drinks, and activities for all ages. Please RSVP if you plan to attend so we can prepare accordingly.',
      time: '3 days ago',
      priority: 'low',
      category: 'community',
      unread: false
    }
  ]);

  // Calculate unread count and notify parent when it changes
  useEffect(() => {
    const unreadCount = messages.filter(msg => msg.unread).length;
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [messages, onUnreadCountChange]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'leasing': return 'bg-green-100 text-green-800';
      case 'collections': return 'bg-purple-100 text-purple-800';
      case 'community': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unreadCount = messages.filter(msg => msg.unread).length;

  const handleSendReply = () => {
    if (replyText.trim() && selectedMessage) {
      console.log(`Sending reply to ${selectedMessage.from}:`, replyText);
      setReplyText('');
      // In a real app, this would send the message and update the message status
    }
  };

  const markAsRead = (messageId: number) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, unread: false } : msg
      )
    );
    console.log(`Marking message ${messageId} as read`);
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (message.unread) {
      markAsRead(message.id);
    }
  };

  if (selectedMessage) {
    return (
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMessage(null)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h1>
              <p className="text-gray-600">{selectedMessage.from}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(selectedMessage.priority)}>
              {selectedMessage.priority}
            </Badge>
            <Badge variant="outline" className={getCategoryColor(selectedMessage.category)}>
              {selectedMessage.category}
            </Badge>
          </div>
        </div>

        {/* Message Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From: {selectedMessage.from}</span>
                <span className="text-sm text-gray-500">{selectedMessage.time}</span>
              </div>
              {selectedMessage.unit && (
                <div className="text-sm text-gray-600">Unit: {selectedMessage.unit}</div>
              )}
              {selectedMessage.residentPhone && (
                <div className="text-sm text-gray-600">Phone: {selectedMessage.residentPhone}</div>
              )}
              <div className="border-t pt-4">
                <p className="text-gray-900">{selectedMessage.fullMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reply Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Send Reply</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[120px]"
              />
              <Button 
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Messages & Notifications</h1>
          {unreadCount > 0 && (
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <Badge className="bg-red-500 text-white">
                {unreadCount} unread
              </Badge>
            </div>
          )}
        </div>
        <p className="text-gray-600">Resident communications and system alerts</p>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className={`hover:shadow-md transition-shadow cursor-pointer ${
              message.unread ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
            }`}
            onClick={() => handleMessageClick(message)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {message.unread && (
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    )}
                    <span className={`font-medium text-gray-900 ${message.unread ? 'font-semibold' : ''}`}>
                      {message.from}
                    </span>
                  </div>
                  <Badge className={getPriorityColor(message.priority)}>
                    {message.priority}
                  </Badge>
                  <Badge variant="outline" className={getCategoryColor(message.category)}>
                    {message.category}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">{message.time}</span>
              </div>
              <h3 className={`mb-2 ${
                message.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
              }`}>
                {message.subject}
              </h3>
              <p className="text-gray-600 text-sm">{message.preview}</p>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <MessageSquare className="w-4 h-4" />
                  <span>Click to view details and reply</span>
                </div>
                {message.unread && (
                  <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                    New
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OperatorMessagesTab;
