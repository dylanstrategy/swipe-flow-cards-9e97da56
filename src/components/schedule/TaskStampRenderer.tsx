
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskCompletionStamp } from '@/types/taskStamps';
import { Role } from '@/types/roles';

interface TaskStampRendererProps {
  stamps: TaskCompletionStamp[];
  timeSlot: string;
  selectedDate: Date;
  className?: string;
}

const TaskStampRenderer = ({ stamps, timeSlot, selectedDate, className }: TaskStampRendererProps) => {
  // Filter stamps for this specific time slot using actual completion time
  const slotStamps = stamps.filter(stamp => {
    const stampTime = format(stamp.actualCompletionTime, 'HH:mm');
    const stampDate = format(stamp.actualCompletionTime, 'yyyy-MM-dd');
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    return stampTime === timeSlot && stampDate === selectedDateStr;
  });

  if (slotStamps.length === 0) {
    return null;
  }

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'resident': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'maintenance': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'operator': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'vendor': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatCompletionTime = (date: Date): string => {
    return format(date, 'h:mm a');
  };

  return (
    <div className={cn("absolute inset-0 pointer-events-none z-0", className)}>
      <div className="space-y-1 p-1">
        {slotStamps.map((stamp) => (
          <div
            key={stamp.id}
            className={cn(
              "flex items-center gap-2 text-xs px-2 py-1 rounded-md border opacity-90",
              getRoleColor(stamp.completedBy),
              "transition-all duration-200 hover:opacity-100"
            )}
            title={`${stamp.taskName} completed by ${stamp.completedByName} at ${formatCompletionTime(stamp.actualCompletionTime)}\nRole: ${stamp.completedBy} | Task: ${stamp.taskName}`}
          >
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">✅ {stamp.taskName}</div>
              <div className="truncate">
                by {stamp.completedByName} • {formatCompletionTime(stamp.actualCompletionTime)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStampRenderer;
