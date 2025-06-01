
import React, { useState } from 'react';
import SwipeCard from '../SwipeCard';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import ResidentTimeline from '../ResidentTimeline';

const TodayTab = () => {
  const { toast } = useToast();
  const [showTimeline, setShowTimeline] = useState(false);

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  if (showTimeline) {
    return <ResidentTimeline onClose={() => setShowTimeline(false)} />;
  }

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Today</h1>
          <p className="text-gray-600">Good morning, John!</p>
        </div>
        <button
          onClick={() => setShowTimeline(true)}
          className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
          title="View Resident Timeline"
        >
          <Clock className="text-white" size={20} />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <SwipeCard
          onSwipeRight={{
            label: "Pay Now",
            action: () => handleAction("Paid", "Rent"),
            color: "#10B981",
            icon: "💳"
          }}
          onSwipeLeft={{
            label: "Schedule",
            action: () => handleAction("Scheduled", "Rent Payment"),
            color: "#F59E0B",
            icon: "📅"
          }}
          onTap={() => handleAction("Viewed", "Rent Payment")}
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <h3 className="font-semibold mb-1">Rent Due</h3>
            <p className="text-blue-100 text-sm">$1,550 • Due in 3 days</p>
          </div>
        </SwipeCard>

        <SwipeCard
          onSwipeRight={{
            label: "Create",
            action: () => handleAction("Created", "Work Order"),
            color: "#6366F1",
            icon: "🔧"
          }}
          onSwipeLeft={{
            label: "View All",
            action: () => handleAction("Viewed", "Work Orders"),
            color: "#8B5CF6",
            icon: "📋"
          }}
          onTap={() => handleAction("Opened", "Work Orders")}
        >
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <h3 className="font-semibold mb-1">Work Orders</h3>
            <p className="text-purple-100 text-sm">1 active • 2 pending</p>
          </div>
        </SwipeCard>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <SwipeCard
            onSwipeRight={{
              label: "Mark Read",
              action: () => handleAction("Read", "Pool Maintenance"),
              color: "#3B82F6",
              icon: "📖"
            }}
            onSwipeLeft={{
              label: "Archive",
              action: () => handleAction("Archived", "Pool Maintenance"),
              color: "#8B5CF6",
              icon: "📦"
            }}
            onTap={() => handleAction("Opened", "Pool Maintenance")}
          >
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Pool Maintenance Update</h3>
                <p className="text-gray-600 text-sm">Scheduled for tomorrow 9AM-12PM</p>
              </div>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
          </SwipeCard>

          <SwipeCard
            onSwipeRight={{
              label: "RSVP",
              action: () => handleAction("RSVP'd", "Rooftop BBQ"),
              color: "#10B981",
              icon: "✅"
            }}
            onSwipeLeft={{
              label: "Remind Me",
              action: () => handleAction("Reminded", "Rooftop BBQ"),
              color: "#F59E0B",
              icon: "⏰"
            }}
            onTap={() => handleAction("Viewed", "Rooftop BBQ")}
          >
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Community Event</h3>
                <p className="text-gray-600 text-sm">Rooftop BBQ this Saturday 6PM</p>
              </div>
              <span className="text-xs text-gray-500">1d ago</span>
            </div>
          </SwipeCard>
        </div>
      </div>

      {/* Weather & Building Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-4 rounded-lg text-white">
          <h3 className="font-semibold mb-1">Weather</h3>
          <p className="text-orange-100 text-sm">72°F • Sunny</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-400 to-green-500 p-4 rounded-lg text-white">
          <h3 className="font-semibold mb-1">Building Status</h3>
          <p className="text-green-100 text-sm">All systems normal</p>
        </div>
      </div>
    </div>
  );
};

export default TodayTab;
