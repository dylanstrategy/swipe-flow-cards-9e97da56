
import React from 'react';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import SwipeCard from '../../SwipeCard';

interface Event {
  id: number;
  date: Date;
  time: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  priority: string;
  dueDate?: Date;
}

interface EventsListProps {
  events: Event[];
  onAction: (action: string, item: string) => void;
  onQuickReply: (subject: string, recipientType: 'management' | 'maintenance' | 'leasing') => void;
  getSwipeActionsForEvent: (event: any) => any;
}

const EventsList = ({ events, onAction, onQuickReply, getSwipeActionsForEvent }: EventsListProps) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getUrgencyClass = (event: Event) => {
    if (!event.dueDate) return '';
    
    const daysUntilDue = differenceInDays(event.dueDate, new Date());
    const isOverdue = isPast(event.dueDate) && !isToday(event.dueDate);
    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
    
    if (isOverdue) {
      return 'wiggle-urgent pulse-urgent';
    } else if (isDueSoon && event.priority === 'high') {
      return 'wiggle-urgent';
    }
    
    return '';
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No events scheduled for this date</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const swipeActions = getSwipeActionsForEvent(event);
        const urgencyClass = getUrgencyClass(event);
        return (
          <div key={event.id} className="flex items-start gap-4">
            <div className="text-sm font-medium text-gray-600 w-20 flex-shrink-0 pt-4">
              {formatTime(event.time)}
            </div>
            <div className="flex-1">
              <SwipeCard
                onSwipeRight={swipeActions.onSwipeRight}
                onSwipeLeft={swipeActions.onSwipeLeft}
                onTap={() => onAction("Viewed details", event.title)}
                className={urgencyClass}
                enableSwipeUp={false}
              >
                <div className={cn(
                  "bg-blue-50 rounded-lg p-4",
                  urgencyClass && "border-2 border-red-200"
                )}>
                  <div className="flex items-start gap-3">
                    {event.image ? (
                      <div 
                        className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${event.image})` }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {event.category === 'Management' ? '✉️' : 
                         event.category === 'Community Event' ? '🎉' : 
                         event.category === 'Work Order' ? '🔧' :
                         event.category === 'Lease' ? '📋' :
                         event.category === 'Point of Sale' ? '🏪' : '📢'}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                      {urgencyClass && (
                        <p className="text-red-600 text-xs mt-1 font-medium">
                          {isPast(event.dueDate || new Date()) ? 'OVERDUE!' : 'DUE SOON!'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </SwipeCard>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;
