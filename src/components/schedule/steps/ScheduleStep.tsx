
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
      <div className="text-center mb-4">
        <Clock className="mx-auto text-blue-600 mb-2" size={32} />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Schedule Repair</h3>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Select Date</h4>
          <div className="bg-white border border-gray-200 rounded-lg">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className={cn("p-3")}
              classNames={{
                day_today: "bg-blue-600 text-white hover:bg-blue-700",
                day_selected: "bg-blue-600 text-white hover:bg-blue-700"
              }}
            />
          </div>
        </div>

        {selectedDate && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Available Times</h4>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="text-xs py-2 px-3"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {canProceed && (
          <SwipeUpPrompt 
            onContinue={onNext}
            message="Schedule confirmed!"
            buttonText="Continue"
          />
        )}
      </div>
    </div>
  );
};

export default ScheduleStep;
