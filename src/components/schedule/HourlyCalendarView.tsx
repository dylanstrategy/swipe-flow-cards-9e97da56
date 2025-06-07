import React, { useState, useRef } from 'react';
import { format, addMinutes, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Clock, Calendar, Plus } from 'lucide-react';
import { useRealtimeOverdueDetection } from '@/hooks/useRealtimeOverdueDetection';

interface Event {
  id: number | string;
  time: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  unit?: string;
  building?: string;
  dueDate?: Date;
  image?: string;
  isDroppedSuggestion?: boolean;
  rescheduledCount?: number;
  date: Date;
  status?: string;
}

interface HourlyCalendarViewProps {
  selectedDate: Date;
  events: Event[];
  onDropSuggestion?: (suggestion: any, targetTime?: string) => void;
  onEventClick?: (event: Event) => void;
  onEventHold?: (event: Event) => void;
  onEventReschedule?: (event: Event, newTime: string) => void;
}

const HourlyCalendarView = ({
  selectedDate,
  events,
  onDropSuggestion,
  onEventClick,
  onEventHold,
  onEventReschedule
}: HourlyCalendarViewProps) => {
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const dragCounterRef = useRef(0);

  // Use real-time overdue detection
  const { isEventOverdue } = useRealtimeOverdueDetection(events);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const convertTimeToMinutes = (timeString: string): number => {
    if (!timeString) return 0;
    
    if (timeString.includes('AM') || timeString.includes('PM')) {
      const [time, period] = timeString.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = (hours % 12) * 60 + minutes;
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      if (period === 'AM' && hours === 12) totalMinutes = minutes;
      return totalMinutes;
    }
    
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime12Hour = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getEventsForTimeSlot = (timeSlot: string) => {
    const slotMinutes = convertTimeToMinutes(timeSlot);
    return events.filter(event => {
      const eventMinutes = convertTimeToMinutes(event.time);
      return eventMinutes >= slotMinutes && eventMinutes < slotMinutes + 60;
    });
  };

  const getPriorityColor = (priority: string, isDropped?: boolean, isOverdue?: boolean) => {
    if (isOverdue) {
      return 'bg-red-500 border-red-600 text-white wiggle-urgent pulse-urgent';
    }
    
    const baseColors = {
      'urgent': isDropped ? 'bg-red-500 border-red-600' : 'bg-red-100 border-red-300 text-red-800',
      'high': isDropped ? 'bg-orange-500 border-orange-600' : 'bg-orange-100 border-orange-300 text-orange-800',
      'medium': isDropped ? 'bg-yellow-500 border-yellow-600' : 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'low': isDropped ? 'bg-blue-500 border-blue-600' : 'bg-blue-100 border-blue-300 text-blue-800'
    };
    return baseColors[priority as keyof typeof baseColors] || baseColors.low;
  };

  const handleDragStart = (e: React.DragEvent, event: Event) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
    setDragOverSlot(null);
    dragCounterRef.current = 0;
  };

  const handleDragOver = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(timeSlot);
  };

  const handleDragEnter = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    dragCounterRef.current++;
    setDragOverSlot(timeSlot);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setDragOverSlot(null);
    }
  };

  const handleDrop = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    setDragOverSlot(null);
    dragCounterRef.current = 0;

    try {
      // First check if it's an existing event being moved
      if (draggedEvent) {
        onEventReschedule?.(draggedEvent, timeSlot);
        setDraggedEvent(null);
        return;
      }

      // Then check if it's a suggestion being dropped
      const suggestionData = e.dataTransfer.getData('application/json');
      if (suggestionData) {
        const suggestion = JSON.parse(suggestionData);
        onDropSuggestion?.(suggestion, timeSlot);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleEventClick = (event: Event) => {
    onEventClick?.(event);
  };

  const handleEventHold = (event: Event) => {
    onEventHold?.(event);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Drag suggestions here to schedule them at specific times
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {timeSlots.map((timeSlot) => {
          const slotEvents = getEventsForTimeSlot(timeSlot);
          const isDragOver = dragOverSlot === timeSlot;
          
          return (
            <div
              key={timeSlot}
              className={cn(
                "flex min-h-[80px] transition-all duration-200",
                isDragOver && "bg-green-50 border-l-4 border-green-400"
              )}
              onDragOver={(e) => handleDragOver(e, timeSlot)}
              onDragEnter={(e) => handleDragEnter(e, timeSlot)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, timeSlot)}
            >
              {/* Time column */}
              <div className="w-20 flex-shrink-0 p-4 bg-gray-50 flex flex-col items-center justify-start">
                <span className="text-sm font-medium text-gray-900">
                  {formatTime12Hour(timeSlot)}
                </span>
              </div>

              {/* Events column */}
              <div className="flex-1 p-4 min-h-[80px] relative">
                {slotEvents.length === 0 ? (
                  <div className={cn(
                    "w-full h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg transition-all duration-200",
                    isDragOver && "border-green-400 bg-green-50 text-green-600"
                  )}>
                    {isDragOver ? (
                      <span className="text-sm font-medium">Drop here to schedule</span>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {slotEvents.map((event) => {
                      const eventIsOverdue = isEventOverdue(event);
                      
                      return (
                        <div
                          key={event.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, event)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleEventClick(event)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            handleEventHold(event);
                          }}
                          className={cn(
                            "p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95",
                            getPriorityColor(event.priority, event.isDroppedSuggestion, eventIsOverdue),
                            (event.isDroppedSuggestion || eventIsOverdue) && "text-white shadow-lg",
                            !event.isDroppedSuggestion && !eventIsOverdue && "hover:scale-105"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className={cn(
                                "font-semibold text-sm truncate",
                                (event.isDroppedSuggestion || eventIsOverdue) ? "text-white" : ""
                              )}>
                                {event.title}
                              </h4>
                              <p className={cn(
                                "text-xs mt-1 line-clamp-2",
                                (event.isDroppedSuggestion || eventIsOverdue) ? "text-white/90" : "text-gray-600"
                              )}>
                                {event.description}
                              </p>
                              {(event.unit || event.building) && (
                                <div className="flex items-center gap-2 mt-2">
                                  {event.building && (
                                    <span className={cn(
                                      "text-xs px-2 py-1 rounded-full",
                                      (event.isDroppedSuggestion || eventIsOverdue)
                                        ? "bg-white/20 text-white" 
                                        : "bg-gray-100 text-gray-600"
                                    )}>
                                      {event.building}
                                    </span>
                                  )}
                                  {event.unit && (
                                    <span className={cn(
                                      "text-xs px-2 py-1 rounded-full",
                                      (event.isDroppedSuggestion || eventIsOverdue)
                                        ? "bg-white/20 text-white" 
                                        : "bg-blue-100 text-blue-700"
                                    )}>
                                      Unit {event.unit}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {event.rescheduledCount && event.rescheduledCount > 0 && (
                            <div className={cn(
                              "mt-2 text-xs px-2 py-1 rounded-full inline-block",
                              eventIsOverdue ? "bg-white/20 text-white" : "text-orange-600 bg-orange-100"
                            )}>
                              Rescheduled {event.rescheduledCount}x
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyCalendarView;
