
import React from 'react';
import { Clock, Home, Users, Calendar, Wrench, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SwipeCard from '@/components/SwipeCard';

interface EventsListProps {
  events: any[];
  onAction: (action: string, item: string) => void;
  onQuickReply: (subject: string, recipientType?: 'management' | 'maintenance' | 'leasing') => void;
  getSwipeActionsForEvent: (event: any) => any;
  onEventClick?: (event: any) => void;
}

const EventsList = ({ events, onAction, onQuickReply, getSwipeActionsForEvent, onEventClick }: EventsListProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inspection': return <Home size={16} className="text-blue-600" />;
      case 'lease': return <Users size={16} className="text-green-600" />;
      case 'maintenance': return <Wrench size={16} className="text-orange-600" />;
      case 'meeting': return <Calendar size={16} className="text-purple-600" />;
      case 'message': return <MessageSquare size={16} className="text-gray-600" />;
      default: return <Calendar size={16} className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEventClick = (event: any) => {
    if (onEventClick) {
      onEventClick(event);
    } else {
      onAction("Viewed", event.title);
    }
  };

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <SwipeCard
          key={event.id}
          onTap={() => handleEventClick(event)}
        >
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                {getTypeIcon(event.category || event.type)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{event.time}</span>
                  {event.unit && (
                    <>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{event.unit}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Badge className={getPriorityColor(event.priority)}>
              {event.priority}
            </Badge>
          </div>
        </SwipeCard>
      ))}
    </div>
  );
};

export default EventsList;
