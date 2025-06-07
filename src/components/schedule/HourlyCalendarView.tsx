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

  // Safely compare dates by converting to string format
  const isSameDateSafe = (date1: any, date2: Date): boolean => {
    try {
      // Handle both Date objects and date-like objects
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);
      
      // Compare using date strings to avoid circular reference issues
      return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Date comparison error:', error);
      return false;
    }
  };

  const getEventsForTimeSlot = (slotTime: Date) => {
    const slotHour = slotTime.getHours();
    
    const filteredEvents = events.filter(event => {
      // Check if event is on the same date using safe comparison
      if (!isSameDateSafe(event.date, selectedDate)) return false;
      
      // Normalize the event time and extract hour
      const normalizedTime = normalizeTimeFormat(event.time);
      if (!normalizedTime) return false;
      
      const [eventHours] = normalizedTime.split(':').map(Number);
      return eventHours === slotHour;
    });

    // Remove duplicates based on title and time to prevent multiple identical events
    const uniqueEvents = filteredEvents.filter((event, index, self) => 
      index === self.findIndex(e => e.title === event.title && e.time === event.time)
    );

    return uniqueEvents;
  };

  const handleDragOver = (e: React.DragEvent, timeString: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(timeString);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're actually leaving the drop zone
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverSlot(null);
    }
  };

  const handleDrop = (e: React.DragEvent, timeString: string) => {
    e.preventDefault();
    setDragOverSlot(null);
    
    try {
      const suggestionData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Convert timeString to 24-hour format for consistency
      const normalizedTime = normalizeTimeFormat(timeString);
      console.log('Dropping suggestion:', suggestionData.title, 'at time:', normalizedTime);
      
      // Check if there's already an event with the same title at this time to prevent duplicates
      const eventsAtTime = getEventsForTimeSlot(addHours(startOfDay(selectedDate), parseInt(normalizedTime.split(':')[0])));
      const isDuplicate = eventsAtTime.some(event => event.title === suggestionData.title);
      
      if (isDuplicate) {
        toast({
          title: "Event Already Exists",
          description: `${suggestionData.title} is already scheduled at ${timeString}`,
          variant: "destructive"
        });
        return;
      }
      
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
            const isCurrentHour = new Date().getHours() === slot.getHours() && isSameDateSafe(selectedDate, new Date());
            const isDragOver = dragOverSlot === timeString;
            
            return (
              <div
                key={timeString}
                className={cn(
                  "border-b border-gray-50 transition-all duration-150 min-h-[60px] relative",
                  isCurrentHour && "bg-blue-50",
                  isDragOver && "bg-green-100 border-green-300 shadow-md"
                )}
                onDragOver={(e) => handleDragOver(e, timeString)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, timeString)}
              >
                <div className="flex items-start p-3 gap-3">
                  <div className="w-16 flex-shrink-0 pt-1">
                    <span className={cn(
                      "text-sm font-medium",
                      isCurrentHour ? "text-blue-700" : "text-gray-600"
                    )}>
                      {timeString}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0 relative">
                    {eventsInSlot.length === 0 ? (
                      <div className={cn(
                        "h-12 rounded-lg border-2 border-dashed transition-all duration-150 flex items-center justify-center touch-manipulation",
                        isDragOver 
                          ? "border-green-400 bg-green-50 scale-[1.02]" 
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-25"
                      )}>
                        {isDragOver && (
                          <span className="text-sm text-green-700 font-medium animate-pulse">Drop here</span>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {eventsInSlot.map((event, index) => (
                          <div
                            key={`${event.id}-${event.time}-${index}`}
                            className="bg-blue-100 border border-blue-200 rounded-lg p-3 cursor-pointer hover:bg-blue-200 transition-all duration-150 touch-manipulation active:scale-[0.98]"
                            onClick={() => handleEventClick(event)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              handleEventHold(event);
                            }}
                            onTouchStart={(e) => {
                              const touchTimeout = setTimeout(() => {
                                handleEventHold(event);
                              }, 300); // Reduced from 400ms to 300ms
                              
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
                                  <p className="text-xs text-gray-600 truncate mt-1">{event.description}</p>
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
                    
                    {/* Enhanced drop zone overlay for better mobile touch */}
                    {isDragOver && (
                      <div className="absolute inset-0 pointer-events-none bg-green-100 bg-opacity-50 rounded-lg border-2 border-green-400 border-dashed animate-pulse" />
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
