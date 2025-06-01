import React, { useState } from 'react';
import SwipeCard from '../SwipeCard';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Camera, CheckCircle, ArrowUp, X } from 'lucide-react';

interface WorkOrderFlowProps {
  selectedScheduleType: string;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onClose: () => void;
}

const WorkOrderFlow = ({ selectedScheduleType, currentStep, onNextStep, onPrevStep, onClose }: WorkOrderFlowProps) => {
  console.log('WorkOrderFlow rendered - currentStep:', currentStep, 'selectedScheduleType:', selectedScheduleType);

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [workOrderDetails, setWorkOrderDetails] = useState({
    title: '',
    description: '',
    location: ''
  });

  const availableTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const handleCapture = () => {
    console.log('Camera capture initiated');
    setIsCapturing(true);
    setTimeout(() => {
      console.log('Camera capture completed');
      setIsCapturing(false);
      setPhotoCaptured(true);
    }, 2000);
  };

  const canProceedFromDetails = () => {
    return workOrderDetails.title.trim() && workOrderDetails.description.trim();
  };

  const canProceedFromSchedule = () => {
    return selectedDate && selectedTime;
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col overflow-hidden">
      {/* Header with X button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Work Order</h1>
          <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
        </div>
        <button
          onClick={() => {
            console.log('Close button clicked');
            onClose();
          }}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="text-gray-600" size={24} />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content Area - No scrolling, full height */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentStep === 1 && (
          <SwipeCard
            onSwipeUp={photoCaptured ? {
              label: "Continue",
              action: () => {
                console.log('SwipeCard swipe up action called');
                onNextStep();
              },
              color: "#3B82F6",
              icon: "↑"
            } : undefined}
            onSwipeLeft={{
              label: "Back",
              action: () => {
                console.log('SwipeCard swipe left action called');
                onPrevStep();
              },
              color: "#6B7280"
            }}
            className="flex-1 m-4"
          >
            <div className="p-6 text-center h-full flex flex-col justify-center">
              <div className="mb-6 relative flex-shrink-0">
                {isCapturing ? (
                  <div className="w-full h-48 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
                    <div className="relative z-10">
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
                    <div className="absolute inset-0 bg-white opacity-0 animate-pulse"></div>
                    <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white"></div>
                  </div>
                ) : photoCaptured ? (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center relative">
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
                    <div className="absolute top-4 right-4 bg-green-600 rounded-full p-2">
                      <CheckCircle className="text-white" size={20} />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                    <Camera className="text-gray-400" size={48} />
                  </div>
                )}
              </div>
              {!isCapturing && !photoCaptured && (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Take a Photo</h3>
                  <p className="text-gray-600 mb-4">Capture the issue you'd like to report</p>
                  <button 
                    onClick={() => {
                      console.log('Open Camera button clicked');
                      handleCapture();
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Open Camera
                  </button>
                </>
              )}
              {isCapturing && (
                <p className="text-white text-lg font-medium mt-4">Capturing photo...</p>
              )}
              {photoCaptured && (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Photo Captured!</h3>
                  <p className="text-gray-600 mb-4">Swipe up to add details</p>
                  <div className="flex items-center justify-center mb-4">
                    <ArrowUp className="text-blue-600 animate-bounce" size={32} />
                  </div>
                  <button
                    onClick={onNextStep}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </>
              )}
            </div>
          </SwipeCard>
        )}

        {currentStep === 2 && (
          <SwipeCard
            onSwipeUp={canProceedFromDetails() ? {
              label: "Continue",
              action: () => {
                console.log('SwipeCard swipe up action called');
                onNextStep();
              },
              color: "#3B82F6",
              icon: "↑"
            } : undefined}
            onSwipeLeft={{
              label: "Back",
              action: () => {
                console.log('SwipeCard swipe left action called');
                onPrevStep();
              },
              color: "#6B7280"
            }}
            className="flex-1 m-4"
          >
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex-shrink-0">Add Details</h3>
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title *</label>
                  <input
                    type="text"
                    value={workOrderDetails.title}
                    onChange={(e) => setWorkOrderDetails({...workOrderDetails, title: e.target.value})}
                    placeholder="e.g., Broken outlet"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={workOrderDetails.description}
                    onChange={(e) => setWorkOrderDetails({...workOrderDetails, description: e.target.value})}
                    placeholder="Describe the issue in detail..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
              {canProceedFromDetails() && (
                <div className="text-center flex-shrink-0 mt-4">
                  <p className="text-green-600 mb-2">Ready to continue!</p>
                  <ArrowUp className="text-blue-600 animate-bounce mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-500 mb-3">Swipe up to schedule</p>
                  <button
                    onClick={onNextStep}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}
              {!canProceedFromDetails() && (
                <div className="text-center flex-shrink-0 mt-4">
                  <p className="text-gray-500">Please fill in required fields to continue</p>
                </div>
              )}
            </div>
          </SwipeCard>
        )}

        {currentStep === 3 && (
          <SwipeCard
            onSwipeUp={canProceedFromSchedule() ? {
              label: "Continue",
              action: () => {
                console.log('SwipeCard swipe up action called');
                onNextStep();
              },
              color: "#3B82F6",
              icon: "↑"
            } : undefined}
            onSwipeLeft={{
              label: "Back",
              action: () => {
                console.log('SwipeCard swipe left action called');
                onPrevStep();
              },
              color: "#6B7280"
            }}
            className="flex-1 m-4"
          >
            <div className="p-6 h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex-shrink-0">Schedule Repair</h3>
              
              <div className="flex-1 space-y-4">
                <div>
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

              {canProceedFromSchedule() && (
                <div className="text-center flex-shrink-0 mt-4">
                  <p className="text-green-600 mb-2">Schedule selected!</p>
                  <ArrowUp className="text-blue-600 animate-bounce mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-500 mb-3">Swipe up to review</p>
                  <button
                    onClick={onNextStep}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}
              {!canProceedFromSchedule() && (
                <div className="text-center flex-shrink-0 mt-4">
                  <p className="text-gray-500">Please select a date and time to continue</p>
                </div>
              )}
            </div>
          </SwipeCard>
        )}

        {currentStep === 4 && (
          <SwipeCard
            onSwipeUp={{
              label: "Submit",
              action: () => {
                console.log('SwipeCard swipe up action called');
                onNextStep();
              },
              color: "#10B981",
              icon: "↑"
            }}
            onSwipeLeft={{
              label: "Back",
              action: () => {
                console.log('SwipeCard swipe left action called');
                onPrevStep();
              },
              color: "#6B7280"
            }}
            className="flex-1 m-4"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="text-center mb-4 flex-shrink-0">
                <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Submit</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Work Order Details</h4>
                  <p className="text-sm text-gray-600 mb-1"><strong>Issue:</strong> {workOrderDetails.title}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Location:</strong> {workOrderDetails.location}</p>
                  <p className="text-sm text-gray-600"><strong>Description:</strong> {workOrderDetails.description}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Scheduled Time</h4>
                  <p className="text-gray-600">
                    {selectedDate?.toLocaleDateString()} at {selectedTime}
                  </p>
                </div>
              </div>
                
              <div className="bg-green-50 p-4 rounded-lg text-center flex-shrink-0">
                <p className="text-green-800 font-medium">Ready to submit work order</p>
                <p className="text-green-600 text-sm mb-2">You'll receive a confirmation once submitted</p>
                <ArrowUp className="text-green-600 animate-bounce mx-auto mb-2" size={24} />
                <p className="text-sm text-green-600 mb-3">Swipe up to submit</p>
                <button
                  onClick={onNextStep}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Submit Work Order
                </button>
              </div>
            </div>
          </SwipeCard>
        )}
      </div>
    </div>
  );
};

export default WorkOrderFlow;
