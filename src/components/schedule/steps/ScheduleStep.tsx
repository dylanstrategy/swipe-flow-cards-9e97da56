
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ScheduleStepProps {
  onNext: () => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  enabled: boolean;
  taskTypes?: string[];
}

const ScheduleStep = ({ onNext, selectedDate, setSelectedDate, selectedTime, setSelectedTime }: ScheduleStepProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarSettings, setCalendarSettings] = useState<any>(null);
  
  useEffect(() => {
    // Load calendar settings from localStorage
    const savedSettings = localStorage.getItem('calendarSettings');
    if (savedSettings) {
      setCalendarSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Get available time slots based on calendar settings or fallback to default
  const getAvailableTimeSlots = (date: Date) => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = dayNames[dayOfWeek];
    
    // If calendar settings exist, use them
    if (calendarSettings && calendarSettings[dayKey]) {
      return calendarSettings[dayKey]
        .filter((slot: TimeSlot) => slot.enabled)
        .map((slot: TimeSlot) => {
          const [hours, minutes] = slot.start.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          return `${displayHour}:${minutes} ${ampm}`;
        });
    }
    
    // Fallback to original dynamic time slots
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
      
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
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
            {availableTimes.length > 0 ? (
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
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No availability on {format(selectedDate, 'EEEE')}</p>
                <p className="text-xs text-gray-400 mt-1">Please select a different date</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleStep;
