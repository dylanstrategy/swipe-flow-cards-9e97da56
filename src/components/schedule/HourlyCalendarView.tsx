
import React, { useState, useRef } from 'react';
import { format, addMinutes, startOfDay, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Clock, Calendar, Plus, CheckCircle } from 'lucide-react';
import type { TaskCompletionStamp } from '@/types/taskStamps';
import TaskStampRenderer from './TaskStampRenderer';
import EventCompletionRenderer from './EventCompletionRenderer';

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
  status?: string;
  date: Date;
  isOverdue?: boolean;
  taskCompletionStamps?: TaskCompletionStamp[];
  tasks?: any[];
}

interface HourlyCalendarViewProps {
  selectedDate: Date;
  events: Event[];
  onDropSuggestion?: (suggestion: any, targetTime?: string) => void;
  onEventClick?: (event: Event) => void;
  onEventHold?: (event: Event) => void;
  onEventReschedule?: (event: Event, newTime: string) => void;
  currentUserRole?: string;
  viewType?: 'day' | '3day' | 'week' | 'month';
}

const HourlyCalendarView = ({
  selectedDate,
  events,
  onDropSuggestion,
  onEventClick,
  onEventHold,
  onEventReschedule,
  currentUserRole = 'resident',
  viewType = 'day'
}: HourlyCalendarViewProps) => {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const dragCounterRef = useRef(0);

  // Real-time overdue detection logic - MOVED TO TOP
  const isEventOverdue = (event: Event): boolean => {
    if (event.hasOwnProperty('isOverdue')) {
      return event.isOverdue || false;
    }

    if (event.status === 'completed' || event.status === 'cancelled') return false;
    
    const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
    const now = new Date();
    
    if (isPast(eventDate) && !isToday(eventDate)) {
      return true;
    }
    
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

  // Check if event is fully completed - all required tasks done
  const isEventCompleted = (event: Event): boolean => {
    if (event.status === 'completed') return true;
    
    if (event.tasks) {
      const requiredTasks = event.tasks.filter(task => task.isRequired);
      const completedRequiredTasks = requiredTasks.filter(task => task.isComplete);
      return requiredTasks.length > 0 && completedRequiredTasks.length === requiredTasks.length;
    }
    
    return false;
  };

  // Updated color logic: Blue by default, red only when overdue, green when completed
  const getEventColors = (event: Event, isOverdue: boolean, isCompleted: boolean) => {
    if (isCompleted) {
      return 'bg-green-100 border-green-300 text-green-800';
    }
    
    if (isOverdue) {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    
    // Default blue styling for all events
    if (event.isDroppedSuggestion) {
      return 'bg-blue-500 border-blue-600 text-white';
    } else {
      return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const handleEventClick = (event: Event) => {
    onEventClick?.(event);
  };

  // Generate dates based on view type
  const getDatesForView = () => {
    const dates = [];
    const baseDate = new Date(selectedDate);
    
    switch (viewType) {
      case 'day':
        dates.push(baseDate);
        break;
      case '3day':
        for (let i = 0; i < 3; i++) {
          const date = new Date(baseDate);
          date.setDate(date.getDate() + i);
          dates.push(date);
        }
        break;
      case 'week':
        const weekStart = new Date(baseDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        for (let i = 0; i < 7; i++) {
          const date = new Date(weekStart);
          date.setDate(date.getDate() + i);
          dates.push(date);
        }
        break;
      case 'month':
        // For month view, generate a full month calendar grid
        const monthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
        const monthEnd = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
        const calendarStart = new Date(monthStart);
        calendarStart.setDate(calendarStart.getDate() - monthStart.getDay());
        
        for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
          const date = new Date(calendarStart);
          date.setDate(date.getDate() + i);
          dates.push(date);
        }
        break;
    }
    return dates;
  };

  const viewDates = getDatesForView();

  // Handle empty state for all view types
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">You have a free day</h3>
          <p className="text-gray-400">Take it easy</p>
        </div>
      </div>
    );
  }

  // Month view - traditional calendar grid layout
  if (viewType === 'month') {
    const eventsForDate = (date: Date) => {
      return events.filter(event => 
        format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
    };

    const today = new Date();
    const currentMonth = selectedDate.getMonth();

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {format(selectedDate, 'MMMM yyyy')}
            </h3>
          </div>
        </div>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {viewDates.map((date, index) => {
            const dayEvents = eventsForDate(date);
            const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] p-2 border-b border-r border-gray-100 last:border-r-0",
                  !isCurrentMonth && "bg-gray-50 text-gray-400"
                )}
              >
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center text-sm rounded-full mb-2",
                  isToday && "bg-blue-600 text-white font-semibold",
                  isSelected && !isToday && "bg-blue-100 text-blue-600 font-semibold",
                  !isToday && !isSelected && isCurrentMonth && "text-gray-900",
                  !isCurrentMonth && "text-gray-400"
                )}>
                  {format(date, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const isOverdue = isEventOverdue(event);
                    const isCompleted = isEventCompleted(event);
                    
                    return (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={cn(
                          "text-xs p-1 rounded cursor-pointer truncate",
                          isCompleted && "bg-green-100 text-green-800",
                          isOverdue && !isCompleted && "bg-red-100 text-red-800",
                          !isOverdue && !isCompleted && "bg-blue-100 text-blue-800"
                        )}
                        title={`${event.time} - ${event.title}`}
                      >
                        {event.time} {event.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 p-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Week and 3-day view - multi-column layout
  if (viewType === 'week' || viewType === '3day') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {viewType === 'week' ? 'Week View' : '3-Day View'}
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className={cn("grid", viewType === 'week' ? "grid-cols-7" : "grid-cols-3", "min-w-full")}>
            {viewDates.map((date, index) => (
              <div key={index} className="border-r border-gray-100 last:border-r-0">
                <div className="p-3 bg-gray-50 border-b border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900">
                    {format(date, 'EEE d')}
                  </h4>
                </div>
                <div className="p-2 min-h-[300px]">
                  <div className="space-y-1">
                    {events
                      .filter(event => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
                      .map((event) => {
                        const isOverdue = isEventOverdue(event);
                        const isCompleted = isEventCompleted(event);
                        const eventColors = getEventColors(event, isOverdue, isCompleted);
                        
                        return (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className={cn(
                              "p-2 rounded text-xs cursor-pointer transition-all duration-200 hover:shadow-sm",
                              eventColors
                            )}
                          >
                            <div className="font-medium">{event.time}</div>
                            <div className="truncate">{event.title}</div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  // Get all task completion stamps from all events
  const getAllTaskStamps = (): TaskCompletionStamp[] => {
    const allStamps: TaskCompletionStamp[] = [];
    events.forEach(event => {
      if (event.taskCompletionStamps) {
        allStamps.push(...event.taskCompletionStamps);
      }
    });
    return allStamps;
  };

  const allTaskStamps = getAllTaskStamps();

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

  const getOverdueClasses = (isOverdue: boolean) => {
    if (isOverdue) {
      return 'wiggle-overdue pulse-overdue';
    }
    return '';
  };

  const handleDragStart = (e: React.DragEvent, event: Event) => {
    // Don't allow dragging completed events (LOCK COMPLETED EVENTS)
    if (isEventCompleted(event)) {
      e.preventDefault();
      return;
    }
    
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

  const handleEventHold = (event: Event) => {
    onEventHold?.(event);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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

      {/* Calendar with full height - NO SCROLL CONTAINER - Allow page scroll */}
      <div className="divide-y divide-gray-100">
        {timeSlots.map((timeSlot) => {
          const slotEvents = getEventsForTimeSlot(timeSlot);
          const isDragOver = dragOverSlot === timeSlot;
          
          return (
            <div
              key={timeSlot}
              className={cn(
                "flex min-h-[80px] transition-all duration-200 relative",
                isDragOver && "bg-green-50 border-l-4 border-green-400"
              )}
              onDragOver={(e) => handleDragOver(e, timeSlot)}
              onDragEnter={(e) => handleDragEnter(e, timeSlot)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, timeSlot)}
            >
              {/* Time column - Fixed width */}
              <div className="w-20 flex-shrink-0 p-4 bg-gray-50 flex flex-col items-center justify-start border-r border-gray-100">
                <span className="text-sm font-medium text-gray-900">
                  {formatTime12Hour(timeSlot)}
                </span>
              </div>

              {/* Events column - Flexible with proper overflow handling */}
              <div className="flex-1 p-4 min-h-[80px] relative">
                {/* Task completion stamps layer (background) - PERMANENT STAMPS */}
                <TaskStampRenderer 
                  stamps={allTaskStamps}
                  timeSlot={timeSlot}
                  selectedDate={selectedDate}
                />

                {slotEvents.length === 0 ? (
                  <div className={cn(
                    "w-full h-full min-h-[48px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg transition-all duration-200 relative z-10",
                    isDragOver && "border-green-400 bg-green-50 text-green-600"
                  )}>
                    {isDragOver ? (
                      <span className="text-sm font-medium">Drop here to schedule</span>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 relative z-10">
                    {slotEvents.map((event) => {
                      const isOverdue = isEventOverdue(event);
                      const isCompleted = isEventCompleted(event);
                      const overdueClasses = getOverdueClasses(isOverdue && !isCompleted);
                      const eventColors = getEventColors(event, isOverdue, isCompleted);
                      
                      return (
                        <div key={event.id} className="space-y-2">
                          {/* Main event card or completion renderer */}
                          {isCompleted ? (
                            <EventCompletionRenderer
                              eventTitle={event.title}
                              eventType={event.category}
                              completedAt={event.taskCompletionStamps?.[event.taskCompletionStamps.length - 1]?.completedAt || new Date()}
                              completedBy={event.taskCompletionStamps?.[event.taskCompletionStamps.length - 1]?.completedByName || 'System'}
                              isLocked={true}
                            />
                          ) : (
                            <div
                              draggable={!isCompleted}
                              onDragStart={(e) => handleDragStart(e, event)}
                              onDragEnd={handleDragEnd}
                              onClick={() => handleEventClick(event)}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                handleEventHold(event);
                              }}
                              className={cn(
                                "p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95 w-full",
                                eventColors,
                                event.isDroppedSuggestion && !isOverdue && "text-white shadow-lg",
                                !event.isDroppedSuggestion && !isOverdue && "hover:scale-105",
                                overdueClasses,
                                isCompleted && "cursor-not-allowed pointer-events-none"
                              )}
                            >
                              <div className="flex items-start justify-between w-full">
                                <div className="flex-1 min-w-0">
                                  <h4 className={cn(
                                    "font-semibold text-sm break-words",
                                    (event.isDroppedSuggestion && !isOverdue && !isCompleted) ? "text-white" : ""
                                  )}>
                                    {isOverdue && !isCompleted && <span className="text-red-700 font-bold mr-1">OVERDUE</span>}
                                    {event.title}
                                  </h4>
                                  <p className={cn(
                                    "text-xs mt-1 break-words",
                                    (event.isDroppedSuggestion && !isOverdue && !isCompleted) ? "text-white/90" : isOverdue ? "text-red-700" : "text-blue-700"
                                  )}>
                                    {event.description}
                                  </p>
                                  {(event.unit || event.building) && (
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                      {event.building && (
                                        <span className={cn(
                                          "text-xs px-2 py-1 rounded-full break-words",
                                          (event.isDroppedSuggestion && !isOverdue && !isCompleted)
                                            ? "bg-white/20 text-white" 
                                            : isOverdue
                                            ? "bg-red-200 text-red-800"
                                            : "bg-gray-100 text-gray-600"
                                        )}>
                                          {event.building}
                                        </span>
                                      )}
                                      {event.unit && (
                                        <span className={cn(
                                          "text-xs px-2 py-1 rounded-full break-words",
                                          (event.isDroppedSuggestion && !isOverdue && !isCompleted)
                                            ? "bg-white/20 text-white" 
                                            : isOverdue
                                            ? "bg-red-200 text-red-800"
                                            : "bg-blue-100 text-blue-700"
                                        )}>
                                          Unit {event.unit}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {event.rescheduledCount && event.rescheduledCount > 0 && !isCompleted && (
                                <div className="mt-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full inline-block">
                                  Rescheduled {event.rescheduledCount}x
                                </div>
                              )}
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
