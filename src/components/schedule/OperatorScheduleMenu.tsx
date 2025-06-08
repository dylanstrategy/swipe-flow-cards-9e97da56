
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface OperatorScheduleMenuProps {
  onSelectType: (type: string) => void;
  onClose: () => void;
}

const OperatorScheduleMenu = ({ onSelectType, onClose }: OperatorScheduleMenuProps) => {
  const scheduleOptions = [
    {
      category: 'Universal Events',
      items: [
        { 
          type: 'Universal Event', 
          label: 'Create Event', 
          icon: '⚡', 
          description: 'Create any type of event with full task management',
          color: 'bg-gradient-to-r from-blue-500 to-purple-600'
        }
      ]
    },
    {
      category: 'Communication',
      items: [
        { 
          type: 'Message', 
          label: 'Send Message', 
          icon: '💬', 
          description: 'Send message to residents, team, or vendors',
          color: 'bg-blue-500'
        },
        { 
          type: 'Poll', 
          label: 'Create Poll', 
          icon: '📊', 
          description: 'Create community poll or survey',
          color: 'bg-green-500'
        }
      ]
    },
    {
      category: 'Documents',
      items: [
        { 
          type: 'Contract', 
          label: 'Send Contract', 
          icon: '📄', 
          description: 'Send lease or vendor agreement',
          color: 'bg-purple-500'
        },
        { 
          type: 'Document Request', 
          label: 'Request Documents', 
          icon: '📎', 
          description: 'Request insurance, ID, or other documents',
          color: 'bg-indigo-500'
        }
      ]
    },
    {
      category: 'Leasing',
      items: [
        { 
          type: 'Tour', 
          label: 'Schedule Tour', 
          icon: '🏠', 
          description: 'Schedule property tour for prospect',
          color: 'bg-orange-500'
        },
        { 
          type: 'Lease Signing', 
          label: 'Lease Signing', 
          icon: '✍️', 
          description: 'Schedule lease signing appointment',
          color: 'bg-blue-600'
        },
        { 
          type: 'Renewal', 
          label: 'Lease Renewal', 
          icon: '🔄', 
          description: 'Process lease renewal',
          color: 'bg-teal-500'
        }
      ]
    },
    {
      category: 'Maintenance',
      items: [
        { 
          type: 'Work Order', 
          label: 'Work Order', 
          icon: '🔧', 
          description: 'Create maintenance work order',
          color: 'bg-yellow-500'
        },
        { 
          type: 'Inspection', 
          label: 'Schedule Inspection', 
          icon: '🔍', 
          description: 'Schedule unit or property inspection',
          color: 'bg-gray-600'
        }
      ]
    },
    {
      category: 'Events',
      items: [
        { 
          type: 'Community Event', 
          label: 'Community Event', 
          icon: '🎉', 
          description: 'Organize community event or gathering',
          color: 'bg-pink-500'
        },
        { 
          type: 'Service Request', 
          label: 'Service Request', 
          icon: '🛎️', 
          description: 'Schedule concierge or special service',
          color: 'bg-cyan-500'
        }
      ]
    },
    {
      category: 'Administrative',
      items: [
        { 
          type: 'Collections', 
          label: 'Collections Follow-up', 
          icon: '💰', 
          description: 'Schedule payment follow-up',
          color: 'bg-red-500'
        },
        { 
          type: 'Notice', 
          label: 'Send Notice', 
          icon: '📋', 
          description: 'Send official notice to resident',
          color: 'bg-gray-700'
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create Schedule Item</h1>
            <p className="text-sm text-gray-600">What would you like to schedule?</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {scheduleOptions.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.items.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => onSelectType(item.type)}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 text-left group hover:scale-105"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center text-white text-lg font-semibold group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{item.label}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperatorScheduleMenu;
