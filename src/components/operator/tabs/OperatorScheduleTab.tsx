
import React, { useState } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import HourlyCalendarView from '@/components/schedule/HourlyCalendarView';
import DraggableSuggestionsSection from '@/components/schedule/DraggableSuggestionsSection';
import MiniCalendar from '@/components/tabs/today/MiniCalendar';
import UniversalEventDetailModal from '@/components/events/UniversalEventDetailModal';

const OperatorScheduleTab = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showUniversalEventDetail, setShowUniversalEventDetail] = useState(false);
  const [selectedUniversalEvent, setSelectedUniversalEvent] = useState<any>(null);
  const [scheduledSuggestionIds, setScheduledSuggestionIds] = useState<number[]>([]);

  // Enhanced calendar events - as state
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 1,
      date: new Date(),
      time: '09:00',
      title: 'Move-In Inspection',
      description: 'Unit 4B - Sarah Johnson',
      category: 'Move-In',
      priority: 'high',
      unit: '4B',
      building: 'Building A',
      type: 'move-in',
      status: 'scheduled',
      residentName: 'Sarah Johnson',
      phone: '(555) 123-4567'
    },
    {
      id: 2,
      date: new Date(),
      time: '10:30',
      title: 'Lease Signing',
      description: 'Unit 2C - Mike Chen renewal',
      category: 'Lease',
      priority: 'medium',
      unit: '2C',
      building: 'Building A',
      type: 'lease',
      status: 'confirmed',
      residentName: 'Mike Chen',
      phone: '(555) 234-5678'
    },
    {
      id: 3,
      date: addDays(new Date(), 1),
      time: '14:00',
      title: 'Tour Scheduled',
      description: 'Studio unit - Alex Rodriguez',
      category: 'Tour',
      priority: 'normal',
      type: 'tour',
      status: 'confirmed',
      residentName: 'Alex Rodriguez',
      phone: '(555) 456-7890'
    },
    {
      id: 4,
      date: addDays(new Date(), 2),
      time: '11:00',
      title: 'Move-Out Inspection',
      description: 'Unit 1A - Final walkthrough',
      category: 'Move-Out',
      priority: 'medium',
      unit: '1A',
      building: 'Building A',
      type: 'move-out',
      status: 'scheduled',
      residentName: 'Robert Wilson',
      phone: '(555) 567-8901'
    }
  ]);

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => isSameDay(event.date, date))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleDropSuggestion = (suggestion: any, targetTime?: string) => {
    const newEvent = {
      id: Date.now(), // Generate unique ID
      date: selectedDate,
      time: targetTime || '09:00',
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.suggestionType || suggestion.type,
      priority: suggestion.priority,
      type: suggestion.suggestionType?.toLowerCase() || 'task',
      status: 'scheduled'
    };

    setCalendarEvents(prevEvents => [...prevEvents, newEvent]);
    setScheduledSuggestionIds(prev => [...prev, suggestion.id]);

    toast({
      title: "Suggestion Scheduled!",
      description: `${suggestion.title} scheduled for ${format(selectedDate, 'MMM d')} at ${targetTime ? formatTime(targetTime) : '9:00 AM'}`,
    });
  };

  const handleEventClick = (event: any) => {
    setSelectedUniversalEvent(event);
    setShowUniversalEventDetail(true);
  };

  const handleEventHold = (event: any) => {
    console.log('Event held:', event);
  };

  const handleEventReschedule = (event: any, newTime: string) => {
    console.log('Handling event reschedule in OperatorScheduleTab:', event, 'to', newTime);
    
    setCalendarEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === event.id ? { ...e, time: newTime } : e
      )
    );

    toast({
      title: "Event Rescheduled",
      description: `${event.title} moved to ${formatTime(newTime)}`,
    });
  };

  const handleSchedule = (type: string) => {
    toast({
      title: "Scheduling",
      description: `Opening ${type} scheduling flow...`,
    });
  };

  const handleAction = (action: string, item: string) => {
    toast({
      title: action,
      description: `${action} for ${item}`,
    });
  };

  const handleEventUpdate = (updatedEvent: any) => {
    setCalendarEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === updatedEvent.id ? updatedEvent : e
      )
    );
    
    toast({
      title: "Event Updated",
      description: `${updatedEvent.title} has been updated successfully.`,
    });
  };

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

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule</h1>
        <p className="text-gray-600">Manage events and tasks</p>
      </div>

      {/* Mini Calendar for Date Selection */}
      <MiniCalendar 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        getEventsForDate={getEventsForDate}
      />

      {/* Suggestions Section */}
      <DraggableSuggestionsSection
        selectedDate={selectedDate}
        onSchedule={handleSchedule}
        onAction={handleAction}
        scheduledSuggestionIds={scheduledSuggestionIds}
      />

      {/* Hourly Calendar View */}
      <div className="mb-6">
        <HourlyCalendarView
          selectedDate={selectedDate}
          events={selectedDateEvents}
          onDropSuggestion={handleDropSuggestion}
          onEventClick={handleEventClick}
          onEventHold={handleEventHold}
          onEventReschedule={handleEventReschedule}
        />
      </div>
    </div>
  );
};

export default OperatorScheduleTab;
