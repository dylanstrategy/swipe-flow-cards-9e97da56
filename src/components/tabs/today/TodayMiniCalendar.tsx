
import React from 'react';
import { format } from 'date-fns';
import HourlyCalendarView from '@/components/schedule/HourlyCalendarView';

interface TodayMiniCalendarProps {
  selectedDate: Date;
  getEventsForDate: (date: Date) => any[];
  onDropSuggestion?: (suggestion: any, date: Date) => void;
  onDateSelect?: (date: Date) => void;
  onEventReschedule?: (event: any, newTime: string) => void;
}

const TodayMiniCalendar = ({ 
  selectedDate, 
  getEventsForDate, 
  onDropSuggestion,
  onDateSelect,
  onEventReschedule 
}: TodayMiniCalendarProps) => {
  const todayEvents = getEventsForDate(selectedDate);

  const handleDropSuggestionWithTime = (suggestion: any, targetTime?: string) => {
    // When dropping a suggestion with a specific time, we still call the original handler
    // but we can pass the date (selectedDate) since this is the Today tab
    if (onDropSuggestion) {
      onDropSuggestion(suggestion, selectedDate);
    }
  };

  const handleEventClick = (event: any) => {
    // Handle event clicks if needed
    console.log('Event clicked:', event);
  };

  const handleEventHold = (event: any) => {
    // Handle event hold for options
    console.log('Event held:', event);
  };

  const handleEventReschedule = (event: any, newTime: string) => {
    // Pass the reschedule request up to TodayTab
    console.log('Event rescheduled in TodayMiniCalendar:', event, 'to', newTime);
    if (onEventReschedule) {
      onEventReschedule(event, newTime);
    }
  };

  return (
    <div className="mb-6">
      {/* Today Section - Keep existing styling */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-blue-600 mb-2">
          {format(selectedDate, 'd')}
        </h2>
        <p className="text-lg text-gray-900 font-medium">
          {format(selectedDate, 'EEEE, MMMM yyyy')}
        </p>
        <p className="text-blue-600 text-sm font-medium">
          {todayEvents.length} events today
        </p>
      </div>

      {/* Hourly Calendar View for Today */}
      <HourlyCalendarView
        selectedDate={selectedDate}
        events={todayEvents}
        onDropSuggestion={handleDropSuggestionWithTime}
        onEventClick={handleEventClick}
        onEventHold={handleEventHold}
        onEventReschedule={handleEventReschedule}
      />
    </div>
  );
};

export default TodayMiniCalendar;
