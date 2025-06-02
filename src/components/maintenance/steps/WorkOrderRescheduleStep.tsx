
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, ArrowUp, Image } from 'lucide-react';

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
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const isComplete = selectedDate && selectedTime;

  return (
    <div className="space-y-6">
      {/* Prominent Reschedule Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=64&h=64&fit=crop&crop=center" 
              alt="Reschedule work order"
              className="w-12 h-12 rounded object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Reschedule Work Order</h2>
            <p className="text-blue-100 text-sm">
              Select a new date and time that works better for your schedule
            </p>
          </div>
        </div>
      </div>

      {/* Current Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>Today, June 2nd</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>2:00 PM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reschedule Options */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Select New Date</h3>
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0"
              disabled={(date) => date < new Date()}
            />
          </CardContent>
        </Card>
      </div>

      {selectedDate && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Select Time</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className="h-10 text-sm"
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isComplete && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Swipe up to confirm reschedule</p>
          <ArrowUp className="w-6 h-6 text-gray-400 mx-auto animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default WorkOrderRescheduleStep;
