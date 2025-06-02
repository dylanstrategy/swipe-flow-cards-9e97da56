
import React from 'react';
import { ArrowLeft, MessageCircle, Wrench, Calendar, Users, Clock, FileText, BarChart3, Home, DollarSign, Clipboard } from 'lucide-react';

interface OperatorScheduleMenuProps {
  onSelectType: (type: string) => void;
  onClose: () => void;
}

const OperatorScheduleMenu = ({ onSelectType, onClose }: OperatorScheduleMenuProps) => {
  const scheduleTypes = [
    // Communication
    {
      id: 'Message',
      title: 'Send Message',
      description: 'Contact residents, staff, or vendors',
      icon: MessageCircle,
      color: 'bg-blue-500',
      category: 'Communication'
    },
    {
      id: 'Poll',
      title: 'Create Poll',
      description: 'Survey residents or gather feedback',
      icon: BarChart3,
      color: 'bg-purple-500',
      category: 'Communication'
    },
    // Leasing
    {
      id: 'Lease Signing',
      title: 'Lease Signing',
      description: 'Schedule lease signing appointments',
      icon: FileText,
      color: 'bg-green-500',
      category: 'Leasing'
    },
    {
      id: 'Tour',
      title: 'Property Tour',
      description: 'Schedule prospective resident tours',
      icon: Home,
      color: 'bg-teal-500',
      category: 'Leasing'
    },
    {
      id: 'Renewal',
      title: 'Lease Renewal',
      description: 'Schedule renewal discussions',
      icon: Users,
      color: 'bg-indigo-500',
      category: 'Leasing'
    },
    // Maintenance
    {
      id: 'Work Order',
      title: 'Work Order',
      description: 'Schedule maintenance tasks',
      icon: Wrench,
      color: 'bg-orange-500',
      category: 'Maintenance'
    },
    {
      id: 'Inspection',
      title: 'Unit Inspection',
      description: 'Schedule move-in/out inspections',
      icon: Clipboard,
      color: 'bg-yellow-500',
      category: 'Maintenance'
    },
    // Events & Services
    {
      id: 'Community Event',
      title: 'Community Event',
      description: 'Organize building events',
      icon: Calendar,
      color: 'bg-pink-500',
      category: 'Events'
    },
    {
      id: 'Service',
      title: 'Service Request',
      description: 'Schedule cleaning or vendor services',
      icon: Clock,
      color: 'bg-cyan-500',
      category: 'Services'
    },
    // Administrative
    {
      id: 'Collections',
      title: 'Collections Follow-up',
      description: 'Schedule payment discussions',
      icon: DollarSign,
      color: 'bg-red-500',
      category: 'Administrative'
    }
  ];

  const categories = [
    'Communication',
    'Leasing', 
    'Maintenance',
    'Events',
    'Services',
    'Administrative'
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          Schedule Management
        </h1>
        <div className="w-10" />
      </div>

      {/* Scrollable Menu Options */}
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {categories.map((category) => {
            const categoryItems = scheduleTypes.filter(type => type.category === category);
            
            return (
              <div key={category} className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-2">
                  {category}
                </h2>
                <div className="grid gap-3">
                  {categoryItems.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => onSelectType(type.id)}
                        className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left"
                      >
                        <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                          <IconComponent className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-0.5 text-sm">{type.title}</h3>
                          <p className="text-gray-600 text-xs leading-tight">{type.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OperatorScheduleMenu;
