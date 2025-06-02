
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import FormSlide from './FormSlide';

interface DateSlideProps {
  title: string;
  subtitle?: string;
  selectedDate?: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  getTimeSlots?: (date: Date) => string[];
  showTimeSelection?: boolean;
}

const DateSlide = ({ 
  title, 
  subtitle, 
  selectedDate, 
  setSelectedDate, 
  selectedTime, 
  setSelectedTime,
  getTimeSlots,
  showTimeSelection = true
}: DateSlideProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const defaultTimeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'];
  const availableTimes = selectedDate && getTimeSlots ? getTimeSlots(selectedDate) : defaultTimeSlots;
  const canProceed = Boolean(selectedDate && (!showTimeSelection || selectedTime));

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
    setCalendarOpen(false);
  };

  return (
    <FormSlide 
      title={title} 
      subtitle={subtitle} 
      icon={<Clock className="text-blue-600" size={28} />}
      canProceed={canProceed}
    >
      <div className="space-y-8">
        {/* Date Selection */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Select Date</h4>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-14 text-base",
                  !selectedDate && "text-muted-foreground"
                )}
                onClick={() => setCalendarOpen(true)}
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
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
                className="p-4 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        {showTimeSelection && selectedDate && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">
              Available Times for {format(selectedDate, 'EEEE, MMM do')}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                  className="h-14 text-base font-medium"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </FormSlide>
  );
};

export default DateSlide;
