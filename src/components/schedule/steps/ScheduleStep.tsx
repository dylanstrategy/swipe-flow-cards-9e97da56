
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';

interface ScheduleStepProps {
  onNext: () => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

const ScheduleStep = ({ onNext, selectedDate, setSelectedDate, selectedTime, setSelectedTime }: ScheduleStepProps) => {
  const availableTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const canProceed = () => {
    return selectedDate && selectedTime;
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Repair</h3>
      
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2 text-sm">Select Date</h4>
          <div className="bg-white rounded-lg border border-gray-200">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className={cn("p-2 pointer-events-auto")}
              disabled={(date) => date < new Date()}
              classNames={{
                months: "flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0",
                month: "space-y-2",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-xs font-medium",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-7 font-normal text-[0.7rem]",
                row: "flex w-full mt-1",
                cell: "h-7 w-7 text-center text-xs p-0 relative",
                day: "h-7 w-7 p-0 font-normal aria-selected:opacity-100 text-xs",
              }}
            />
          </div>
        </div>

        {selectedDate && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2 text-sm">Available Times</h4>
            <div className="grid grid-cols-3 gap-1">
              {availableTimeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "p-2 border rounded-lg text-xs font-medium transition-colors",
                    selectedTime === time
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {canProceed() && (
        <div className="text-center">
          <p className="text-green-600 mb-2 text-sm">Schedule selected!</p>
          <ArrowUp className="text-green-600 animate-bounce mx-auto mb-2" size={24} />
          <p className="text-xs text-gray-500 mb-3">Swipe up anywhere to review</p>
          <button
            onClick={onNext}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
      {!canProceed() && (
        <div className="text-center">
          <p className="text-gray-500 text-sm">Please select a date and time</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleStep;
