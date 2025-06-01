
import React, { useState } from 'react';
import SwipeCard from '../SwipeCard';
import { useToast } from '@/hooks/use-toast';

const ScheduleTab = () => {
  const { toast } = useToast();
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule</h1>
      <p className="text-gray-600 mb-6">Manage your appointments</p>
      
      {/* Create New Work Order */}
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

      {/* Upcoming Appointments */}
      <SwipeCard
        onSwipeRight={{
          label: "Reschedule",
          action: () => handleAction("Rescheduled", "Plumbing Repair"),
          color: "#F59E0B"
        }}
        onSwipeLeft={{
          label: "Cancel",
          action: () => handleAction("Cancelled", "Plumbing Repair"),
          color: "#EF4444"
        }}
        onTap={() => handleAction("Viewed", "Plumbing Repair")}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Upcoming
            </span>
            <span className="text-sm text-gray-500">Tomorrow</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Plumbing Repair</h3>
          <p className="text-gray-600 mb-3">Kitchen sink leak repair</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">⏰ 10:00 AM</span>
            <span>🔧 Maintenance Team</span>
          </div>
        </div>
      </SwipeCard>
    </div>
  );
};

export default ScheduleTab;
