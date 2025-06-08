
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
      canUndo: true,
      displayTime: format(actualCompletionTime, 'h:mm a'),
      permanent: true, // All stamps are permanent
      actualCompletionTime // Lock to true completion time
    };

    setStamps(prev => {
      // Remove any existing stamp for this task
      const filtered = prev.filter(s => s.taskId !== taskId);
      return [...filtered, newStamp];
    });

    return newStamp;
  }, []);

  const removeStamp = useCallback((taskId: string) => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    // Only allow undo if before midnight on same day
    setStamps(prev => prev.filter(s => {
      if (s.taskId !== taskId) return true;
      
      const stampDate = new Date(s.actualCompletionTime);
      const canUndo = now <= endOfDay && 
                     stampDate.toDateString() === now.toDateString() &&
                     s.canUndo;
      
      return !canUndo; // Keep stamps that can't be undone
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
    setStamps(prev => prev.map(stamp => {
      const stampDate = new Date(stamp.actualCompletionTime);
      if (stampDate.toDateString() !== now.toDateString()) {
        return { ...stamp, canUndo: false };
      }
      return stamp;
    }));
  }, []);

  return {
    stamps,
    addStamp,
    removeStamp,
    getStampsForEvent,
    getStampsForTimeSlot,
    getStampsForToday,
    lockStampsForPreviousDays
  };
};
