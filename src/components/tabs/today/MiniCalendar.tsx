
import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  getEventsForDate: (date: Date) => any[];
}

const MiniCalendar = ({ selectedDate, onDateSelect, getEventsForDate }: MiniCalendarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600 mb-4">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
          const date = addDays(new Date(), offset);
          const isSelected = isSameDay(date, selectedDate);
          const hasEvents = getEventsForDate(date).length > 0;
          return (
            <button
              key={offset}
              onClick={() => onDateSelect(date)}
              className={`h-12 w-12 rounded-full flex items-center justify-center text-lg transition-all ${
                isSelected 
                  ? 'bg-blue-600 text-white' 
                  : hasEvents 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
