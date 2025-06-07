import React, { useState } from 'react';
import SwipeCard from '../SwipeCard';
import { format, isSameDay, isToday } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ScheduledItemsTimelineProps {
  selectedDate: Date;
  onAction: (action: string, item: string) => void;
  onEventClick?: (event: any) => void;
  onEventHold?: (event: any) => void;
  events?: any[];
  onDropSuggestion?: (suggestion: any, targetTime?: string) => void;
}

interface BaseItem {
  id: string | number;
  date: Date;
  time: string;
  title: string;
  description: string;
  icon: string;
  actions: {
    right: { label: string; action: () => void; color: string; icon: string };
    left: { label: string; action: () => void; color: string; icon: string };
  };
}

interface MockItem extends BaseItem {
  isEvent?: false;
}

interface EventItem extends BaseItem {
  isEvent: true;
  originalEvent: any;
}

type CombinedItem = MockItem | EventItem;

const ScheduledItemsTimeline = ({ 
  selectedDate, 
  onAction, 
  onEventClick, 
  onEventHold,
  events = [], 
  onDropSuggestion 
}: ScheduledItemsTimelineProps) => {
  const { toast } = useToast();
  const [dragOverTime, setDragOverTime] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'before' | 'after' | null>(null);

  // Mock items that would be scheduled (this would come from props or API in real app)
  const mockItems: MockItem[] = [
    {
      id: 1,
      date: new Date(),
      time: '9:00 AM',
      title: 'Work Order',
      description: 'Broken outlet repair',
      icon: '🔌',
      actions: {
        right: { label: "Reschedule", action: () => onAction("Rescheduled", "Work Order"), color: "#F59E0B", icon: "📅" },
        left: { label: "Cancel", action: () => onAction("Cancelled", "Work Order"), color: "#EF4444", icon: "❌" }
      }
    },
    {
      id: 2,
      date: new Date(),
      time: '2:00 PM',
      title: 'Rent Payment',
      description: '$1,550 due',
      icon: '💳',
      actions: {
        right: { label: "Pay Now", action: () => onAction("Paid", "Rent Payment"), color: "#10B981", icon: "💳" },
        left: { label: "Remind Me", action: () => onAction("Reminded", "Rent Payment"), color: "#F59E0B", icon: "⏰" }
      }
    }
  ];

  // Filter items for the selected date
  const itemsForDate = mockItems.filter(item => isSameDay(item.date, selectedDate));
  
  // Combine with events if provided
  const eventItems: EventItem[] = events.map(event => ({
    id: `event-${event.id}`,
    date: event.date,
    time: event.time.includes(':') ? 
      (() => {
        const [hours, minutes] = event.time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      })() : event.time,
    title: event.title,
    description: event.description,
    icon: getEventIcon(event.category),
    isEvent: true as const,
    originalEvent: event,
    actions: {
      right: { label: "View Details", action: () => onEventClick?.(event), color: "#3B82F6", icon: "👁️" },
      left: { label: "Reschedule", action: () => onEventClick?.(event), color: "#F59E0B", icon: "📅" }
    }
  }));

  const allItemsForDate: CombinedItem[] = [...itemsForDate, ...eventItems].sort((a, b) => {
    const timeA = convertTimeToMinutes(a.time);
    const timeB = convertTimeToMinutes(b.time);
    return timeA - timeB;
  });

  const handleDragOver = (e: React.DragEvent, time: string, position: 'before' | 'after') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTime(time);
    setDragOverPosition(position);
  };

  const handleDragLeave = () => {
    setDragOverTime(null);
    setDragOverPosition(null);
  };

  const handleDrop = (e: React.DragEvent, targetTime?: string) => {
    e.preventDefault();
    setDragOverTime(null);
    setDragOverPosition(null);
    
    try {
      const suggestionData = JSON.parse(e.dataTransfer.getData('application/json'));
      onDropSuggestion?.(suggestionData, targetTime);
      
      toast({
        title: "Suggestion Scheduled!",
        description: `${suggestionData.title} has been added to your schedule`,
      });
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const handleItemTap = (item: CombinedItem) => {
    if (item.isEvent && item.originalEvent) {
      onEventClick?.(item.originalEvent);
    } else {
      onAction("Viewed", item.title);
    }
  };

  const handleItemHold = (item: CombinedItem) => {
    if (item.isEvent && item.originalEvent) {
      onEventHold?.(item.originalEvent);
    } else {
      // For non-event items, show reschedule toast
      toast({
        title: "Reschedule Item",
        description: `Hold to reschedule ${item.title}`,
      });
    }
  };

  function getEventIcon(category: string): string {
    switch (category?.toLowerCase()) {
      case 'work order': return '🔧';
      case 'management': return '📋';
      case 'lease': return '📄';
      case 'community event': return '🎉';
      case 'payment': return '💳';
      default: return '📅';
    }
  }

  function convertTimeToMinutes(timeString: string): number {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = (hours % 12) * 60 + minutes;
    if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
    if (period === 'AM' && hours === 12) totalMinutes = minutes;
    return totalMinutes;
  }

  const getDateDisplayText = () => {
    if (isToday(selectedDate)) {
      return "Today's Schedule";
    }
    return `Scheduled for ${format(selectedDate, 'EEEE, MMM d')}`;
  };

  const renderDropZone = (time: string, position: 'before' | 'after') => {
    const isActive = dragOverTime === time && dragOverPosition === position;
    
    return (
      <div
        onDragOver={(e) => handleDragOver(e, time, position)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, time)}
        className={`h-2 transition-all duration-200 ${
          isActive 
            ? 'bg-blue-200 border-2 border-dashed border-blue-400 rounded-md mx-4' 
            : 'h-1'
        }`}
      />
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{getDateDisplayText()}</h2>
      
      {allItemsForDate.length === 0 ? (
        <div 
          className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(e) => handleDrop(e)}
        >
          <div className="mb-4">
            <span className="text-4xl">📅</span>
          </div>
          <p className="text-lg font-medium mb-2">No events scheduled</p>
          <p className="text-sm">Drop suggestions here to schedule them!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {allItemsForDate.map((item, index) => (
            <div key={item.id}>
              {index === 0 && renderDropZone(item.time, 'before')}
              
              <div className="flex items-start text-sm text-gray-500">
                <span className="mr-4 mt-2 font-medium min-w-[60px]">{item.time}</span>
                <SwipeCard
                  onSwipeRight={item.actions.right}
                  onSwipeLeft={item.actions.left}
                  onTap={() => handleItemTap(item)}
                  onHold={() => handleItemHold(item)}
                  holdDuration={800}
                  className="flex-1"
                >
                  <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      {item.isEvent && (
                        <p className="text-xs text-blue-600 mt-1">Tap for details • Hold to reschedule</p>
                      )}
                    </div>
                  </div>
                </SwipeCard>
              </div>
              
              {renderDropZone(item.time, 'after')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledItemsTimeline;
