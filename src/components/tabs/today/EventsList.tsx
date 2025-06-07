
import React, { useState } from 'react';
import { Clock, Home, Users, Calendar, Wrench, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SwipeCard from '@/components/SwipeCard';
import RescheduleFlow from '@/components/events/RescheduleFlow';
import EventDetailModal from '@/components/events/EventDetailModal';
import { useToast } from '@/hooks/use-toast';
import { EnhancedEvent } from '@/types/events';
import { teamAvailabilityService } from '@/services/teamAvailabilityService';

interface EventsListProps {
  events: any[];
  onAction: (action: string, item: string) => void;
  onQuickReply: (subject: string, recipientType?: 'management' | 'maintenance' | 'leasing') => void;
  getSwipeActionsForEvent: (event: any) => any;
}

const EventsList = ({ events, onAction, onQuickReply, getSwipeActionsForEvent }: EventsListProps) => {
  const { toast } = useToast();
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showRescheduleFlow, setShowRescheduleFlow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EnhancedEvent | null>(null);

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

  const canReschedule = (type: string) => {
    return ['inspection', 'lease', 'maintenance', 'meeting', 'Work Order', 'Management', 'Lease'].includes(type);
  };

  const enhanceEventForReschedule = (event: any): EnhancedEvent => {
    const assignedTeamMember = teamAvailabilityService.assignTeamMember({ category: event.category || event.type });
    
    return {
      id: event.id,
      date: event.date || new Date(),
      time: (event.time || '').replace(/\s(AM|PM)/, ''),
      title: event.title,
      description: event.description,
      category: event.category || event.type,
      priority: event.priority,
      assignedTeamMember,
      residentName: 'John Doe',
      phone: '(555) 123-4567',
      unit: event.unit,
      building: event.building,
      canReschedule: canReschedule(event.category || event.type),
      canCancel: true,
      estimatedDuration: (event.category || event.type) === 'inspection' ? 120 : 60,
      rescheduledCount: 0,
      image: event.image
    };
  };

  const handleEventClick = (event: any) => {
    const enhancedEvent = enhanceEventForReschedule(event);
    setSelectedEvent(enhancedEvent);
    setShowEventDetail(true);
  };

  const handleHoldEvent = (event: any) => {
    if (canReschedule(event.category || event.type)) {
      const enhancedEvent = enhanceEventForReschedule(event);
      setSelectedEvent(enhancedEvent);
      setShowEventDetail(true);
    } else {
      toast({
        title: "Event Details",
        description: `${event.title} - This event cannot be rescheduled`,
      });
    }
  };

  const handleEventDetailReschedule = (rescheduleData: any) => {
    setShowEventDetail(false);
    setShowRescheduleFlow(true);
  };

  const handleRescheduleConfirm = (rescheduleData: any) => {
    toast({
      title: "Event Rescheduled",
      description: `${selectedEvent?.title} has been rescheduled successfully.`,
    });
    setShowRescheduleFlow(false);
    setSelectedEvent(null);
  };

  const handleEventDetailCancel = () => {
    toast({
      title: "Event Cancelled",
      description: `${selectedEvent?.title} has been cancelled.`,
    });
    setShowEventDetail(false);
    setSelectedEvent(null);
  };

  if (showRescheduleFlow && selectedEvent) {
    return (
      <RescheduleFlow
        event={selectedEvent}
        onClose={() => {
          setShowRescheduleFlow(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleRescheduleConfirm}
        userRole="resident"
      />
    );
  }

  if (showEventDetail && selectedEvent) {
    return (
      <EventDetailModal
        event={selectedEvent}
        onClose={() => {
          setShowEventDetail(false);
          setSelectedEvent(null);
        }}
        onReschedule={handleEventDetailReschedule}
        onCancel={handleEventDetailCancel}
        userRole="resident"
      />
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <SwipeCard
          key={event.id}
          onTap={() => handleEventClick(event)}
          onHold={() => handleHoldEvent(event)}
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
