
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  getEventsForDate: (date: Date) => any[];
}

const MiniCalendar = ({ selectedDate, onDateSelect, getEventsForDate }: MiniCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = "";

  // Generate calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isTodayDate = isToday(day);
      const hasEvents = getEventsForDate(day).length > 0;

      const handleDayClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDateSelect(cloneDay);
      };

      days.push(
        <div
          key={day.toString()}
          className={`relative h-12 w-12 flex items-center justify-center cursor-pointer rounded-lg text-sm font-medium transition-all hover:scale-105 ${
            !isCurrentMonth 
              ? 'text-gray-300 hover:text-gray-400' 
              : isSelected 
                ? 'bg-blue-600 text-white shadow-md' 
                : isTodayDate
                  ? 'bg-blue-100 text-blue-700 font-bold border-2 border-blue-200'
                  : hasEvents 
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={handleDayClick}
        >
          <span className="relative z-10">{formattedDate}</span>
          {hasEvents && !isSelected && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevMonth}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-xs px-2 py-1 h-6"
          >
            Today
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {rows}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Has Events</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <div className="w-2 h-2 bg-blue-200 rounded-full border border-blue-300"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
