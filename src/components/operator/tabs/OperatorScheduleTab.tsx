
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import OperatorScheduleMenu from '@/components/schedule/OperatorScheduleMenu';
import UniversalEventCreationFlow from '@/components/events/UniversalEventCreationFlow';
import DraggableSuggestionsSection from '@/components/schedule/DraggableSuggestionsSection';
import DroppableCalendar from '@/components/schedule/DroppableCalendar';
import UniversalEventDetailModal from '@/components/events/UniversalEventDetailModal';
import RescheduleFlow from '@/components/events/RescheduleFlow';
import { EnhancedEvent } from '@/types/events';
import { teamAvailabilityService } from '@/services/teamAvailabilityService';
import HourlyCalendarView from '@/components/schedule/HourlyCalendarView';
import { getEventTypes, getEventType } from '@/services/eventTypeService';
import { EventType } from '@/types/eventTasks';

// Define a unified event type
interface ScheduleEvent {
  id: number | string;
  date: Date;
  time: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  priority: 'high' | 'medium' | 'low' | 'urgent';
  unit?: string;
  building?: string;
  dueDate?: Date;
  isDroppedSuggestion: boolean;
  type: string;
  rescheduledCount: number;
  originalSuggestionId?: number;
}

const OperatorScheduleTab = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [showUniversalEventDetail, setShowUniversalEventDetail] = useState(false);
  const [showRescheduleFlow, setShowRescheduleFlow] = useState(false);
  const [selectedUniversalEvent, setSelectedUniversalEvent] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<EnhancedEvent | null>(null);

  // State for managing scheduled events including dropped suggestions
  const [scheduledEvents, setScheduledEvents] = useState<ScheduleEvent[]>([
    {
      id: 1,
      date: new Date(),
      time: '09:00',
      title: 'Move-In Process',
      description: 'Unit 1A - Sarah Johnson',
      category: 'Resident Services',
      priority: 'high',
      unit: '1A',
      building: 'Building A',
      isDroppedSuggestion: false,
      type: 'move-in',
      rescheduledCount: 0
    },
    {
      id: 2,
      date: new Date(),
      time: '10:30',
      title: 'Lease Signing',
      description: 'Unit 2C - Mike Chen renewal',
      category: 'Leasing',
      priority: 'medium',
      isDroppedSuggestion: false,
      type: 'lease-signing',
      rescheduledCount: 0
    },
    {
      id: 3,
      date: addDays(new Date(), 1),
      time: '14:00',
      title: 'Property Tour',
      description: 'Prospect: Emily Davis',
      category: 'Leasing',
      priority: 'medium',
      unit: '3B',
      building: 'Building A',
      isDroppedSuggestion: false,
      type: 'tour',
      rescheduledCount: 0
    },
    {
      id: 4,
      date: addDays(new Date(), 2),
      time: '11:00',
      title: 'Work Order',
      description: 'Kitchen faucet repair - Unit 4D',
      category: 'Maintenance',
      priority: 'urgent',
      unit: '4D',
      building: 'Building C',
      isDroppedSuggestion: false,
      type: 'work-order',
      rescheduledCount: 0
    }
  ]);

  // State to track which suggestions have been scheduled and completed
  const [scheduledSuggestionIds, setScheduledSuggestionIds] = useState<number[]>([]);
  const [completedSuggestionIds, setCompletedSuggestionIds] = useState<number[]>([]);

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
    
    // Handle 24-hour format (HH:mm)
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTimeFromMinutes = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

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

  const findAvailableTimeSlot = (date: Date, duration: number = 60): string => {
    const eventsForDate = scheduledEvents
      .filter(event => isSameDateSafe(event.date, date))
      .map(event => ({
        start: convertTimeToMinutes(event.time),
        end: convertTimeToMinutes(event.time) + 60 // Assume 1 hour duration
      }))
      .sort((a, b) => a.start - b.start);

    let proposedStart = 0; // Start from midnight (00:00)
    
    for (const event of eventsForDate) {
      if (proposedStart + duration <= event.start) {
        break;
      }
      proposedStart = Math.max(proposedStart, event.end);
    }
    
    // If we go past 11:30 PM (1410 minutes), wrap around or place at end
    if (proposedStart + duration > 1410) {
      proposedStart = 1410 - duration;
    }
    
    return formatTimeFromMinutes(proposedStart);
  };

  // Helper function to ensure priority is valid
  const normalizePriority = (priority: any): 'high' | 'medium' | 'low' | 'urgent' => {
    if (['high', 'medium', 'low', 'urgent'].includes(priority)) {
      return priority as 'high' | 'medium' | 'low' | 'urgent';
    }
    return 'medium'; // Default fallback
  };

  const handleDropSuggestionInTimeline = (suggestion: any, targetTime?: string) => {
    console.log('OperatorScheduleTab: handleDropSuggestionInTimeline called with:', suggestion, targetTime);
    
    let assignedTime: string;
    
    if (targetTime) {
      assignedTime = targetTime;
    } else {
      assignedTime = findAvailableTimeSlot(selectedDate);
    }

    const isDuplicate = scheduledEvents.some(event => 
      isSameDateSafe(event.date, selectedDate) && 
      event.time === assignedTime && 
      event.title === suggestion.title
    );

    if (isDuplicate) {
      toast({
        title: "Event Already Exists",
        description: `${suggestion.title} is already scheduled at ${assignedTime}`,
        variant: "destructive"
      });
      return;
    }

    // Create event with proper structure to match existing events
    const newEvent: ScheduleEvent = {
      id: Date.now() + Math.random(),
      date: new Date(selectedDate),
      time: assignedTime,
      title: suggestion.title || '',
      description: suggestion.description || '',
      category: suggestion.suggestionType || suggestion.type || 'General',
      priority: normalizePriority(suggestion.priority),
      isDroppedSuggestion: true,
      type: (suggestion.suggestionType || suggestion.type || 'general').toLowerCase(),
      rescheduledCount: 0,
      unit: suggestion.unit || undefined,
      building: suggestion.building || undefined,
      dueDate: suggestion.dueDate || undefined,
      image: suggestion.image || undefined,
      originalSuggestionId: suggestion.id
    };

    console.log('OperatorScheduleTab: Adding new event from timeline drop:', newEvent);
    
    setScheduledEvents(prev => [...prev, newEvent]);
    
    // Mark suggestion as scheduled (but not completed yet)
    setScheduledSuggestionIds(prev => {
      const updated = [...prev, suggestion.id];
      console.log('OperatorScheduleTab: Updated scheduled suggestion IDs:', updated);
      return updated;
    });

    toast({
      title: "Task Scheduled!",
      description: `${suggestion.title} scheduled at ${assignedTime} on ${format(selectedDate, 'MMM d, yyyy')}`,
    });
  };

  const handleDropSuggestion = (suggestion: any, date: Date) => {
    console.log('OperatorScheduleTab: handleDropSuggestion called with:', suggestion, date);
    
    const assignedTime = findAvailableTimeSlot(date);
    
    const isDuplicate = scheduledEvents.some(event => 
      isSameDateSafe(event.date, date) && 
      event.time === assignedTime && 
      event.title === suggestion.title
    );

    if (isDuplicate) {
      toast({
        title: "Event Already Exists",
        description: `${suggestion.title} is already scheduled at ${assignedTime}`,
        variant: "destructive"
      });
      return;
    }
    
    // Create event with proper structure to match existing events
    const newEvent: ScheduleEvent = {
      id: Date.now() + Math.random(),
      date: new Date(date),
      time: assignedTime,
      title: suggestion.title || '',
      description: suggestion.description || '',
      category: suggestion.suggestionType || suggestion.type || 'General',
      priority: normalizePriority(suggestion.priority),
      isDroppedSuggestion: true,
      type: (suggestion.suggestionType || suggestion.type || 'general').toLowerCase(),
      rescheduledCount: 0,
      unit: suggestion.unit || undefined,
      building: suggestion.building || undefined,
      dueDate: suggestion.dueDate || undefined,
      image: suggestion.image || undefined,
      originalSuggestionId: suggestion.id
    };

    console.log('OperatorScheduleTab: Adding calendar drop event:', newEvent);

    setScheduledEvents(prev => [...prev, newEvent]);
    
    // Mark suggestion as scheduled (but not completed yet)
    setScheduledSuggestionIds(prev => {
      const updated = [...prev, suggestion.id];
      console.log('OperatorScheduleTab: Updated scheduled suggestion IDs from calendar:', updated);
      return updated;
    });

    toast({
      title: "Task Scheduled!",
      description: `${suggestion.title} scheduled for ${format(date, 'MMM d, yyyy')}`,
    });
  };

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const handleEventClick = (event: any) => {
    setSelectedUniversalEvent(event);
    setShowUniversalEventDetail(true);
  };

  const handleEventHold = (event: any) => {
    const enhancedEvent: EnhancedEvent = {
      id: event.id,
      date: event.date,
      time: event.time,
      title: event.title,
      description: event.description,
      category: event.category,
      priority: event.priority,
      canReschedule: true,
      canCancel: true,
      estimatedDuration: 60,
      rescheduledCount: event.rescheduledCount || 0,
      assignedTeamMember: teamAvailabilityService.assignTeamMember({ category: event.category }),
      residentName: 'John Doe',
      phone: '(555) 123-4567',
      unit: event.unit,
      building: event.building
    };
    
    setSelectedEvent(enhancedEvent);
    setShowRescheduleFlow(true);
  };

  const handleRescheduleConfirm = () => {
    toast({
      title: "Event Rescheduled",
      description: `${selectedEvent?.title} has been rescheduled successfully.`,
    });
    setShowRescheduleFlow(false);
    setSelectedEvent(null);
  };

  const handleEventReschedule = (event: any, newTime: string) => {
    const updatedEvents = scheduledEvents.map(e => 
      e.id === event.id 
        ? { ...e, time: newTime, rescheduledCount: (e.rescheduledCount || 0) + 1 }
        : e
    );
    
    setScheduledEvents(updatedEvents);
    
    toast({
      title: "Event Rescheduled",
      description: `${event.title} moved to ${newTime}`,
    });
  };

  const handleEventUpdate = (updatedEvent: any) => {
    const updatedEvents = scheduledEvents.map(e => 
      e.id === updatedEvent.id ? updatedEvent : e
    );
    setScheduledEvents(updatedEvents);

    // If the event was marked as completed and it was from a suggestion, mark the suggestion as completed
    if (updatedEvent.status === 'completed' && updatedEvent.originalSuggestionId) {
      setCompletedSuggestionIds(prev => {
        if (!prev.includes(updatedEvent.originalSuggestionId)) {
          return [...prev, updatedEvent.originalSuggestionId];
        }
        return prev;
      });
      
      toast({
        title: "Task Completed!",
        description: `${updatedEvent.title} has been marked as completed and removed from pending tasks.`,
      });
    }
  };

  const handleEventTypeSelect = (eventType: string) => {
    const selectedType = getEventType(eventType);
    setSelectedEventType(selectedType || null);
    setShowScheduleMenu(false);
    setShowCreateFlow(true);
  };

  const handleEventCreated = (newEvent: any) => {
    console.log('New event created:', newEvent);
    // Add the new event to the events list
    const scheduledEvent: ScheduleEvent = {
      id: newEvent.id,
      date: newEvent.date,
      time: newEvent.time,
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type,
      priority: newEvent.priority,
      category: newEvent.category,
      building: newEvent.metadata?.building,
      unit: newEvent.metadata?.unit,
      isDroppedSuggestion: false,
      rescheduledCount: 0
    };
    setScheduledEvents(prev => [...prev, scheduledEvent]);
    setShowCreateFlow(false);
    setSelectedEventType(null);
  };

  const getEventsForDate = (date: Date) => {
    const eventsForDate = scheduledEvents.filter(event => isSameDateSafe(event.date, date))
      .sort((a, b) => {
        const timeA = convertTimeToMinutes(a.time);
        const timeB = convertTimeToMinutes(b.time);
        return timeA - timeB;
      });
    
    console.log(`Events for ${format(date, 'MMM d')}:`, eventsForDate);
    return eventsForDate;
  };

  const hasEventsOnDate = (date: Date) => {
    return scheduledEvents.some(event => isSameDateSafe(event.date, date));
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
        userRole="operator"
      />
    );
  }

  if (showUniversalEventDetail && selectedUniversalEvent) {
    return (
      <UniversalEventDetailModal
        event={selectedUniversalEvent}
        onClose={() => {
          setShowUniversalEventDetail(false);
          setSelectedUniversalEvent(null);
        }}
        userRole="operator"
        onEventUpdate={handleEventUpdate}
      />
    );
  }

  if (showCreateFlow && selectedEventType) {
    return (
      <UniversalEventCreationFlow
        eventType={selectedEventType}
        onClose={() => {
          setShowCreateFlow(false);
          setSelectedEventType(null);
        }}
        onEventCreated={handleEventCreated}
      />
    );
  }

  if (showScheduleMenu) {
    return (
      <OperatorScheduleMenu
        onSelectType={handleEventTypeSelect}
        onClose={() => setShowScheduleMenu(false)}
      />
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-center sm:justify-start text-left font-normal shadow-sm w-12 sm:w-[240px]"
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline sm:ml-2">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <DroppableCalendar
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                hasEventsOnDate={hasEventsOnDate}
                onDropSuggestion={handleDropSuggestion}
                events={scheduledEvents}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <button 
          onClick={() => setShowScheduleMenu(true)}
          className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all duration-200 hover:scale-110 z-50"
        >
          <Plus className="text-white" size={28} />
        </button>

        <div className="mb-3">
          <DraggableSuggestionsSection 
            selectedDate={selectedDate}
            onSchedule={() => setShowScheduleMenu(true)}
            onAction={handleAction}
            scheduledSuggestionIds={scheduledSuggestionIds}
            completedSuggestionIds={completedSuggestionIds}
          />
        </div>
      </div>

      <div className="px-4">
        <HourlyCalendarView
          selectedDate={selectedDate}
          events={getEventsForDate(selectedDate)}
          onDropSuggestion={handleDropSuggestionInTimeline}
          onEventClick={handleEventClick}
          onEventHold={handleEventHold}
          onEventReschedule={handleEventReschedule}
        />
      </div>
    </div>
  );
};

export default OperatorScheduleTab;
