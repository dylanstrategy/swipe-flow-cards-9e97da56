
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, CalendarIcon, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ScheduleStepProps {
  onNext: () => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

const ScheduleStep = ({ onNext, selectedDate, setSelectedDate, selectedTime, setSelectedTime }: ScheduleStepProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Dynamic time slots based on day of week
  const getAvailableTimeSlots = (date: Date) => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    switch (dayOfWeek) {
      case 1: // Monday - Limited availability
        return ['9:00 AM', '2:00 PM', '4:00 PM'];
      case 2: // Tuesday - Morning heavy
        return ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM'];
      case 3: // Wednesday - Afternoon focus
        return ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
      case 4: // Thursday - Mixed availability
        return ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'];
      case 5: // Friday - Early slots
        return ['8:00 AM', '9:00 AM', '10:00 AM'];
      case 6: // Saturday - Weekend slots
        return ['10:00 AM', '12:00 PM', '2:00 PM'];
      default: // Sunday - Limited emergency slots
        return ['11:00 AM', '3:00 PM'];
    }
  };

  const availableTimes = selectedDate ? getAvailableTimeSlots(selectedDate) : [];
  const canProceed = selectedDate && selectedTime;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
    setCalendarOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-3 flex-shrink-0">
        <Clock className="mx-auto text-blue-600 mb-2" size={28} />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Schedule Repair</h3>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pb-4">
        {/* Date Selection */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2 text-sm">Select Date</h4>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10",
                  !selectedDate && "text-muted-foreground"
                )}
                onClick={() => setCalendarOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[10000]" align="start" side="bottom" sideOffset={5}>
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

        {/* Time Selection - Shows when date is selected */}
        {selectedDate && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2 text-sm">
              Available Times for {format(selectedDate, 'EEEE, MMM do')}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className="h-9 text-xs font-medium"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Swipe Up Prompt */}
      {canProceed && (
        <div className="text-center pt-4 flex-shrink-0">
          <p className="text-green-600 font-medium text-sm mb-2">Ready to continue!</p>
          <ArrowUp className="text-green-600 animate-bounce mx-auto mb-2" size={20} />
          <p className="text-xs text-gray-500">Swipe up to continue</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleStep;
