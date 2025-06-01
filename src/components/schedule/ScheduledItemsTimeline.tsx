
import React from 'react';
import SwipeCard from '../SwipeCard';
import { format } from 'date-fns';

interface ScheduledItemsTimelineProps {
  selectedDate: Date;
  onAction: (action: string, item: string) => void;
}

const ScheduledItemsTimeline = ({ selectedDate, onAction }: ScheduledItemsTimelineProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Scheduled for {format(selectedDate, 'EEEE, MMM d')}</h2>
      
      <div className="flex items-start text-sm text-gray-500">
        <span className="mr-4 mt-2 font-medium">9 AM</span>
        <SwipeCard
          onSwipeRight={{
            label: "Reschedule",
            action: () => onAction("Rescheduled", "Work Order"),
            color: "#F59E0B",
            icon: "📅"
          }}
          onSwipeLeft={{
            label: "Cancel",
            action: () => onAction("Cancelled", "Work Order"),
            color: "#EF4444",
            icon: "❌"
          }}
          onTap={() => onAction("Viewed", "Work Order")}
          className="flex-1"
        >
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
              <span className="text-xl">🔌</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Work Order</h3>
              <p className="text-gray-600 text-sm">Broken outlet</p>
            </div>
          </div>
        </SwipeCard>
      </div>

      <div className="flex items-start text-sm text-gray-500">
        <span className="mr-4 mt-2 font-medium">2 PM</span>
        <SwipeCard
          onSwipeRight={{
            label: "Pay Now",
            action: () => onAction("Paid", "Rent Payment"),
            color: "#10B981",
            icon: "💳"
          }}
          onSwipeLeft={{
            label: "Remind Me",
            action: () => onAction("Reminded", "Rent Payment"),
            color: "#F59E0B",
            icon: "⏰"
          }}
          onTap={() => onAction("Viewed", "Rent Payment")}
          className="flex-1"
        >
          <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
              <span className="text-xl">💳</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Rent Payment</h3>
              <p className="text-gray-600 text-sm">$1,550 due</p>
            </div>
          </div>
        </SwipeCard>
      </div>
    </div>
  );
};

export default ScheduledItemsTimeline;
