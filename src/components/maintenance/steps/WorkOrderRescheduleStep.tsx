
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, ArrowUp, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WorkOrderRescheduleStepProps {
  workOrder: any;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

const WorkOrderRescheduleStep = ({ 
  workOrder, 
  selectedDate, 
  setSelectedDate,
  selectedTime,
  setSelectedTime 
}: WorkOrderRescheduleStepProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const isComplete = selectedDate && selectedTime;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setCalendarOpen(false);
  };

  return (
    <div className="h-full flex flex-col space-y-3 overflow-hidden">
      {/* Compact Reschedule Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=64&h=64&fit=crop&crop=center" 
              alt="Reschedule work order"
              className="w-6 h-6 rounded object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Reschedule Work Order</h2>
            <p className="text-blue-100 text-xs">
              Select a new date and time
            </p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <Card className="flex-shrink-0">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="text-xs text-gray-600 mb-2">Select Date:</div>
            
            {/* Date Picker with Popover */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Select a date'}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${calendarOpen ? 'rotate-180' : ''}`} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[10000]" align="center" side="bottom" sideOffset={5}>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {/* Time Selection - Shows when date is selected */}
        {selectedDate && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2 text-sm">
              Available Times for {format(selectedDate, 'MMM do')}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="h-10 text-xs font-medium"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      {isComplete && (
        <div className="text-center pt-2 flex-shrink-0">
          <p className="text-xs text-gray-600 mb-1">Swipe up to confirm reschedule</p>
          <ArrowUp className="w-5 h-5 text-gray-400 mx-auto animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default WorkOrderRescheduleStep;
