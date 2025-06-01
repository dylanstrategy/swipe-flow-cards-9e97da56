
import React from 'react';
import SwipeCard from '../SwipeCard';
import { useToast } from '@/hooks/use-toast';

const MessagesTab = () => {
  const { toast } = useToast();

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const messages = [
    {
      id: 1,
      sender: "Building Management",
      subject: "Pool Maintenance Update",
      preview: "The pool maintenance has been rescheduled to...",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      sender: "Maintenance Team",
      subject: "Work Order #1234 Complete",
      preview: "Your HVAC maintenance request has been completed...",
      time: "Yesterday",
      unread: false
    },
    {
      id: 3,
      sender: "Leasing Office",
      subject: "Lease Renewal Available",
      preview: "Your lease renewal options are now available...",
      time: "3 days ago",
      unread: true
    }
  ];

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
      <p className="text-gray-600 mb-6">Your conversations and updates</p>
      
      {messages.map((message) => (
        <SwipeCard
          key={message.id}
          onSwipeRight={{
            label: "Archive",
            action: () => handleAction("Archived", message.subject),
            color: "#6366F1"
          }}
          onSwipeLeft={{
            label: "Quick Reply",
            action: () => handleAction("Quick Reply", message.subject),
            color: "#8B5CF6"
          }}
          onSwipeUp={{
            label: "Open Thread",
            action: () => handleAction("Opened Thread", message.subject),
            color: "#06B6D4"
          }}
          onTap={() => handleAction("Opened", message.subject)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${message.unread ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <span className="text-sm font-medium text-gray-900">{message.sender}</span>
              </div>
              <span className="text-sm text-gray-500">{message.time}</span>
            </div>
            <h3 className={`text-lg mb-2 ${message.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
              {message.subject}
            </h3>
            <p className="text-gray-600">{message.preview}</p>
          </div>
        </SwipeCard>
      ))}
    </div>
  );
};

export default MessagesTab;
