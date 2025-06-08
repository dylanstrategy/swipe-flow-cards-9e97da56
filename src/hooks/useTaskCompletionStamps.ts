
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import type { TaskCompletionStamp } from '@/types/taskStamps';
import { Role } from '@/types/roles';

export const useTaskCompletionStamps = () => {
  const [stamps, setStamps] = useState<TaskCompletionStamp[]>([]);

  const addStamp = useCallback((
    taskId: string,
    taskName: string,
    eventId: string,
    eventType: string,
    completedBy: Role,
    completedByName?: string
  ) => {
    const actualCompletionTime = new Date();
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    // Check if it's past 11:59 PM for permanent flag
    const isPermanent = now > endOfDay;
    
    const newStamp: TaskCompletionStamp = {
      id: `stamp-${Date.now()}`,
      taskId,
      taskName,
      eventId,
      eventType,
      completedAt: actualCompletionTime,
      completedBy,
      completedByName: completedByName || completedBy,
      userId: `user-${completedBy}-001`,
      canUndo: !isPermanent, // Can only undo if not permanent
      displayTime: format(actualCompletionTime, 'h:mm a'),
      permanent: isPermanent,
      actualCompletionTime // Lock to true completion time
    };

    setStamps(prev => {
      // Remove any existing stamp for this task (for re-completion)
      const filtered = prev.filter(s => s.taskId !== taskId);
      return [...filtered, newStamp];
    });

    console.log('Task completion stamp added:', newStamp);
    return newStamp;
  }, []);

  const removeStamp = useCallback((taskId: string) => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    setStamps(prev => prev.filter(s => {
      if (s.taskId !== taskId) return true;
      
      // Only allow removal if before 11:59 PM and not permanent
      const canRemove = now <= endOfDay && 
                       s.actualCompletionTime.toDateString() === now.toDateString() &&
                       !s.permanent &&
                       s.canUndo;
      
      if (!canRemove) {
        console.log('Cannot remove stamp - it is permanent or past undo time');
      }
      
      return !canRemove; // Keep stamps that can't be removed
    }));
  }, []);

  const getStampsForEvent = useCallback((eventId: string) => {
    return stamps.filter(s => s.eventId === eventId);
  }, [stamps]);

  const getStampsForTimeSlot = useCallback((timeSlot: string, date: Date) => {
    return stamps.filter(s => {
      const stampTime = format(s.actualCompletionTime, 'HH:mm');
      const stampDate = format(s.actualCompletionTime, 'yyyy-MM-dd');
      const targetDate = format(date, 'yyyy-MM-dd');
      
      return stampTime === timeSlot && stampDate === targetDate;
    });
  }, [stamps]);

  const getStampsForToday = useCallback(() => {
    const today = new Date();
    return stamps.filter(s => {
      const stampDate = new Date(s.actualCompletionTime);
      return stampDate.toDateString() === today.toDateString();
    });
  }, [stamps]);

  const lockStampsForPreviousDays = useCallback(() => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    setStamps(prev => prev.map(stamp => {
      const stampDate = new Date(stamp.actualCompletionTime);
      
      // Lock stamps from previous days or if past 11:59 PM
      if (stampDate.toDateString() !== now.toDateString() || now > endOfDay) {
        return { 
          ...stamp, 
          canUndo: false, 
          permanent: true 
        };
      }
      return stamp;
    }));
  }, []);

  // Check for midnight and lock stamps automatically
  const checkMidnightLock = useCallback(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      lockStampsForPreviousDays();
    }
  }, [lockStampsForPreviousDays]);

  return {
    stamps,
    addStamp,
    removeStamp,
    getStampsForEvent,
    getStampsForTimeSlot,
    getStampsForToday,
    lockStampsForPreviousDays,
    checkMidnightLock
  };
};
