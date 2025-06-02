
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, ArrowUp, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

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
  const [showCalendar, setShowCalendar] = useState(false);
  
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const currentDate = new Date();

  const isComplete = selectedDate && selectedTime;

  const handleDateClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setShowCalendar(false);
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

      {/* Current Schedule - Clickable Date Only */}
      <Card className="flex-shrink-0">
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="text-xs text-gray-600 mb-2">Select Date:</div>
            
            {/* Clickable Date Display */}
            <button
              onClick={handleDateClick}
              className="w-full flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">
                  {selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Select a date'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {/* Calendar Section - Conditional */}
        {showCalendar && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2 text-sm">Select Date</h3>
            <div className="bg-white rounded-lg border border-gray-200">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="w-full p-2 [&_.rdp-month]:text-sm [&_.rdp-day]:h-8 [&_.rdp-day]:w-8"
                disabled={(date) => date < new Date()}
              />
            </div>
          </div>
        )}

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
