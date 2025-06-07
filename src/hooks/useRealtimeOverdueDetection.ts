
import { useState, useEffect, useCallback } from 'react';
import { isPast, isToday, format } from 'date-fns';

interface OverdueEvent {
  id: string | number;
  date: Date;
  time?: string;
  status?: string;
}

export const useRealtimeOverdueDetection = (events: OverdueEvent[], refreshInterval = 60000) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time at specified interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const isEventOverdue = useCallback((event: OverdueEvent): boolean => {
    // Only check if event is not completed
    if (event.status === 'completed') return false;
    
    const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
    const now = currentTime;
    
    // If event date is in the past, it's overdue
    if (isPast(eventDate) && !isToday(eventDate)) {
      return true;
    }
    
    // If event is today but the time has passed, it's overdue
    if (isToday(eventDate) && event.time) {
      try {
        const [hours, minutes] = event.time.split(':').map(Number);
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(hours, minutes || 0, 0, 0);
        
        return isPast(eventDateTime);
      } catch (error) {
        console.warn('Error parsing event time:', event.time, error);
        return false;
      }
    }
    
    return false;
  }, [currentTime]);

  const getOverdueEvents = useCallback(() => {
    return events.filter(isEventOverdue);
  }, [events, isEventOverdue]);

  return {
    currentTime,
    isEventOverdue,
    getOverdueEvents
  };
};
