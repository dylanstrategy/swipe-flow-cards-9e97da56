
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { format, isSameDay } from 'date-fns';
import { useRealtimeOverdueDetection } from '@/hooks/useRealtimeOverdueDetection';

interface DroppableCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  hasEventsOnDate: (date: Date) => boolean;
  hasOverdueEventsOnDate?: (date: Date) => boolean;
  onDropSuggestion?: (suggestion: any, date: Date) => void;
  events?: any[]; // Add events prop for real-time overdue detection
}

const DroppableCalendar = ({ 
  selectedDate, 
  onSelect, 
  hasEventsOnDate, 
  hasOverdueEventsOnDate,
  onDropSuggestion,
  events = []
}: DroppableCalendarProps) => {
  const { toast } = useToast();
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);
  
  // Use real-time overdue detection
  const { isEventOverdue } = useRealtimeOverdueDetection(events);

  // Real-time overdue check for dates
  const hasRealtimeOverdueEventsOnDate = (date: Date): boolean => {
    const eventsForDate = events.filter(event => {
      try {
        const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
        return isSameDay(eventDate, date);
      } catch (error) {
        return false;
      }
    });
    
    return eventsForDate.some(event => isEventOverdue(event));
  };

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
          hasOverdueEvents: (date) => hasRealtimeOverdueEventsOnDate(date),
          dragOver: (date) => dragOverDate && isSameDay(date, dragOverDate)
        }}
        modifiersClassNames={{
          hasEvents: "after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-orange-500 after:rounded-full after:shadow-sm",
          hasOverdueEvents: "bg-red-100 border-red-300 wiggle-urgent after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-red-500 after:rounded-full after:shadow-sm",
          dragOver: "bg-green-100 border-2 border-green-400 border-dashed scale-105"
        }}
        components={{
          Day: ({ date, displayMonth }) => {
            const hasOverdue = hasRealtimeOverdueEventsOnDate(date);
            
            return (
              <div
                onDragOver={(e) => handleDragOver(e, date)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, date)}
                className="w-full h-full flex items-center justify-center"
              >
                <button 
                  onClick={() => onSelect(date)}
                  className={cn(
                    "h-10 w-10 rounded-lg font-medium transition-all duration-200",
                    "hover:bg-blue-50 hover:text-blue-900 hover:scale-105",
                    "focus:bg-blue-100 focus:text-blue-900",
                    isSameDay(date, selectedDate) && "bg-blue-600 text-white hover:bg-blue-700 shadow-lg scale-105",
                    isSameDay(date, new Date()) && !isSameDay(date, selectedDate) && "bg-blue-50 text-blue-900 font-bold border-2 border-blue-200",
                    hasEventsOnDate(date) && !hasOverdue && "after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-orange-500 after:rounded-full after:shadow-sm relative",
                    hasOverdue && "bg-red-100 border-red-300 wiggle-urgent after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-red-500 after:rounded-full after:shadow-sm relative",
                    dragOverDate && isSameDay(date, dragOverDate) && "bg-green-100 border-2 border-green-400 border-dashed scale-105"
                  )}
                >
                  {format(date, 'd')}
                </button>
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export default DroppableCalendar;
