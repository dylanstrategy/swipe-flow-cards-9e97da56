
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import SwipeCard from '../SwipeCard';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const TodayTab = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{format(selectedDate, 'EEEE')}</h1>
      
      {/* Calendar */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className={cn("p-3 pointer-events-auto")}
          classNames={{
            day_today: "bg-blue-600 text-white hover:bg-blue-700",
            day_selected: "bg-blue-600 text-white hover:bg-blue-700"
          }}
        />
      </div>

      {/* Schedule Items */}
      <div className="space-y-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="mr-3">9AM</span>
          <div className="flex-1 bg-blue-100 rounded-lg p-3">
            <span className="text-blue-800 font-medium">Message from Management</span>
            <p className="text-blue-600 text-xs mt-1">Answer these messages</p>
          </div>
        </div>

        <div className="flex items-start text-sm text-gray-500 mb-4">
          <span className="mr-3 mt-2">10:30</span>
          <div className="flex-1">
            <SwipeCard
              onSwipeRight={{
                label: "Reschedule",
                action: () => handleAction("Rescheduled", "Work Order"),
                color: "#3B82F6"
              }}
              onSwipeLeft={{
                label: "Cancel",
                action: () => handleAction("Cancelled", "Work Order"),
                color: "#EF4444"
              }}
              onSwipeUp={{
                label: "Details",
                action: () => handleAction("Viewed Details", "Work Order"),
                color: "#10B981"
              }}
              onTap={() => handleAction("Opened", "Work Order")}
            >
              <div className="bg-blue-100 rounded-lg p-4">
                <h3 className="text-blue-800 font-semibold mb-2">Work Order</h3>
                <p className="text-blue-600 mb-3">Broken outlet</p>
                <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-4xl">🔌</span>
                </div>
              </div>
            </SwipeCard>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reply</h2>
        <div className="text-blue-600">
          <span className="text-3xl">↑</span>
        </div>
      </div>
    </div>
  );
};

export default TodayTab;
