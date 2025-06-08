
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCompletionRendererProps {
  eventTitle: string;
  eventType: string;
  completedAt: Date;
  completedBy: string;
  className?: string;
  isLocked?: boolean;
}

const EventCompletionRenderer = ({ 
  eventTitle, 
  eventType, 
  completedAt, 
  completedBy,
  className,
  isLocked = true
}: EventCompletionRendererProps) => {
  const formatCompletionTime = (date: Date): string => {
    return format(date, 'h:mm a');
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg border-2 bg-green-100 border-green-300 text-green-800",
        "transition-all duration-200",
        isLocked && "cursor-not-allowed select-none",
        className
      )}
      style={{ pointerEvents: isLocked ? 'none' : 'auto' }}
    >
      <div className="flex items-start gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm mb-1 flex items-center gap-2">
            ✅ {eventTitle} Completed
            {isLocked && <Lock className="w-3 h-3 text-green-600" />}
          </div>
          <div className="text-xs text-green-700">
            {eventType} • Completed by {completedBy}
          </div>
          <div className="text-xs text-green-600 mt-1">
            {formatCompletionTime(completedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCompletionRenderer;
