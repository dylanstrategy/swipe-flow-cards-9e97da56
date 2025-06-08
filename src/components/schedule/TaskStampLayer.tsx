
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskCompletionStamp } from '@/types/taskStamps';
import { Role } from '@/types/roles';

interface TaskStampLayerProps {
  stamps: TaskCompletionStamp[];
  timeSlot: string;
  selectedDate: Date;
}

const TaskStampLayer = ({ stamps, timeSlot, selectedDate }: TaskStampLayerProps) => {
  // Filter stamps for this specific time slot and date
  const slotStamps = stamps.filter(stamp => {
    const stampDate = stamp.completedAt instanceof Date ? stamp.completedAt : new Date(stamp.completedAt);
    const stampTime = format(stampDate, 'HH:mm');
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const stampDateStr = format(stampDate, 'yyyy-MM-dd');
    
    return stampTime === timeSlot && stampDateStr === selectedDateStr;
  });

  if (slotStamps.length === 0) {
    return null;
  }

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'resident': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'operator': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'vendor': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCompletionTime = (date: Date): string => {
    return format(date, 'h:mm a');
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="space-y-1 p-1">
        {slotStamps.map((stamp) => (
          <div
            key={stamp.id}
            className={cn(
              "flex items-center gap-2 text-xs px-2 py-1 rounded-md border opacity-80",
              "bg-green-50 text-green-700 border-green-200",
              "transition-all duration-200 hover:opacity-100"
            )}
            title={`${stamp.taskName} completed by ${stamp.completedByName} at ${formatCompletionTime(stamp.completedAt)}`}
          >
            <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{stamp.taskName}</div>
              <div className="text-green-600 truncate">
                by {stamp.completedByName} • {formatCompletionTime(stamp.completedAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStampLayer;
