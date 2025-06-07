
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format, isSameDay } from 'date-fns';

interface DroppableCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  hasEventsOnDate: (date: Date) => boolean;
  onDropSuggestion?: (suggestion: any, date: Date) => void;
}

const DroppableCalendar = ({ selectedDate, onSelect, hasEventsOnDate, onDropSuggestion }: DroppableCalendarProps) => {
  const { toast } = useToast();
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    setDragOverDate(null);
    
    try {
      const suggestionData = JSON.parse(e.dataTransfer.getData('application/json'));
      onDropSuggestion?.(suggestionData, date);
      
      toast({
        title: "Suggestion Scheduled!",
        description: `${suggestionData.title} has been scheduled for ${format(date, 'MMM d, yyyy')}`,
      });
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
        <p className="text-sm text-gray-600">Select a date to view events and suggestions</p>
      </div>
      <div className="relative">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelect(date)}
          className={cn("p-4 pointer-events-auto")}
          classNames={{
            day_today: "bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg",
            day_selected: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg",
            day: cn(
              "hover:bg-blue-50 transition-all duration-200 relative",
              "drop-zone"
            ),
          }}
          modifiers={{
            hasEvents: (date) => hasEventsOnDate(date),
            dragOver: (date) => dragOverDate && isSameDay(date, dragOverDate)
          }}
          modifiersClassNames={{
            hasEvents: "after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-orange-500 after:rounded-full after:shadow-sm",
            dragOver: "bg-green-100 border-2 border-green-400 border-dashed scale-105"
          }}
          components={{
            Day: ({ date, ...props }) => {
              return (
                <div
                  onDragOver={(e) => handleDragOver(e, date)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, date)}
                  className="w-full h-full flex items-center justify-center"
                >
                  <button {...props} className={props.className}>
                    {format(date, 'd')}
                  </button>
                </div>
              );
            }
          }}
        />
      </div>
    </div>
  );
};

export default DroppableCalendar;
