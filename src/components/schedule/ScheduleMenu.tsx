
import React from 'react';
import SwipeCard from '../SwipeCard';

interface ScheduleType {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface ScheduleMenuProps {
  onSelectType: (type: string) => void;
  onClose: () => void;
}

const ScheduleMenu = ({ onSelectType, onClose }: ScheduleMenuProps) => {
  const scheduleTypes: ScheduleType[] = [
    { id: 'work-order', label: 'Work Order', icon: '🔧', description: 'Report maintenance issues' },
    { id: 'payment', label: 'Payment', icon: '💳', description: 'Schedule rent or fees' },
    { id: 'service', label: 'Service', icon: '🏠', description: 'Book cleaning, pest control' },
    { id: 'event', label: 'Event RSVP', icon: '🎉', description: 'Community events' },
    { id: 'community', label: 'Community Post', icon: '📝', description: 'Share with neighbors' },
  ];

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Schedule Something</h1>
        <button 
          onClick={onClose}
          className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
        >
          <span className="text-gray-600 text-lg">×</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {scheduleTypes.map((type) => (
          <SwipeCard
            key={type.id}
            onSwipeRight={{
              label: "Select",
              action: () => onSelectType(type.label),
              color: "#3B82F6"
            }}
            onTap={() => onSelectType(type.label)}
          >
            <div className="flex items-center p-4 bg-white rounded-lg">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                <span className="text-2xl">{type.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{type.label}</h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
              </div>
            </div>
          </SwipeCard>
        ))}
      </div>
    </div>
  );
};

export default ScheduleMenu;
