
import React from 'react';
import SwipeCard from '../../SwipeCard';

interface QuickActionsGridProps {
  onAction: (action: string, item: string) => void;
  getRentUrgencyClass: () => string;
}

const QuickActionsGrid = ({ onAction, getRentUrgencyClass }: QuickActionsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <SwipeCard
        onSwipeRight={{
          label: "Pay Now",
          action: () => onAction("Paid", "Rent"),
          color: "#10B981",
          icon: "💳"
        }}
        onSwipeLeft={{
          label: "Schedule",
          action: () => onAction("Scheduled", "Rent Payment"),
          color: "#F59E0B",
          icon: "📅"
        }}
        onTap={() => onAction("Viewed", "Rent Payment")}
        className={getRentUrgencyClass()}
        enableSwipeUp={false}
      >
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <h3 className="font-semibold mb-1">Rent Due</h3>
          <p className="text-blue-100 text-sm">$1,550 • Due in 3 days</p>
        </div>
      </SwipeCard>

      <SwipeCard
        onSwipeRight={{
          label: "Create",
          action: () => onAction("Created", "Work Order"),
          color: "#6366F1",
          icon: "🔧"
        }}
        onSwipeLeft={{
          label: "View All",
          action: () => onAction("Viewed", "Work Orders"),
          color: "#8B5CF6",
          icon: "📋"
        }}
        onTap={() => onAction("Opened", "Work Orders")}
        enableSwipeUp={false}
      >
        <div 
          className="relative p-4 rounded-lg text-white overflow-hidden"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-purple-600/80 backdrop-blur-[2px] rounded-lg"></div>
          <div className="relative z-10">
            <h3 className="font-semibold mb-1">Work Orders</h3>
            <p className="text-purple-100 text-sm">1 active • 2 pending</p>
          </div>
        </div>
      </SwipeCard>
    </div>
  );
};

export default QuickActionsGrid;
