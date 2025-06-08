
import React from 'react';
import { format, isSameHour } from 'date-fns';
import { TaskCompletionStamp } from '@/types/taskStamps';
import TaskStampBadge from './TaskStampBadge';

interface TaskStampRendererProps {
  stamps: TaskCompletionStamp[];
  timeSlot: string;
  selectedDate: Date;
  className?: string;
}

const TaskStampRenderer = ({ stamps, timeSlot, selectedDate, className }: TaskStampRendererProps) => {
  // Create a Date object for the current time slot
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotTime = new Date(selectedDate);
  slotTime.setHours(hours, minutes, 0, 0);
  
  // Filter stamps that fall within this hour slot
  const slotStamps = stamps.filter(stamp => {
    try {
      const stampTime = stamp.actualCompletionTime instanceof Date 
        ? stamp.actualCompletionTime 
        : new Date(stamp.actualCompletionTime);
      
      const stampDate = format(stampTime, 'yyyy-MM-dd');
      const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
      
      // Check if stamp is on the same date and within the same hour
      return stampDate === selectedDateStr && isSameHour(stampTime, slotTime);
    } catch (error) {
      console.warn('Error filtering stamp:', stamp, error);
      return false;
    }
  });

  if (slotStamps.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 p-1">
      <div className="space-y-1">
        {slotStamps.map((stamp) => (
          <TaskStampBadge
            key={stamp.id}
            stamp={stamp}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskStampRenderer;
