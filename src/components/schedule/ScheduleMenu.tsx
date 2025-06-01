
import React from 'react';
import { ArrowLeft, Calendar, Wrench, MessageCircle, Clock, FileText, Users } from 'lucide-react';

interface ScheduleMenuProps {
  onSelectType: (type: string) => void;
  onClose: () => void;
}

const ScheduleMenu = ({ onSelectType, onClose }: ScheduleMenuProps) => {
  const scheduleTypes = [
    {
      id: 'Work Order',
      title: 'Work Order',
      description: 'Report maintenance issues',
      icon: Wrench,
      color: 'bg-orange-500'
    },
    {
      id: 'Message',
      title: 'Send Message',
      description: 'Contact management, leasing, or maintenance',
      icon: MessageCircle,
      color: 'bg-blue-500'
    },
    {
      id: 'Appointment',
      title: 'Schedule Appointment',
      description: 'Book a meeting or consultation',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      id: 'Service',
      title: 'Request Service',
      description: 'Schedule cleaning or other services',
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      id: 'Document',
      title: 'Document Request',
      description: 'Request lease documents or forms',
      icon: FileText,
      color: 'bg-indigo-500'
    },
    {
      id: 'Event',
      title: 'Community Event',
      description: 'RSVP for building events',
      icon: Users,
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          What would you like to schedule?
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Menu Options */}
      <div className="flex-1 p-4">
        <div className="grid gap-4">
          {scheduleTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => onSelectType(type.id)}
                className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-left"
              >
                <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mr-4`}>
                  <IconComponent className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleMenu;
