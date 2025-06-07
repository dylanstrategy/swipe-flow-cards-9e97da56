
import React from 'react';
import { format, isSameDay } from 'date-fns';

interface TodayMiniCalendarProps {
  selectedDate: Date;
  getEventsForDate: (date: Date) => any[];
}

const TodayMiniCalendar = ({ selectedDate, getEventsForDate }: TodayMiniCalendarProps) => {
  const today = new Date();
  const todayEvents = getEventsForDate(today);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Today</h3>
        <div className="text-3xl font-bold text-blue-600 mb-1">
          {format(today, 'd')}
        </div>
        <div className="text-sm text-gray-600 mb-4">
          {format(today, 'EEEE, MMMM yyyy')}
        </div>
        
        {todayEvents.length > 0 && (
          <div className="flex justify-center">
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {todayEvents.length} {todayEvents.length === 1 ? 'event' : 'events'} today
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayMiniCalendar;
