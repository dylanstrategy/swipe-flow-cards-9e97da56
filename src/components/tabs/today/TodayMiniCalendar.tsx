
import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import HourlyCalendarView from '../../schedule/HourlyCalendarView';

interface TodayMiniCalendarProps {
  selectedDate: Date;
  getEventsForDate: (date: Date) => any[];
  onDropSuggestion: (suggestion: any, targetTime?: string) => void;
  onDateSelect: (date: Date) => void;
  onEventReschedule: (event: any, newTime: string) => void;
  onEventClick: (event: any) => void;
}

const TodayMiniCalendar = ({ 
  selectedDate, 
  getEventsForDate, 
  onDropSuggestion, 
  onDateSelect, 
  onEventReschedule,
  onEventClick
}: TodayMiniCalendarProps) => {
  const todayEvents = getEventsForDate(selectedDate);

  const handleEventClick = (event: any) => {
    console.log('TodayMiniCalendar: Event clicked:', event);
    onEventClick(event);
  };

  const handleEventHold = (event: any) => {
    console.log('TodayMiniCalendar: Event held:', event);
    // Could show context menu or options
  };

  const handleDropSuggestion = (suggestion: any, targetTime?: string) => {
    console.log('TodayMiniCalendar: Drop suggestion called with:', suggestion, targetTime);
    onDropSuggestion(suggestion, targetTime);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {format(selectedDate, 'EEEE, MMMM d')}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {todayEvents.length} {todayEvents.length === 1 ? 'event' : 'events'} scheduled
        </p>
      </div>
      
      <div className="h-96">
        <HourlyCalendarView
          selectedDate={selectedDate}
          events={todayEvents}
          onDropSuggestion={handleDropSuggestion}
          onEventClick={handleEventClick}
          onEventHold={handleEventHold}
          onEventReschedule={onEventReschedule}
        />
      </div>
    </div>
  );
};

export default TodayMiniCalendar;
