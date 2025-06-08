
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskCompletionStamp } from '@/types/taskStamps';
import { Role } from '@/types/roles';

interface TaskStampBadgeProps {
  stamp: TaskCompletionStamp;
  className?: string;
}

const TaskStampBadge = ({ stamp, className }: TaskStampBadgeProps) => {
  const formatCompletionTime = (date: Date): string => {
    return format(date, 'h:mm a');
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs px-2 py-1 rounded-md border mb-1",
        "bg-green-50 text-green-700 border-green-200",
        "transition-all duration-200 hover:opacity-100 pointer-events-none",
        "max-w-full",
        className
      )}
      style={{ zIndex: 1 }}
      title={`${stamp.taskName} by ${stamp.completedByName} (${stamp.completedBy}) at ${formatCompletionTime(stamp.actualCompletionTime)}`}
    >
      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="truncate text-xs">
          ✅ {stamp.taskName} by {stamp.completedByName} at {formatCompletionTime(stamp.actualCompletionTime)}
        </div>
      </div>
    </div>
  );
};

export default TaskStampBadge;
