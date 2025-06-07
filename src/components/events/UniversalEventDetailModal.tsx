
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isPast, isToday } from 'date-fns';
import MoveInEventDetails from './event-types/MoveInEventDetails';
import LeaseSigningEventDetails from './event-types/LeaseSigningEventDetails';
import ResidentMessageEventDetails from './event-types/ResidentMessageEventDetails';
import TourEventDetails from './event-types/TourEventDetails';
import MoveOutEventDetails from './event-types/MoveOutEventDetails';
import PaymentEventDetails from './event-types/PaymentEventDetails';
import WorkOrderEventDetails from './event-types/WorkOrderEventDetails';
import EventMessaging from './EventMessaging';
import EventTimeline from './EventTimeline';
import RescheduleFlow from './RescheduleFlow';
import { EnhancedEvent } from '@/types/events';
import { teamAvailabilityService } from '@/services/teamAvailabilityService';

interface UniversalEventDetailModalProps {
  event: any;
  onClose: () => void;
  userRole?: 'operator' | 'maintenance' | 'resident';
  onEventUpdate?: (updatedEvent: any) => void;
}

const UniversalEventDetailModal = ({ event, onClose, userRole = 'operator', onEventUpdate }: UniversalEventDetailModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'details' | 'message' | 'timeline'>('details');
  const [messageText, setMessageText] = useState('');
  const [currentEvent, setCurrentEvent] = useState(event);
  const [showRescheduleFlow, setShowRescheduleFlow] = useState(false);

  // Overdue detection logic
  const isEventOverdue = (event: any): boolean => {
    // Only check if event is not completed
    if (event.status === 'completed' || event.status === 'cancelled') return false;
    
    const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
    const now = new Date();
    
    // If event date is in the past, it's overdue
    if (isPast(eventDate) && !isToday(eventDate)) {
      return true;
    }
    
    // If event is today but the time has passed, it's overdue
    if (isToday(eventDate) && event.time) {
      try {
        const [hours, minutes] = event.time.split(':').map(Number);
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(hours, minutes || 0, 0, 0);
        
        return isPast(eventDateTime);
      } catch (error) {
        console.warn('Error parsing event time:', event.time, error);
        return false;
      }
    }
    
    return false;
  };

  const eventIsOverdue = isEventOverdue(currentEvent);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'move-in': return '🏠';
      case 'move-out': return '📦';
      case 'lease': return '📄';
      case 'message': return '💬';
      case 'tour': return '👀';
      case 'payment': return '💳';
      case 'maintenance': return '🔧';
      default: return '📅';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'move-in': return 'bg-green-100 text-green-800 border-green-200';
      case 'move-out': return 'bg-red-100 text-red-800 border-red-200';
      case 'lease': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'message': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tour': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'payment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string, status?: string, isOverdue?: boolean) => {
    if (isOverdue) return 'bg-red-100 text-red-800 border-red-200';
    if (status === 'urgent') return 'bg-red-100 text-red-800 border-red-200';
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    toast({
      title: "Message Sent",
      description: `Message sent regarding ${currentEvent.title}`,
    });
    
    setMessageText('');
    setActiveTab('timeline');
  };

  const handleWorkOrderNudge = (updatedEvent: any) => {
    setCurrentEvent(updatedEvent);
    // Switch to timeline tab to show the new entry
    setActiveTab('timeline');
  };

  const handleWorkOrderUrgent = (updatedEvent: any) => {
    setCurrentEvent(updatedEvent);
    // Switch to timeline tab to show the new entry
    setActiveTab('timeline');
  };

  const handleWorkOrderCancel = (updatedEvent: any) => {
    setCurrentEvent(updatedEvent);
    // Switch to timeline tab to show the new entry
    setActiveTab('timeline');
  };

  const handleReschedule = () => {
    // Convert event to EnhancedEvent format for reschedule flow
    const enhancedEvent: EnhancedEvent = {
      id: currentEvent.id,
      date: currentEvent.date,
      time: currentEvent.time,
      title: currentEvent.title,
      description: currentEvent.description,
      category: currentEvent.category,
      priority: currentEvent.priority,
      canReschedule: true,
      canCancel: true,
      estimatedDuration: 60,
      rescheduledCount: currentEvent.rescheduledCount || 0,
      assignedTeamMember: currentEvent.assignedTeamMember || teamAvailabilityService.assignTeamMember({ category: currentEvent.category }),
      residentName: currentEvent.residentName || 'Resident',
      phone: currentEvent.phone || '(555) 123-4567',
      unit: currentEvent.unit,
      building: currentEvent.building,
      status: currentEvent.status
    };
    
    setShowRescheduleFlow(true);
  };

  const handleRescheduleConfirm = (rescheduleData: any) => {
    const updatedEvent = {
      ...currentEvent,
      date: rescheduleData.newDate,
      time: rescheduleData.newTime,
      rescheduledCount: (currentEvent.rescheduledCount || 0) + 1
    };
    
    setCurrentEvent(updatedEvent);
    setShowRescheduleFlow(false);
    
    // Notify parent component of the update
    onEventUpdate?.(updatedEvent);
    
    toast({
      title: "Event Rescheduled",
      description: `${updatedEvent.title} has been rescheduled successfully.`,
    });
  };

  const canReschedule = () => {
    // Most event types can be rescheduled, except completed ones
    return currentEvent.status !== 'completed' && currentEvent.status !== 'cancelled';
  };

  const renderEventDetails = () => {
    switch (currentEvent.type) {
      case 'move-in':
        return <MoveInEventDetails event={currentEvent} userRole={userRole} />;
      case 'lease':
        return <LeaseSigningEventDetails event={currentEvent} userRole={userRole} />;
      case 'message':
        return <ResidentMessageEventDetails event={currentEvent} userRole={userRole} />;
      case 'tour':
        return <TourEventDetails event={currentEvent} userRole={userRole} />;
      case 'move-out':
        return <MoveOutEventDetails event={currentEvent} userRole={userRole} />;
      case 'payment':
        return <PaymentEventDetails event={currentEvent} userRole={userRole} />;
      case 'maintenance':
        return (
          <WorkOrderEventDetails 
            event={currentEvent} 
            userRole={userRole}
            onNudgeSent={handleWorkOrderNudge}
            onMarkUrgent={handleWorkOrderUrgent}
            onCancel={handleWorkOrderCancel}
          />
        );
      default:
        return <div className="p-4 text-gray-500">Event details not available</div>;
    }
  };

  if (showRescheduleFlow) {
    const enhancedEvent: EnhancedEvent = {
      id: currentEvent.id,
      date: currentEvent.date,
      time: currentEvent.time,
      title: currentEvent.title,
      description: currentEvent.description,
      category: currentEvent.category,
      priority: currentEvent.priority,
      canReschedule: true,
      canCancel: true,
      estimatedDuration: 60,
      rescheduledCount: currentEvent.rescheduledCount || 0,
      assignedTeamMember: currentEvent.assignedTeamMember || teamAvailabilityService.assignTeamMember({ category: currentEvent.category }),
      residentName: currentEvent.residentName || 'Resident',
      phone: currentEvent.phone || '(555) 123-4567',
      unit: currentEvent.unit,
      building: currentEvent.building,
      status: currentEvent.status
    };

    return (
      <RescheduleFlow
        event={enhancedEvent}
        onClose={() => setShowRescheduleFlow(false)}
        onConfirm={handleRescheduleConfirm}
        userRole={userRole}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xl sm:text-2xl flex-shrink-0">{getEventTypeIcon(currentEvent.type)}</span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {eventIsOverdue && <span className="text-red-700 font-bold mr-1">OVERDUE</span>}
                  {currentEvent.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{currentEvent.time} • {currentEvent.building} {currentEvent.unit}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
            <Badge className={`${getEventTypeColor(currentEvent.type)} text-xs whitespace-nowrap`}>
              {currentEvent.type === 'maintenance' ? 'Work Order' : currentEvent.type.replace('-', ' ')}
            </Badge>
            <Badge className={`${getPriorityColor(currentEvent.priority, currentEvent.status, eventIsOverdue)} text-xs whitespace-nowrap`}>
              {eventIsOverdue ? 'OVERDUE' : currentEvent.status === 'urgent' ? 'URGENT' : currentEvent.priority?.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Overdue Warning */}
        {eventIsOverdue && (
          <div className="px-3 sm:px-4 py-2 bg-red-50 border-b border-red-200">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">This event is overdue and requires immediate attention</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {canReschedule() && (
          <div className="px-3 sm:px-4 py-2 border-b border-gray-100 bg-gray-50">
            <Button
              onClick={handleReschedule}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Reschedule
            </Button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'message'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
            Message
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'timeline'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Timeline
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(95vh - 120px)' }}>
          {activeTab === 'details' && renderEventDetails()}
          
          {activeTab === 'message' && (
            <EventMessaging
              event={currentEvent}
              messageText={messageText}
              setMessageText={setMessageText}
              onSendMessage={handleSendMessage}
              userRole={userRole}
            />
          )}
          
          {activeTab === 'timeline' && (
            <EventTimeline event={currentEvent} userRole={userRole} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalEventDetailModal;
