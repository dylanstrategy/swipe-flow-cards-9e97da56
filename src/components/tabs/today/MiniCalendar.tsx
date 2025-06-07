
import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  getEventsForDate: (date: Date) => any[];
}

const MiniCalendar = ({ selectedDate, onDateSelect, getEventsForDate }: MiniCalendarProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Week header */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {day}
            </span>
          </div>
        ))}
      </div>
      
      {/* Week dates */}
      <div className="grid grid-cols-7 gap-2">
        {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
          const date = addDays(new Date(), offset);
          const isSelected = isSameDay(date, selectedDate);
          const hasEvents = getEventsForDate(date).length > 0;
          const isToday = isSameDay(date, new Date());
          
          return (
            <div key={offset} className="flex flex-col items-center">
              <button
                onClick={() => onDateSelect(date)}
                className={`
                  relative w-14 h-14 rounded-xl flex flex-col items-center justify-center text-lg font-medium transition-all duration-200 group
                  ${isSelected 
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : isToday
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100'
                      : hasEvents 
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105' 
                        : 'text-gray-600 hover:bg-gray-50 hover:scale-105'
                  }
                `}
              >
                <span className={`text-lg ${isSelected ? 'font-bold' : 'font-medium'}`}>
                  {format(date, 'd')}
                </span>
                {hasEvents && (
                  <div className={`
                    w-1.5 h-1.5 rounded-full mt-0.5
                    ${isSelected ? 'bg-white/80' : 'bg-blue-600'}
                  `} />
                )}
              </button>
              
              {/* Day label below date */}
              <span className={`
                text-xs mt-2 font-medium
                ${isSelected 
                  ? 'text-blue-600' 
                  : isToday 
                    ? 'text-blue-500'
                    : 'text-gray-400'
                }
              `}>
                {isToday ? 'Today' : format(date, 'EEE')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
