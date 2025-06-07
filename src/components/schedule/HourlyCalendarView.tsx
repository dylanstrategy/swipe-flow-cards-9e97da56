import React, { useState, useEffect } from 'react';
import { format, addHours, startOfDay, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface HourlyCalendarViewProps {
  selectedDate: Date;
  events: any[];
  onDropSuggestion?: (suggestion: any, targetTime: string) => void;
  onEventClick?: (event: any) => void;
  onEventHold?: (event: any) => void;
}

interface SchedulingPreferences {
  workStartTime: string;
  workEndTime: string;
  enableLunchBreak: boolean;
  lunchBreakStart: string;
  lunchBreakEnd: string;
  maxDailyAppointments: string;
  bufferTime: string;
  workDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
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
  const [schedulingPrefs, setSchedulingPrefs] = useState<SchedulingPreferences | null>(null);

  // Load scheduling preferences on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('schedulingPreferences');
    if (savedPrefs) {
      try {
        setSchedulingPrefs(JSON.parse(savedPrefs));
      } catch (error) {
        console.error('Error loading scheduling preferences:', error);
      }
    }
  }, []);

  // Check if a day is a work day
  const isWorkDay = (date: Date): boolean => {
    if (!schedulingPrefs) return true; // Default to all days if no preferences
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()] as keyof typeof schedulingPrefs.workDays;
    return schedulingPrefs.workDays[dayName];
  };

  // Convert time string to hour number
  const timeToHour = (timeString: string): number => {
    const [hours] = timeString.split(':').map(Number);
    return hours;
  };

  // Check if a time slot is during work hours
  const isWorkHour = (hour: number): boolean => {
    if (!schedulingPrefs) return true; // Default to all hours if no preferences
    
    const startHour = timeToHour(schedulingPrefs.workStartTime);
    const endHour = timeToHour(schedulingPrefs.workEndTime);
    
    return hour >= startHour && hour < endHour;
  };

  // Check if a time slot is during lunch break
  const isLunchBreak = (hour: number): boolean => {
    if (!schedulingPrefs || !schedulingPrefs.enableLunchBreak) return false;
    
    const lunchStart = timeToHour(schedulingPrefs.lunchBreakStart);
    const lunchEnd = timeToHour(schedulingPrefs.lunchBreakEnd);
    
    return hour >= lunchStart && hour < lunchEnd;
  };

  // Check if max daily appointments limit is reached
  const isMaxAppointmentsReached = (): boolean => {
    if (!schedulingPrefs) return false;
    
    const maxAppointments = parseInt(schedulingPrefs.maxDailyAppointments);
    const todayEvents = events.filter(event => isSameDateSafe(event.date, selectedDate));
    
    return todayEvents.length >= maxAppointments;
  };

  // Generate hourly time slots based on work hours or default 6 AM to 10 PM
  const generateTimeSlots = () => {
    const slots = [];
    const startTime = startOfDay(selectedDate);
    
    let startHour = 6; // Default start
    let endHour = 22; // Default end (10 PM)
    
    if (schedulingPrefs) {
      startHour = timeToHour(schedulingPrefs.workStartTime);
      endHour = timeToHour(schedulingPrefs.workEndTime);
    }
    
    const totalHours = endHour - startHour;
    
    for (let i = 0; i < totalHours; i++) {
      const time = addHours(startTime, startHour + i);
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
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);
      
      return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Date comparison error:', error);
      return false;
    }
  };

  const getEventsForTimeSlot = (slotTime: Date) => {
    const slotHour = slotTime.getHours();
    
    const filteredEvents = events.filter(event => {
      if (!isSameDateSafe(event.date, selectedDate)) return false;
      
      const normalizedTime = normalizeTimeFormat(event.time);
      if (!normalizedTime) return false;
      
      const [eventHours] = normalizedTime.split(':').map(Number);
      return eventHours === slotHour;
    });

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
      const normalizedTime = normalizeTimeFormat(timeString);
      const hour = parseInt(normalizedTime.split(':')[0]);
      
      // Check work day
      if (!isWorkDay(selectedDate)) {
        toast({
          title: "Non-Work Day",
          description: "This day is not configured as a work day in your scheduling preferences.",
          variant: "destructive"
        });
        return;
      }

      // Check work hours
      if (!isWorkHour(hour)) {
        toast({
          title: "Outside Work Hours",
          description: "This time is outside your configured work hours.",
          variant: "destructive"
        });
        return;
      }

      // Check lunch break
      if (isLunchBreak(hour)) {
        toast({
          title: "Lunch Break",
          description: "This time conflicts with your lunch break.",
          variant: "destructive"
        });
        return;
      }

      // Check max appointments
      if (isMaxAppointmentsReached()) {
        toast({
          title: "Daily Limit Reached",
          description: `You've reached your daily appointment limit of ${schedulingPrefs?.maxDailyAppointments || 'N/A'} appointments.`,
          variant: "destructive"
        });
        return;
      }

      // Check for duplicates
      const eventsAtTime = getEventsForTimeSlot(addHours(startOfDay(selectedDate), hour));
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

  // Check if the selected date is a work day
  const isSelectedDateWorkDay = isWorkDay(selectedDate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {isSelectedDateWorkDay ? 'Drag suggestions to time slots to schedule them' : 'Non-work day'}
          </p>
          {schedulingPrefs && (
            <div className="text-xs text-gray-500">
              {isMaxAppointmentsReached() ? (
                <span className="text-red-600 font-medium">Daily limit reached ({schedulingPrefs.maxDailyAppointments})</span>
              ) : (
                <span>{events.filter(e => isSameDateSafe(e.date, selectedDate)).length}/{schedulingPrefs.maxDailyAppointments} appointments</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full">
        {!isSelectedDateWorkDay ? (
          <div className="p-8 text-center text-gray-500">
            <p>This day is not configured as a work day.</p>
            <p className="text-sm mt-2">Check your scheduling preferences to modify work days.</p>
          </div>
        ) : (
          timeSlots.map((slot) => {
            const timeString = format(slot, 'h:mm a');
            const hour = slot.getHours();
            const eventsInSlot = getEventsForTimeSlot(slot);
            const isCurrentHour = new Date().getHours() === hour && isSameDateSafe(selectedDate, new Date());
            const isDragOver = dragOverSlot === timeString;
            const isLunch = isLunchBreak(hour);
            const isOutsideWorkHours = !isWorkHour(hour);
            const maxReached = isMaxAppointmentsReached();
            
            return (
              <div
                key={timeString}
                className={cn(
                  "border-b border-gray-50 transition-all duration-150 min-h-[60px] relative",
                  isCurrentHour && "bg-blue-50",
                  isDragOver && !isLunch && !isOutsideWorkHours && !maxReached && "bg-green-100 border-green-300 shadow-md",
                  isLunch && "bg-orange-50",
                  isOutsideWorkHours && "bg-gray-50"
                )}
                onDragOver={(e) => handleDragOver(e, timeString)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, timeString)}
              >
                <div className="flex items-start p-3 gap-3">
                  <div className="w-16 flex-shrink-0 pt-1">
                    <span className={cn(
                      "text-sm font-medium",
                      isCurrentHour ? "text-blue-700" : "text-gray-600",
                      isLunch && "text-orange-600",
                      isOutsideWorkHours && "text-gray-400"
                    )}>
                      {timeString}
                    </span>
                    {isLunch && (
                      <div className="text-xs text-orange-600 mt-1">Lunch</div>
                    )}
                    {isOutsideWorkHours && !isLunch && (
                      <div className="text-xs text-gray-400 mt-1">Off Hours</div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 relative">
                    {eventsInSlot.length === 0 ? (
                      <div className={cn(
                        "h-12 rounded-lg border-2 border-dashed transition-all duration-150 flex items-center justify-center touch-manipulation",
                        isDragOver && !isLunch && !isOutsideWorkHours && !maxReached
                          ? "border-green-400 bg-green-50 scale-[1.02]" 
                          : isLunch || isOutsideWorkHours || maxReached
                          ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-25"
                      )}>
                        {isDragOver && !isLunch && !isOutsideWorkHours && !maxReached && (
                          <span className="text-sm text-green-700 font-medium animate-pulse">Drop here</span>
                        )}
                        {isLunch && (
                          <span className="text-xs text-orange-600">Lunch Break</span>
                        )}
                        {isOutsideWorkHours && !isLunch && (
                          <span className="text-xs text-gray-400">Outside Work Hours</span>
                        )}
                        {maxReached && !isLunch && !isOutsideWorkHours && (
                          <span className="text-xs text-red-600">Daily Limit Reached</span>
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
                              }, 300);
                              
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
                    
                    {isDragOver && !isLunch && !isOutsideWorkHours && !maxReached && (
                      <div className="absolute inset-0 pointer-events-none bg-green-100 bg-opacity-50 rounded-lg border-2 border-green-400 border-dashed animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HourlyCalendarView;
