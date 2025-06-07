
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, User, MessageSquare, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface EventTimelineProps {
  event: any;
  userRole: string;
}

const EventTimeline = ({ event, userRole }: EventTimelineProps) => {
  // Generate timeline items based on event type
  const getTimelineItems = () => {
    const baseItems = [
      {
        id: 1,
        timestamp: new Date('2025-05-21T08:30:00'),
        type: 'creation',
        title: 'Event Created',
        description: `${event.type.replace('-', ' ')} scheduled`,
        icon: Calendar,
        user: 'System',
        color: 'text-blue-600 bg-blue-100'
      }
    ];

    // Add type-specific timeline items
    switch (event.type) {
      case 'move-in':
        return [
          ...baseItems,
          {
            id: 2,
            timestamp: new Date('2025-05-21T09:15:00'),
            type: 'assignment',
            title: 'Assigned to Mike Rodriguez',
            description: 'Move-in inspection coordinator assigned',
            icon: User,
            user: 'System',
            color: 'text-green-600 bg-green-100'
          },
          {
            id: 3,
            timestamp: new Date('2025-05-22T10:00:00'),
            type: 'update',
            title: 'Pre-inspection completed',
            description: 'Unit ready for move-in inspection',
            icon: CheckCircle,
            user: 'Mike Rodriguez',
            color: 'text-green-600 bg-green-100'
          }
        ];

      case 'lease':
        return [
          ...baseItems,
          {
            id: 2,
            timestamp: new Date('2025-05-21T14:30:00'),
            type: 'preparation',
            title: 'Documents prepared',
            description: 'Lease renewal documents ready for signing',
            icon: CheckCircle,
            user: 'Leasing Office',
            color: 'text-blue-600 bg-blue-100'
          },
          {
            id: 3,
            timestamp: new Date('2025-05-22T09:00:00'),
            type: 'reminder',
            title: 'Reminder sent',
            description: 'Email reminder sent to resident',
            icon: MessageSquare,
            user: 'System',
            color: 'text-purple-600 bg-purple-100'
          }
        ];

      case 'payment':
        return [
          ...baseItems,
          {
            id: 2,
            timestamp: new Date('2025-05-20T16:00:00'),
            type: 'escalation',
            title: 'Payment overdue',
            description: 'Rent payment is now 3 days overdue',
            icon: AlertTriangle,
            user: 'System',
            color: 'text-red-600 bg-red-100'
          },
          {
            id: 3,
            timestamp: new Date('2025-05-21T10:30:00'),
            type: 'contact',
            title: 'Initial contact made',
            description: 'Phone call made to discuss payment',
            icon: MessageSquare,
            user: 'Property Manager',
            color: 'text-orange-600 bg-orange-100'
          }
        ];

      default:
        return baseItems;
    }
  };

  const timelineItems = getTimelineItems();

  const formatTimelineDate = (date: Date) => {
    return format(date, 'MMM d, yyyy at h:mm a');
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Event Timeline</h3>
          <Badge variant="outline" className="text-xs">
            {timelineItems.length} {timelineItems.length === 1 ? 'entry' : 'entries'}
          </Badge>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline items */}
          <div className="space-y-6">
            {timelineItems.map((item, index) => {
              const IconComponent = item.icon;
              const isLatest = index === timelineItems.length - 1;

              return (
                <div key={item.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${item.color} relative z-10`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="ml-4 flex-1 pb-6">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      {isLatest && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Latest</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatTimelineDate(item.timestamp)}</span>
                      <span>•</span>
                      <span>{item.user}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTimeline;
