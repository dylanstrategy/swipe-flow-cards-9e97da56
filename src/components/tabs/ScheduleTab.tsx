import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import SwipeCard from '../SwipeCard';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

const ScheduleTab = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedScheduleType, setSelectedScheduleType] = useState<string>('');

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const scheduleTypes = [
    { id: 'work-order', label: 'Work Order', icon: '🔧', description: 'Report maintenance issues' },
    { id: 'payment', label: 'Payment', icon: '💳', description: 'Schedule rent or fees' },
    { id: 'service', label: 'Service', icon: '🏠', description: 'Book cleaning, pest control' },
    { id: 'event', label: 'Event RSVP', icon: '🎉', description: 'Community events' },
    { id: 'community', label: 'Community Post', icon: '📝', description: 'Share with neighbors' },
  ];

  const suggestions = [
    { id: 1, type: 'payment', title: 'Rent Due Soon', description: 'Due in 3 days - $1,550', priority: 'high' },
    { id: 2, type: 'service', title: 'Quarterly Cleaning', description: 'Schedule your quarterly deep clean', priority: 'medium' },
    { id: 3, type: 'event', title: 'Rooftop BBQ', description: 'This Saturday 6PM - RSVP needed', priority: 'low' },
  ];

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCreatingOrder(false);
      setCurrentStep(1);
      setShowScheduleMenu(false);
      handleAction("Submitted", selectedScheduleType);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      setIsCreatingOrder(false);
      setShowScheduleMenu(true);
    }
  };

  const startScheduling = (type: string) => {
    setSelectedScheduleType(type);
    setIsCreatingOrder(true);
    setShowScheduleMenu(false);
    setCurrentStep(1);
  };

  if (isCreatingOrder) {
    return (
      <div className="px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Schedule {selectedScheduleType}</h1>
          <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>

        {currentStep === 1 && (
          <SwipeCard
            onSwipeRight={{
              label: "Continue",
              action: nextStep,
              color: "#3B82F6"
            }}
            onSwipeLeft={{
              label: "Back",
              action: prevStep,
              color: "#6B7280"
            }}
          >
            <div className="p-6 text-center">
              <div className="mb-6">
                <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-4xl">📸</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {selectedScheduleType === 'work-order' ? 'Take a Photo' : 'Add Details'}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedScheduleType === 'work-order' ? 'Capture the issue you\'d like to report' : 'Provide information about your request'}
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
                {selectedScheduleType === 'work-order' ? 'Open Camera' : 'Add Info'}
              </button>
            </div>
          </SwipeCard>
        )}

        {currentStep === 2 && (
          <SwipeCard
            onSwipeRight={{
              label: "Continue",
              action: nextStep,
              color: "#3B82F6"
            }}
            onSwipeLeft={{
              label: "Back",
              action: prevStep,
              color: "#6B7280"
            }}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Time</h3>
              <div className="space-y-3">
                {['Today 2:00 PM', 'Tomorrow 10:00 AM', 'Friday 3:00 PM'].map((time, index) => (
                  <button
                    key={index}
                    className="w-full p-4 border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          </SwipeCard>
        )}

        {currentStep === 3 && (
          <SwipeCard
            onSwipeRight={{
              label: "Submit",
              action: nextStep,
              color: "#10B981"
            }}
            onSwipeLeft={{
              label: "Back",
              action: prevStep,
              color: "#6B7280"
            }}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Submission</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                  <p className="text-gray-600">Details captured ✓</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Scheduled Time</h4>
                  <p className="text-gray-600">Tomorrow 10:00 AM</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">Ready to submit {selectedScheduleType}</p>
                </div>
              </div>
            </div>
          </SwipeCard>
        )}
      </div>
    );
  }

  if (showScheduleMenu) {
    return (
      <div className="px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Schedule Something</h1>
          <button 
            onClick={() => setShowScheduleMenu(false)}
            className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
          >
            <span className="text-gray-600 text-lg">×</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {scheduleTypes.map((type) => (
            <SwipeCard
              key={type.id}
              onSwipeRight={{
                label: "Select",
                action: () => startScheduling(type.label),
                color: "#3B82F6"
              }}
              onTap={() => startScheduling(type.label)}
            >
              <div className="flex items-center p-4 bg-white rounded-lg">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                  <span className="text-2xl">{type.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{type.label}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </div>
              </div>
            </SwipeCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
        <button 
          onClick={() => setShowScheduleMenu(true)}
          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Plus className="text-white" size={24} />
        </button>
      </div>
      
      {/* Calendar */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className={cn("p-3 pointer-events-auto")}
          classNames={{
            day_today: "bg-blue-600 text-white hover:bg-blue-700",
            day_selected: "bg-blue-600 text-white hover:bg-blue-700"
          }}
        />
      </div>

      {/* Daily Suggestions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Suggestions</h2>
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <SwipeCard
              key={suggestion.id}
              onSwipeRight={{
                label: "Schedule",
                action: () => startScheduling(suggestion.type),
                color: "#10B981"
              }}
              onSwipeLeft={{
                label: "Dismiss",
                action: () => handleAction("Dismissed", suggestion.title),
                color: "#6B7280"
              }}
              onTap={() => handleAction("Viewed", suggestion.title)}
            >
              <div className="flex items-center p-4 bg-white rounded-lg border-l-4 border-blue-500">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      suggestion.priority === 'high' ? "bg-red-100 text-red-800" :
                      suggestion.priority === 'medium' ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    )}>
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{suggestion.description}</p>
                </div>
              </div>
            </SwipeCard>
          ))}
        </div>
      </div>

      {/* Scheduled Items */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Scheduled for {format(selectedDate, 'EEEE, MMM d')}</h2>
        
        <div className="flex items-start text-sm text-gray-500">
          <span className="mr-4 mt-2 font-medium">9 AM</span>
          <SwipeCard
            onSwipeRight={{
              label: "Reschedule",
              action: () => handleAction("Rescheduled", "Work Order"),
              color: "#F59E0B"
            }}
            onSwipeLeft={{
              label: "Cancel",
              action: () => handleAction("Cancelled", "Work Order"),
              color: "#EF4444"
            }}
            onTap={() => handleAction("Viewed", "Work Order")}
            className="flex-1"
          >
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
                <span className="text-xl">🔌</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Work Order</h3>
                <p className="text-gray-600 text-sm">Broken outlet</p>
              </div>
            </div>
          </SwipeCard>
        </div>

        <div className="flex items-start text-sm text-gray-500">
          <span className="mr-4 mt-2 font-medium">2 PM</span>
          <SwipeCard
            onSwipeRight={{
              label: "Pay Now",
              action: () => handleAction("Paid", "Rent Payment"),
              color: "#10B981"
            }}
            onSwipeLeft={{
              label: "Reschedule",
              action: () => handleAction("Rescheduled", "Rent Payment"),
              color: "#F59E0B"
            }}
            onTap={() => handleAction("Viewed", "Rent Payment")}
            className="flex-1"
          >
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Rent Payment</h3>
                <p className="text-gray-600 text-sm">$1,550 due</p>
              </div>
            </div>
          </SwipeCard>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;
