
import React, { useState } from 'react';
import { format, addHours, startOfDay, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HourlyCalendarViewProps {
  selectedDate: Date;
  events: any[];
  onDropSuggestion?: (suggestion: any, targetTime: string) => void;
  onEventClick?: (event: any) => void;
  onEventHold?: (event: any) => void;
}

const HourlyCalendarView = ({ 
  selectedDate, 
  events, 
  onDropSuggestion, 
  onEventClick, 
  onEventHold 
}: HourlyCalendarViewProps) => {
  const { toast } = useToast();
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  // Generate hourly time slots from 6 AM to 10 PM
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = startOfDay(selectedDate);
    const startHour = addHours(startTime, 6); // Start at 6 AM
    
    for (let i = 0; i < 16; i++) { // 16 hours (6 AM to 10 PM)
      const time = addHours(startHour, i);
      slots.push(time);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Normalize time to 24-hour format for consistent comparison
  const normalizeTimeFormat = (timeString: string): string => {
    if (!timeString) return '';
    
    // If already in HH:MM format, return as is
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      const [hours, minutes] = timeString.split(':');
      return `${hours.padStart(2, '0')}:${minutes}`;
    }
    
    // Handle AM/PM format
    if (timeString.includes('AM') || timeString.includes('PM')) {
      const [time, period] = timeString.trim().split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      
      if (period === 'PM' && hours !== 12) {
        hour24 = hours + 12;
      } else if (period === 'AM' && hours === 12) {
        hour24 = 0;
      }
      
      return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    return timeString;
  };

  const getEventsForTimeSlot = (slotTime: Date) => {
    const slotHour = slotTime.getHours();
    
    return events.filter(event => {
      // Check if event is on the same date
      if (!isSameDay(event.date, selectedDate)) return false;
      
      // Normalize the event time and extract hour
      const normalizedTime = normalizeTimeFormat(event.time);
      if (!normalizedTime) return false;
      
      const [eventHours] = normalizedTime.split(':').map(Number);
      return eventHours === slotHour;
    });
  };

  const handleDragOver = (e: React.DragEvent, timeSlot: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(timeSlot);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, timeString: string) => {
    e.preventDefault();
    setDragOverSlot(null);
    
    try {
      const suggestionData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Convert timeString to 24-hour format for consistency
      const normalizedTime = normalizeTimeFormat(timeString);
      console.log('Dropping suggestion:', suggestionData.title, 'at time:', normalizedTime);
      
      onDropSuggestion?.(suggestionData, normalizedTime);
      
      toast({
        title: "Event Scheduled!",
        description: `${suggestionData.title} has been scheduled for ${timeString}`,
      });
    } catch (error) {
      console.error('Error parsing dropped data:', error);
      toast({
        title: "Error",
        description: "Failed to schedule the event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEventClick = (event: any) => {
    onEventClick?.(event);
  };

  const handleEventHold = (event: any) => {
    onEventHold?.(event);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        <p className="text-sm text-gray-600">Drag suggestions to time slots to schedule them</p>
      </div>
      
      <ScrollArea className="h-96">
        <div className="w-full">
          {timeSlots.map((slot) => {
            const timeString = format(slot, 'h:mm a');
            const eventsInSlot = getEventsForTimeSlot(slot);
            const isCurrentHour = new Date().getHours() === slot.getHours() && isSameDay(selectedDate, new Date());
            const isDragOver = dragOverSlot === timeString;
            
            return (
              <div
                key={timeString}
                className={cn(
                  "border-b border-gray-50 transition-all duration-200",
                  isCurrentHour && "bg-blue-50",
                  isDragOver && "bg-green-100 border-green-300"
                )}
                onDragOver={(e) => handleDragOver(e, timeString)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, timeString)}
              >
                <div className="flex items-start p-3 gap-3">
                  <div className="w-16 flex-shrink-0">
                    <span className={cn(
                      "text-sm font-medium",
                      isCurrentHour ? "text-blue-700" : "text-gray-600"
                    )}>
                      {timeString}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {eventsInSlot.length === 0 ? (
                      <div className={cn(
                        "h-10 rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center",
                        isDragOver 
                          ? "border-green-400 bg-green-50" 
                          : "border-gray-200 hover:border-gray-300"
                      )}>
                        {isDragOver && (
                          <span className="text-sm text-green-700">Drop here</span>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {eventsInSlot.map((event) => (
                          <div
                            key={`${event.id}-${event.time}`}
                            className="bg-blue-100 border border-blue-200 rounded-lg p-2 cursor-pointer hover:bg-blue-200 transition-colors"
                            onClick={() => handleEventClick(event)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              handleEventHold(event);
                            }}
                            onTouchStart={(e) => {
                              const touchTimeout = setTimeout(() => {
                                handleEventHold(event);
                              }, 800);
                              
                              const clearTouch = () => {
                                clearTimeout(touchTimeout);
                                document.removeEventListener('touchend', clearTouch);
                                document.removeEventListener('touchmove', clearTouch);
                              };
                              
                              document.addEventListener('touchend', clearTouch);
                              document.addEventListener('touchmove', clearTouch);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">{event.title}</h4>
                                {event.description && (
                                  <p className="text-xs text-gray-600 truncate">{event.description}</p>
                                )}
                              </div>
                              <div className="text-xs text-blue-600 ml-2 flex-shrink-0">
                                {event.time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HourlyCalendarView;
