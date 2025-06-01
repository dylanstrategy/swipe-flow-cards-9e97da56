
import React, { useState } from 'react';
import SwipeCard from '../SwipeCard';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Camera, CheckCircle } from 'lucide-react';

interface WorkOrderFlowProps {
  selectedScheduleType: string;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const WorkOrderFlow = ({ selectedScheduleType, currentStep, onNextStep, onPrevStep }: WorkOrderFlowProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [workOrderDetails, setWorkOrderDetails] = useState({
    title: '',
    description: '',
    location: ''
  });

  const availableTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      onNextStep();
    }, 2000);
  };

  const handleDetailsSubmit = () => {
    if (workOrderDetails.title && workOrderDetails.description) {
      onNextStep();
    }
  };

  const handleScheduleSubmit = () => {
    if (selectedDate && selectedTime) {
      onNextStep();
    }
  };

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Work Order</h1>
        <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>

      {currentStep === 1 && (
        <SwipeCard
          onSwipeRight={{
            label: "Take Photo",
            action: handleCapture,
            color: "#3B82F6"
          }}
          onSwipeLeft={{
            label: "Back",
            action: onPrevStep,
            color: "#6B7280"
          }}
        >
          <div className="p-6 text-center">
            <div className="mb-6 relative">
              {isCapturing ? (
                <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Camera viewfinder animation */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
                  <div className="relative z-10">
                    {/* Outlet illustration */}
                    <div className="w-24 h-32 bg-amber-100 rounded-lg border-2 border-amber-200 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-amber-200 rounded border border-amber-300 flex items-center justify-center mb-2">
                        <div className="flex flex-col space-y-1">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                          </div>
                          <div className="w-4 h-1 bg-gray-800 rounded"></div>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-amber-200 rounded border border-amber-300 flex items-center justify-center">
                        <div className="flex flex-col space-y-1">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                          </div>
                          <div className="w-4 h-1 bg-gray-800 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Camera flash effect */}
                  <div className="absolute inset-0 bg-white opacity-0 animate-pulse"></div>
                  {/* Viewfinder corners */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                  <Camera className="text-gray-400" size={48} />
                </div>
              )}
            </div>
            {!isCapturing && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Take a Photo</h3>
                <p className="text-gray-600 mb-4">Capture the issue you'd like to report</p>
                <button 
                  onClick={handleCapture}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Open Camera
                </button>
              </>
            )}
            {isCapturing && (
              <p className="text-white text-lg font-medium mt-4">Capturing photo...</p>
            )}
          </div>
        </SwipeCard>
      )}

      {currentStep === 2 && (
        <SwipeCard
          onSwipeRight={{
            label: "Continue",
            action: handleDetailsSubmit,
            color: "#3B82F6"
          }}
          onSwipeLeft={{
            label: "Back",
            action: onPrevStep,
            color: "#6B7280"
          }}
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
                <input
                  type="text"
                  value={workOrderDetails.title}
                  onChange={(e) => setWorkOrderDetails({...workOrderDetails, title: e.target.value})}
                  placeholder="e.g., Broken outlet"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={workOrderDetails.description}
                  onChange={(e) => setWorkOrderDetails({...workOrderDetails, description: e.target.value})}
                  placeholder="Describe the issue in detail..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={workOrderDetails.location}
                  onChange={(e) => setWorkOrderDetails({...workOrderDetails, location: e.target.value})}
                  placeholder="e.g., Kitchen, Living room"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </SwipeCard>
      )}

      {currentStep === 3 && (
        <SwipeCard
          onSwipeRight={{
            label: "Continue",
            action: handleScheduleSubmit,
            color: "#3B82F6"
          }}
          onSwipeLeft={{
            label: "Back",
            action: onPrevStep,
            color: "#6B7280"
          }}
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule Repair</h3>
            
            {/* Calendar */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Select Date</h4>
              <div className="bg-white rounded-lg border border-gray-200">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className={cn("p-3 pointer-events-auto")}
                  disabled={(date) => date < new Date()}
                />
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Available Times</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "p-3 border rounded-lg text-sm font-medium transition-colors",
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
        </SwipeCard>
      )}

      {currentStep === 4 && (
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
            <div className="text-center mb-6">
              <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Submit</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Work Order Details</h4>
                <p className="text-sm text-gray-600 mb-1"><strong>Issue:</strong> {workOrderDetails.title || 'Broken outlet'}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Location:</strong> {workOrderDetails.location || 'Kitchen'}</p>
                <p className="text-sm text-gray-600"><strong>Description:</strong> {workOrderDetails.description || 'Outlet not working properly'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Scheduled Time</h4>
                <p className="text-gray-600">
                  {selectedDate ? selectedDate.toLocaleDateString() : 'Tomorrow'} at {selectedTime || '10:00 AM'}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-medium">Ready to submit work order</p>
                <p className="text-green-600 text-sm">You'll receive a confirmation once submitted</p>
              </div>
            </div>
          </div>
        </SwipeCard>
      )}
    </div>
  );
};

export default WorkOrderFlow;
