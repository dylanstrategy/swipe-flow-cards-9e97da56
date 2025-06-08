
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
    const completedAt = new Date();
    const newStamp: TaskCompletionStamp = {
      id: `stamp-${Date.now()}`,
      taskId,
      taskName,
      eventId,
      eventType,
      completedAt,
      completedBy,
      completedByName: completedByName || completedBy,
      userId: `user-${completedBy}-001`, // Generate userId based on role
      canUndo: true,
      displayTime: format(completedAt, 'h:mm a') // Add required displayTime field
    };

    setStamps(prev => {
      // Remove any existing stamp for this task
      const filtered = prev.filter(s => s.taskId !== taskId);
      return [...filtered, newStamp];
    });

    return newStamp;
  }, []);

  const removeStamp = useCallback((taskId: string) => {
    setStamps(prev => prev.filter(s => s.taskId !== taskId));
  }, []);

  const getStampsForEvent = useCallback((eventId: string) => {
    return stamps.filter(s => s.eventId === eventId);
  }, [stamps]);

  const getStampsForToday = useCallback(() => {
    const today = new Date();
    return stamps.filter(s => {
      const stampDate = new Date(s.completedAt);
      return stampDate.toDateString() === today.toDateString();
    });
  }, [stamps]);

  const lockStampsForPreviousDays = useCallback(() => {
    const now = new Date();
    setStamps(prev => prev.map(stamp => {
      const stampDate = new Date(stamp.completedAt);
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
    getStampsForToday,
    lockStampsForPreviousDays
  };
};
