
import React from 'react';
import SwipeCard from '../SwipeCard';
import { useToast } from '@/hooks/use-toast';

const TodayTab = () => {
  const { toast } = useToast();

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Today</h1>
      <p className="text-gray-600 mb-6">Your schedule and updates</p>
      
      {/* Work Order Card */}
      <SwipeCard
        onSwipeRight={{
          label: "Reschedule",
          action: () => handleAction("Rescheduled", "HVAC Maintenance"),
          color: "#3B82F6"
        }}
        onSwipeLeft={{
          label: "Cancel",
          action: () => handleAction("Cancelled", "HVAC Maintenance"),
          color: "#EF4444"
        }}
        onSwipeUp={{
          label: "Add Review",
          action: () => handleAction("Review Added", "HVAC Maintenance"),
          color: "#10B981"
        }}
        onTap={() => handleAction("Opened Details", "HVAC Maintenance")}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Work Order
            </span>
            <span className="text-sm text-gray-500">2:00 PM</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">HVAC Maintenance</h3>
          <p className="text-gray-600 mb-3">Annual maintenance check for unit #A12</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">📍 Apt 204</span>
            <span>🔧 HVAC Team</span>
          </div>
        </div>
      </SwipeCard>

      {/* Message Card */}
      <SwipeCard
        onSwipeRight={{
          label: "Archive",
          action: () => handleAction("Archived", "Building Notice"),
          color: "#6366F1"
        }}
        onSwipeLeft={{
          label: "Quick Reply",
          action: () => handleAction("Quick Reply", "Building Notice"),
          color: "#8B5CF6"
        }}
        onSwipeUp={{
          label: "Open Inbox",
          action: () => handleAction("Opened Inbox", "Messages"),
          color: "#06B6D4"
        }}
        onTap={() => handleAction("Opened", "Building Notice")}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Message
            </span>
            <span className="text-sm text-gray-500">30 min ago</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Building Notice</h3>
          <p className="text-gray-600 mb-3">Pool maintenance scheduled for tomorrow 9AM-12PM</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>📧 Building Management</span>
          </div>
        </div>
      </SwipeCard>

      {/* Promo Card */}
      <SwipeCard
        onSwipeRight={{
          label: "Save Deal",
          action: () => handleAction("Saved", "Coffee Shop Deal"),
          color: "#F59E0B"
        }}
        onSwipeLeft={{
          label: "Skip",
          action: () => handleAction("Skipped", "Coffee Shop Deal"),
          color: "#6B7280"
        }}
        onSwipeUp={{
          label: "Share Offer",
          action: () => handleAction("Shared", "Coffee Shop Deal"),
          color: "#EC4899"
        }}
        onTap={() => handleAction("Viewed", "Coffee Shop Deal")}
      >
        <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Local Deal
            </span>
            <span className="text-sm text-amber-600 font-semibold">20% OFF</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Neighborhood Coffee</h3>
          <p className="text-gray-600 mb-3">Get 20% off your next order with code NEIGHBOR20</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">☕ 2 blocks away</span>
            <span>⏰ Valid until Friday</span>
          </div>
        </div>
      </SwipeCard>
    </div>
  );
};

export default TodayTab;
