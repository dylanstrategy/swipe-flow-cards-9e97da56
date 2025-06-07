
import React from 'react';
import SwipeCard from '../SwipeCard';
import { format, isSameDay, isToday } from 'date-fns';

interface ScheduledItemsTimelineProps {
  selectedDate: Date;
  onAction: (action: string, item: string) => void;
  onEventClick?: (event: any) => void;
  events?: any[];
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

const ScheduledItemsTimeline = ({ selectedDate, onAction, onEventClick, events = [] }: ScheduledItemsTimelineProps) => {
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{getDateDisplayText()}</h2>
      
      {allItemsForDate.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-4">
            <span className="text-4xl">📅</span>
          </div>
          <p className="text-lg font-medium mb-2">No events scheduled</p>
          <p className="text-sm">This looks like a free day! Perfect time to schedule something new.</p>
        </div>
      ) : (
        allItemsForDate.map((item) => (
          <div key={item.id} className="flex items-start text-sm text-gray-500">
            <span className="mr-4 mt-2 font-medium min-w-[60px]">{item.time}</span>
            <SwipeCard
              onSwipeRight={item.actions.right}
              onSwipeLeft={item.actions.left}
              onTap={() => {
                if (item.isEvent && item.originalEvent) {
                  onEventClick?.(item.originalEvent);
                } else {
                  onAction("Viewed", item.title);
                }
              }}
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
                    <p className="text-xs text-blue-600 mt-1">Tap to view details</p>
                  )}
                </div>
              </div>
            </SwipeCard>
          </div>
        ))
      )}
    </div>
  );
};

export default ScheduledItemsTimeline;
