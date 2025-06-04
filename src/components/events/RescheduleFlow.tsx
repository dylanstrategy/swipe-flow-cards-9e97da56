
import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { EnhancedEvent, TimeSlot } from '@/types/events';
import { format, addDays, isSameDay, isToday, isTomorrow } from 'date-fns';

interface RescheduleFlowProps {
  event: EnhancedEvent;
  onClose: () => void;
  onConfirm: (data: any) => void;
  userRole: 'resident' | 'operator' | 'maintenance';
}

const RescheduleFlow = ({ event, onClose, onConfirm, userRole }: RescheduleFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState('');
  const [notifyResident, setNotifyResident] = useState(true);
  const [notifyTeamMember, setNotifyTeamMember] = useState(true);

  // Mock available time slots - in real app, this would come from team availability service
  const getAvailableTimeSlots = (date: Date): TimeSlot[] => {
    if (!event.assignedTeamMember) return [];
    
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    // Mock some unavailable slots
    const unavailableSlots = isToday(date) ? ['09:00', '10:30', '14:00'] : ['11:00', '15:30'];
    
    return baseSlots.map(time => ({
      start: time,
      end: time,
      available: !unavailableSlots.includes(time)
    }));
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    onConfirm({
      eventId: event.id,
      newDate: selectedDate,
      newTime: selectedTime,
      reason,
      notifyResident,
      notifyTeamMember
    });
  };

  const canProceedToNextStep = () => {
    if (currentStep === 1) return selectedDate;
    if (currentStep === 2) return selectedTime;
    return true;
  };

  // Step 1: Date Selection
  if (currentStep === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-end md:items-center justify-center">
        <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-xl md:rounded-xl shadow-xl">
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Select New Date</h2>
            </div>
            <span className="text-sm text-gray-500">Step 1 of 3</span>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Rescheduling: <strong>{event.title}</strong></p>
              <p className="text-sm text-gray-500">
                Currently scheduled for {formatDate(event.date)} at {formatTime(event.time)}
              </p>
            </div>

            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || isSameDay(date, event.date)}
              className="rounded-md border"
            />
          </div>

          <div className="sticky bottom-0 bg-white border-t p-4">
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!canProceedToNextStep()}
              className="w-full"
            >
              Continue to Time Selection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Time Selection
  if (currentStep === 2 && selectedDate) {
    const availableSlots = getAvailableTimeSlots(selectedDate);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-end md:items-center justify-center">
        <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-xl md:rounded-xl shadow-xl">
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentStep(1)} className="p-1 text-gray-400 hover:text-gray-600">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Select Time</h2>
            </div>
            <span className="text-sm text-gray-500">Step 2 of 3</span>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <p className="text-gray-600 mb-1">Selected date: <strong>{formatDate(selectedDate)}</strong></p>
              {event.assignedTeamMember && (
                <p className="text-sm text-gray-500">
                  Available times for {event.assignedTeamMember.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.start}
                  onClick={() => slot.available && setSelectedTime(slot.start)}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    selectedTime === slot.start
                      ? 'bg-blue-600 text-white border-blue-600'
                      : slot.available
                      ? 'bg-white text-gray-900 border-gray-200 hover:border-blue-300'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock size={16} />
                    {formatTime(slot.start)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t p-4">
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!canProceedToNextStep()}
              className="w-full"
            >
              Continue to Confirmation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Confirmation
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-end md:items-center justify-center">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-xl md:rounded-xl shadow-xl">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentStep(2)} className="p-1 text-gray-400 hover:text-gray-600">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Confirm Reschedule</h2>
          </div>
          <span className="text-sm text-gray-500">Step 3 of 3</span>
        </div>

        <div className="p-4 space-y-6">
          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Reschedule Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Event:</span>
                <span className="text-blue-900 font-medium">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">New Date:</span>
                <span className="text-blue-900">{selectedDate && formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">New Time:</span>
                <span className="text-blue-900">{selectedTime && formatTime(selectedTime)}</span>
              </div>
              {event.assignedTeamMember && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Team Member:</span>
                  <span className="text-blue-900">{event.assignedTeamMember.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reason (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for rescheduling (optional)
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for rescheduling..."
              className="w-full"
              rows={3}
            />
          </div>

          {/* Notification Settings */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Notifications</h4>
            
            {userRole !== 'resident' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify-resident"
                  checked={notifyResident}
                  onCheckedChange={(checked) => setNotifyResident(checked as boolean)}
                />
                <label htmlFor="notify-resident" className="text-sm text-gray-700">
                  Notify resident about the change
                </label>
              </div>
            )}

            {event.assignedTeamMember && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify-team"
                  checked={notifyTeamMember}
                  onCheckedChange={(checked) => setNotifyTeamMember(checked as boolean)}
                />
                <label htmlFor="notify-team" className="text-sm text-gray-700">
                  Notify {event.assignedTeamMember.name} about the change
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 space-y-3">
          <Button
            onClick={handleConfirm}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Check size={20} className="mr-2" />
            Confirm Reschedule
          </Button>
          <Button
            onClick={() => setCurrentStep(2)}
            variant="outline"
            className="w-full"
          >
            Back to Time Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleFlow;
