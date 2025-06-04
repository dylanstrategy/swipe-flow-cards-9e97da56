
import React, { useState } from 'react';
import { X, Clock, User, MapPin, Phone, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedEvent } from '@/types/events';
import RescheduleFlow from './RescheduleFlow';

interface EventDetailModalProps {
  event: EnhancedEvent;
  onClose: () => void;
  onReschedule: (data: any) => void;
  onCancel: () => void;
  userRole: 'resident' | 'operator' | 'maintenance';
}

const EventDetailModal = ({ 
  event, 
  onClose, 
  onReschedule, 
  onCancel,
  userRole 
}: EventDetailModalProps) => {
  const [showRescheduleFlow, setShowRescheduleFlow] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: Date, time: string) => {
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return `${dateStr} at ${time}`;
  };

  const handleReschedule = (rescheduleData: any) => {
    onReschedule(rescheduleData);
    setShowRescheduleFlow(false);
    onClose();
  };

  if (showRescheduleFlow) {
    return (
      <RescheduleFlow
        event={event}
        onClose={() => setShowRescheduleFlow(false)}
        onConfirm={handleReschedule}
        userRole={userRole}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-end md:items-center justify-center">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-xl md:rounded-xl shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Event Image */}
          {event.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Event Title and Priority */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <Badge className={getPriorityColor(event.priority)}>
                {event.priority}
              </Badge>
            </div>
            <p className="text-gray-600">{event.description}</p>
          </div>

          {/* Schedule Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-blue-600" size={20} />
              <span className="font-medium text-blue-900">Scheduled</span>
            </div>
            <p className="text-blue-800">{formatDateTime(event.date, event.time)}</p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="text-blue-600" size={16} />
              <span className="text-sm text-blue-700">
                Estimated duration: {event.estimatedDuration} minutes
              </span>
            </div>
          </div>

          {/* Assigned Team Member */}
          {event.assignedTeamMember && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-gray-600" size={20} />
                <span className="font-medium text-gray-900">Assigned to</span>
              </div>
              <p className="text-gray-800 font-medium">{event.assignedTeamMember.name}</p>
              <p className="text-sm text-gray-600 capitalize">{event.assignedTeamMember.role}</p>
              {event.assignedTeamMember.phone && (
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="text-gray-500" size={16} />
                  <span className="text-sm text-gray-600">{event.assignedTeamMember.phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Location Info */}
          {(event.unit || event.building) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="text-gray-600" size={20} />
                <span className="font-medium text-gray-900">Location</span>
              </div>
              {event.building && (
                <p className="text-gray-800">{event.building}</p>
              )}
              {event.unit && (
                <p className="text-gray-600">Unit {event.unit}</p>
              )}
            </div>
          )}

          {/* Resident Info */}
          {event.residentName && userRole !== 'resident' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-gray-600" size={20} />
                <span className="font-medium text-gray-900">Resident</span>
              </div>
              <p className="text-gray-800">{event.residentName}</p>
              {event.phone && (
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="text-gray-500" size={16} />
                  <span className="text-sm text-gray-600">{event.phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Reschedule History */}
          {event.rescheduledCount > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="text-yellow-600" size={20} />
                <span className="font-medium text-yellow-900">Rescheduled</span>
              </div>
              <p className="text-sm text-yellow-800">
                This event has been rescheduled {event.rescheduledCount} time{event.rescheduledCount > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
          {event.canReschedule && (
            <Button
              onClick={() => setShowRescheduleFlow(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Reschedule Event
            </Button>
          )}
          
          {event.canCancel && userRole !== 'resident' && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              Cancel Event
            </Button>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
