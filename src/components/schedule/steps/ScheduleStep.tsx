
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import SwipeUpPrompt from '@/components/ui/swipe-up-prompt';

interface ScheduleStepProps {
  onNext: () => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

const ScheduleStep = ({ onNext, selectedDate, setSelectedDate, selectedTime, setSelectedTime }: ScheduleStepProps) => {
  const availableTimes = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const canProceed = selectedDate && selectedTime;

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-4">
        <Clock className="mx-auto text-blue-600 mb-2" size={32} />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Schedule Repair</h3>
      </div>
      
      <div className="flex-1 space-y-6">
        {/* Date Selection */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 text-base">Select Date</h4>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection - Only show when date is selected */}
        {selectedDate && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 text-base">Available Times</h4>
            <div className="grid grid-cols-2 gap-3">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className="h-11 text-sm font-medium"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Swipe Up Prompt - Only show when both date and time are selected */}
        {canProceed && (
          <div className="pt-4">
            <SwipeUpPrompt 
              onContinue={onNext}
              message="Schedule confirmed!"
              buttonText="Continue"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleStep;
