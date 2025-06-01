
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import SwipeCard from '../SwipeCard';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ScheduleTab = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const handleAction = (action: string, item: string) => {
    toast({
      title: `${action}`,
      description: `${item} - Action completed`,
    });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCreatingOrder(false);
      setCurrentStep(1);
      handleAction("Submitted", "Work Order");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startCreating = () => {
    setIsCreatingOrder(true);
    setCurrentStep(1);
  };

  if (isCreatingOrder) {
    return (
      <div className="px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Work Order</h1>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Take a Photo</h3>
              <p className="text-gray-600 mb-4">Capture the issue you'd like to report</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
                Open Camera
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
                  <h4 className="font-medium text-gray-900 mb-2">Issue Details</h4>
                  <p className="text-gray-600">Photo captured ✓</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Scheduled Time</h4>
                  <p className="text-gray-600">Tomorrow 10:00 AM</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">Ready to submit work order</p>
                </div>
              </div>
            </div>
          </SwipeCard>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Resident Calendar</h1>
        <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">+</span>
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

      {/* Timeline Items */}
      <div className="space-y-4">
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
          <span className="mr-4 mt-2 font-medium">10:30</span>
          <SwipeCard
            onSwipeRight={{
              label: "Reply",
              action: () => handleAction("Replied", "Message"),
              color: "#8B5CF6"
            }}
            onSwipeLeft={{
              label: "Archive",
              action: () => handleAction("Archived", "Message"),
              color: "#6366F1"
            }}
            onTap={() => handleAction("Opened", "Message")}
            className="flex-1"
          >
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
                <span className="text-xl">✉️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Message</h3>
                <p className="text-gray-600 text-sm">Please submit your...</p>
              </div>
            </div>
          </SwipeCard>
        </div>

        <div className="flex items-start text-sm text-gray-500">
          <span className="mr-4 mt-2 font-medium">11:00</span>
          <SwipeCard
            onSwipeRight={{
              label: "Accept",
              action: () => handleAction("Accepted", "Lease Renewal"),
              color: "#10B981"
            }}
            onSwipeLeft={{
              label: "Decline",
              action: () => handleAction("Declined", "Lease Renewal"),
              color: "#EF4444"
            }}
            onTap={() => handleAction("Viewed", "Lease Renewal")}
            className="flex-1"
          >
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
                <span className="text-xl">🏠</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Renewal</h3>
                <p className="text-gray-600 text-sm">New rent: $1,550</p>
              </div>
            </div>
          </SwipeCard>
        </div>

        <div className="flex items-start text-sm text-gray-500">
          <span className="mr-4 mt-2 font-medium">11:30</span>
          <SwipeCard
            onSwipeRight={{
              label: "Save Deal",
              action: () => handleAction("Saved", "Local Deal"),
              color: "#F59E0B"
            }}
            onSwipeLeft={{
              label: "Skip",
              action: () => handleAction("Skipped", "Local Deal"),
              color: "#6B7280"
            }}
            onTap={() => handleAction("Viewed", "Local Deal")}
            className="flex-1"
          >
            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">
                  20% OFF
                </span>
              </div>
              <div className="w-full h-24 bg-orange-200 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-2xl">🍔</span>
              </div>
            </div>
          </SwipeCard>
        </div>
      </div>

      {/* Create New Work Order */}
      <div className="mt-8">
        <SwipeCard
          onSwipeRight={{
            label: "Start",
            action: startCreating,
            color: "#3B82F6"
          }}
          onTap={startCreating}
        >
          <div className="p-6 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-2xl">➕</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Work Order</h3>
            <p className="text-gray-600">Report an issue or request maintenance</p>
          </div>
        </SwipeCard>
      </div>
    </div>
  );
};

export default ScheduleTab;
