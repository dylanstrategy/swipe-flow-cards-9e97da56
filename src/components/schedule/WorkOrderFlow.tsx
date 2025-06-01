
import React from 'react';
import SwipeCard from '../SwipeCard';

interface WorkOrderFlowProps {
  selectedScheduleType: string;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const WorkOrderFlow = ({ selectedScheduleType, currentStep, onNextStep, onPrevStep }: WorkOrderFlowProps) => {
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
            action: onNextStep,
            color: "#3B82F6"
          }}
          onSwipeLeft={{
            label: "Back",
            action: onPrevStep,
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
            action: onNextStep,
            color: "#3B82F6"
          }}
          onSwipeLeft={{
            label: "Back",
            action: onPrevStep,
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
            action: onNextStep,
            color: "#10B981"
          }}
          onSwipeLeft={{
            label: "Back",
            action: onPrevStep,
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
};

export default WorkOrderFlow;
