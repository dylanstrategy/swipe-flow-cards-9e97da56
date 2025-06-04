
import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, Check, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedEvent, TimeSlot } from '@/types/events';
import { format, addDays, isSameDay, isToday, isTomorrow } from 'date-fns';
import SwipeableScreen from '../schedule/SwipeableScreen';
import SwipeUpPrompt from '@/components/ui/swipe-up-prompt';

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

  // Mock available time slots - updated for better presentation variety
  const getAvailableTimeSlots = (date: Date): TimeSlot[] => {
    if (!event.assignedTeamMember) return [];
    
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    // Create different availability patterns based on day of week for presentation
    const dayOfWeek = date.getDay();
    let unavailableSlots: string[] = [];

    switch (dayOfWeek) {
      case 1: // Monday - busy morning
        unavailableSlots = ['09:00', '09:30', '10:00', '14:30', '15:00'];
        break;
      case 2: // Tuesday - light schedule
        unavailableSlots = ['11:30', '13:00'];
        break;
      case 3: // Wednesday - busy afternoon
        unavailableSlots = ['14:00', '14:30', '15:00', '15:30', '16:00'];
        break;
      case 4: // Thursday - scattered availability
        unavailableSlots = ['09:30', '11:00', '12:30', '16:30'];
        break;
      case 5: // Friday - limited afternoon
        unavailableSlots = ['15:00', '15:30', '16:00', '16:30', '17:00'];
        break;
      case 6: // Saturday - weekend schedule
        unavailableSlots = ['09:00', '12:00', '12:30', '13:00', '13:30'];
        break;
      case 0: // Sunday - very limited
        unavailableSlots = ['09:00', '09:30', '10:30', '11:30', '12:00', '12:30', '13:00', '13:30', '16:00', '16:30', '17:00'];
        break;
      default:
        unavailableSlots = ['11:00', '15:30'];
    }
    
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

  const canProceedFromCurrentStep = (): boolean => {
    if (currentStep === 1) return selectedDate !== undefined;
    if (currentStep === 2) return selectedTime !== '';
    return false;
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClearData = () => {
    setSelectedDate(undefined);
    setSelectedTime('');
    setReason('');
    setNotifyResident(true);
    setNotifyTeamMember(true);
  };

  // Step 1: Date Selection
  if (currentStep === 1) {
    return (
      <SwipeableScreen
        title="Select New Date"
        currentStep={currentStep}
        totalSteps={3}
        onClose={onClose}
        onSwipeUp={canProceedFromCurrentStep() ? nextStep : undefined}
        onSwipeLeft={prevStep}
        canSwipeUp={canProceedFromCurrentStep()}
      >
        <div className="h-full pb-32">
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

        {canProceedFromCurrentStep() && (
          <SwipeUpPrompt 
            onContinue={nextStep}
            onClear={handleClearData}
            message="Date selected!"
            buttonText="Continue to Time Selection"
          />
        )}
      </SwipeableScreen>
    );
  }

  // Step 2: Time Selection
  if (currentStep === 2 && selectedDate) {
    const availableSlots = getAvailableTimeSlots(selectedDate);

    return (
      <div 
        className="fixed inset-0 bg-white z-[9999] flex flex-col overflow-hidden"
        onTouchMove={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        style={{ 
          width: '100vw', 
          height: '100vh',
          touchAction: 'none'
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Select Time</h1>
            <span className="text-xs text-gray-500">Step {currentStep} of 3</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-gray-600 text-xl">×</span>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex-shrink-0 px-4 py-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-shrink-0 mb-4">
            <p className="text-gray-600 mb-1">Selected date: <strong>{formatDate(selectedDate)}</strong></p>
            {event.assignedTeamMember && (
              <p className="text-sm text-gray-500">
                Available times for {event.assignedTeamMember.name}
              </p>
            )}
          </div>

          <div className="flex-1 min-h-0 pb-32">
            <div 
              className="h-full overflow-y-auto"
              style={{ 
                touchAction: 'pan-y',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch'
              }}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-3 pr-2">
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
          </div>
        </div>

        {canProceedFromCurrentStep() && (
          <SwipeUpPrompt 
            onContinue={nextStep}
            onBack={prevStep}
            onClear={handleClearData}
            message="Time selected!"
            buttonText="Continue to Confirmation"
            showBack={true}
          />
        )}
      </div>
    );
  }

  // Step 3: Confirmation (no swipe - final step)
  return (
    <SwipeableScreen
      title="Confirm Reschedule"
      currentStep={currentStep}
      totalSteps={3}
      onClose={onClose}
      onSwipeLeft={prevStep}
      hideSwipeHandling={true}
    >
      <div className="space-y-6">
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

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleConfirm}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Check size={20} className="mr-2" />
            Confirm Reschedule
          </Button>
          <Button
            onClick={prevStep}
            variant="outline"
            className="w-full"
          >
            Back to Time Selection
          </Button>
        </div>
      </div>
    </SwipeableScreen>
  );
};

export default RescheduleFlow;
