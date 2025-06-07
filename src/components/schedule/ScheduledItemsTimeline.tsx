
import React from 'react';
import SwipeCard from '../SwipeCard';
import { format } from 'date-fns';

interface ScheduledItemsTimelineProps {
  selectedDate: Date;
  onAction: (action: string, item: string) => void;
}

const ScheduledItemsTimeline = ({ selectedDate, onAction }: ScheduledItemsTimelineProps) => {
  const mockItems = [
    {
      id: 1,
      time: '9:00 AM',
      title: 'Work Order',
      description: 'Broken outlet repair',
      icon: '🔌',
      actions: {
        right: { label: "Reschedule", action: () => onAction("Rescheduled", "Work Order"), color: "#F59E0B", icon: "📅" },
        left: { label: "Cancel", action: () => onAction("Cancelled", "Work Order"), color: "#EF4444", icon: "❌" }
      }
    },
    {
      id: 2,
      time: '2:00 PM',
      title: 'Rent Payment',
      description: '$1,550 due',
      icon: '💳',
      actions: {
        right: { label: "Pay Now", action: () => onAction("Paid", "Rent Payment"), color: "#10B981", icon: "💳" },
        left: { label: "Remind Me", action: () => onAction("Reminded", "Rent Payment"), color: "#F59E0B", icon: "⏰" }
      }
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Scheduled for {format(selectedDate, 'EEEE, MMM d')}</h2>
      
      {mockItems.map((item) => (
        <div key={item.id} className="flex items-start text-sm text-gray-500">
          <span className="mr-4 mt-2 font-medium">{item.time}</span>
          <SwipeCard
            onSwipeRight={item.actions.right}
            onSwipeLeft={item.actions.left}
            onTap={() => onAction("Viewed", item.title)}
            className="flex-1"
          >
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
                <span className="text-xl">{item.icon}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          </SwipeCard>
        </div>
      ))}
    </div>
  );
};

export default ScheduledItemsTimeline;
