
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
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
      <div className="text-center mb-3">
        <Clock className="mx-auto text-blue-600 mb-2" size={28} />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Schedule Repair</h3>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div>
          <h4 className="font-medium text-gray-900 mb-2 text-sm">Select Date</h4>
          <div className="bg-white border border-gray-200 rounded-lg">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className={cn("p-2")}
              classNames={{
                months: "flex flex-col space-y-2",
                month: "space-y-2",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 font-normal text-xs",
                row: "flex w-full mt-1",
                cell: "h-8 w-8 text-center text-xs p-0 relative",
                day: "h-8 w-8 p-0 font-normal text-xs",
                day_today: "bg-blue-600 text-white hover:bg-blue-700",
                day_selected: "bg-blue-600 text-white hover:bg-blue-700"
              }}
            />
          </div>
        </div>

        {selectedDate && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Available Times</h4>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-xs py-1.5 px-2 h-8"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {canProceed && (
          <div className="pt-2">
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
