
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleDropZoneProps {
  onScheduleWorkOrder: (workOrder: any, scheduledTime: string) => void;
}

const ScheduleDropZone: React.FC<ScheduleDropZoneProps> = ({ onScheduleWorkOrder }) => {
  const { toast } = useToast();
  const [hoveredWorkOrder, setHoveredWorkOrder] = useState<any>(null);
  
  // Get next available time slot for today
  const getNextAvailableTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // If it's before 9 AM, start at 9 AM
    if (currentHour < 9) {
      return '09:00';
    }
    
    // If it's after 5 PM, schedule for tomorrow 9 AM
    if (currentHour >= 17) {
      return 'Tomorrow 09:00';
    }
    
    // Round up to next 30-minute interval
    let nextHour = currentHour;
    let nextMinute = currentMinute <= 30 ? 30 : 0;
    
    if (nextMinute === 0) {
      nextHour += 1;
    }
    
    // If we've gone past 5 PM, move to tomorrow
    if (nextHour >= 17) {
      return 'Tomorrow 09:00';
    }
    
    return `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`;
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'workOrder',
    drop: (item: { workOrder: any }) => {
      const scheduledTime = getNextAvailableTime();
      onScheduleWorkOrder(item.workOrder, scheduledTime);
      
      toast({
        title: "Work Order Scheduled!",
        description: `${item.workOrder.title} scheduled for ${scheduledTime === 'Tomorrow 09:00' ? 'tomorrow at 9:00 AM' : `today at ${scheduledTime}`}`,
      });
      
      setHoveredWorkOrder(null);
    },
    hover: (item: { workOrder: any }) => {
      setHoveredWorkOrder(item.workOrder);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const nextTime = getNextAvailableTime();
  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={`fixed bottom-20 left-4 right-4 mx-auto max-w-md h-24 rounded-xl border-2 border-dashed transition-all duration-200 z-[1000] pointer-events-auto ${
        isActive 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : canDrop
          ? 'border-blue-300 bg-blue-25'
          : 'border-gray-300 bg-white shadow-lg'
      }`}
    >
      <div className="flex items-center justify-center h-full px-4">
        {isActive ? (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Release to Schedule</span>
            </div>
            {hoveredWorkOrder && (
              <div className="text-sm text-blue-700">
                <div className="font-medium">{hoveredWorkOrder.title}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {nextTime === 'Tomorrow 09:00' ? 'Tomorrow at 9:00 AM' : `Today at ${nextTime}`}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Drop to Schedule for Today</span>
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Next available: {nextTime === 'Tomorrow 09:00' ? 'Tomorrow 9:00 AM' : `${nextTime}`}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleDropZone;
