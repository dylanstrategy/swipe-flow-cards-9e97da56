import React from 'react';
import { format } from 'date-fns';
import DroppableCalendar from '@/components/schedule/DroppableCalendar';

interface TodayMiniCalendarProps {
  selectedDate: Date;
  getEventsForDate: (date: Date) => any[];
  onDropSuggestion?: (suggestion: any, date: Date) => void;
  onDateSelect?: (date: Date) => void;
}

const TodayMiniCalendar = ({ 
  selectedDate, 
  getEventsForDate, 
  onDropSuggestion,
  onDateSelect 
}: TodayMiniCalendarProps) => {
  const todayEvents = getEventsForDate(selectedDate);

  const hasEventsOnDate = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  const handleDateSelect = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
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

      {/* Universal Droppable Calendar */}
      <DroppableCalendar
        selectedDate={selectedDate}
        onSelect={handleDateSelect}
        hasEventsOnDate={hasEventsOnDate}
        onDropSuggestion={onDropSuggestion}
        events={[]} // Pass events if needed for overdue detection
      />
    </div>
  );
};

export default TodayMiniCalendar;
