import React from 'react';
import { X, Calendar, Clock, User, Phone, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedEvent } from '@/types/events';
import { format } from 'date-fns';

interface EventDetailModalProps {
  event: EnhancedEvent;
  onClose: () => void;
  onReschedule: (data: any) => void;
  onCancel: () => void;
  userRole: 'resident' | 'operator' | 'maintenance';
}

const EventDetailModal = ({ event, onClose, onReschedule, onCancel, userRole }: EventDetailModalProps) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEEE, MMMM do, yyyy');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Prevent background scrolling
  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-end"
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      style={{ 
        width: '100vw', 
        height: '100vh',
        touchAction: 'none'
      }}
    >
      <div 
        className="bg-white w-full max-h-[90vh] rounded-t-2xl flex flex-col overflow-hidden"
        style={{ 
          touchAction: 'pan-y',
          maxWidth: '100vw'
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 p-4 overflow-y-auto" 
          style={{ 
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch'
          }}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="space-y-6">
            {/* Event Image */}
            {event.image && (
              <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Basic Info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                <Badge className={getPriorityColor(event.priority)}>
                  {event.priority}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
            </div>

            {/* Date & Time */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar size={20} className="text-blue-600" />
                <span className="font-medium text-blue-900">Date & Time</span>
              </div>
              <div className="text-blue-800">
                <p className="font-medium">{formatDate(event.date)}</p>
                <p className="flex items-center gap-2">
                  <Clock size={16} />
                  {formatTime(event.time)} ({event.estimatedDuration} minutes)
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">{event.building}</p>
                <p className="text-gray-600">Unit {event.unit}</p>
              </div>
            </div>

            {/* Resident Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <User size={20} className="text-gray-600" />
                <span className="font-medium text-gray-900">Resident Information</span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-800">{event.residentName}</p>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  <span className="text-gray-600">{event.phone}</span>
                </div>
              </div>
            </div>

            {/* Team Member */}
            {event.assignedTeamMember && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.assignedTeamMember.name}</p>
                  <p className="text-sm text-gray-600">{event.assignedTeamMember.role}</p>
                </div>
              </div>
            )}

            {/* Reschedule History */}
            {event.rescheduledCount > 0 && (
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} className="text-orange-600" />
                  <span className="font-medium text-orange-900">
                    This event has been rescheduled {event.rescheduledCount} time{event.rescheduledCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 space-y-3">
          {event.canReschedule && (
            <Button
              onClick={() => onReschedule({})}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Calendar size={20} className="mr-2" />
              Reschedule Event
            </Button>
          )}
          
          {event.canCancel && (
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
