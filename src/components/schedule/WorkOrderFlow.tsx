import React, { useState, useRef } from 'react';
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
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [workOrderDetails, setWorkOrderDetails] = useState({
    title: '',
    description: '',
    location: ''
  });

  // Tinder-style swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<'up' | 'left' | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  const availableTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
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

  const canProceedFromCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return photoCaptured;
      case 2:
        return canProceedFromDetails();
      case 3:
        return canProceedFromSchedule();
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Tinder-style touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    lastPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    lastPos.current = { x: touch.clientX, y: touch.clientY };
    
    // Much more responsive - follow finger immediately
    setDragOffset({ x: deltaX * 0.8, y: deltaY * 0.8 });
    
    // Show action hints with lower thresholds
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      // Vertical dominant
      if (deltaY < -30 && canProceedFromCurrentStep()) {
        setShowAction('up');
      } else {
        setShowAction(null);
      }
    } else {
      // Horizontal dominant
      if (deltaX < -30) {
        setShowAction('left');
      } else {
        setShowAction(null);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const deltaX = dragOffset.x;
    const deltaY = dragOffset.y;
    const deltaTime = Date.now() - startTime.current;
    
    // Calculate velocity (pixels per millisecond)
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;
    
    // Much lower thresholds for completion - Tinder style
    const distanceThreshold = 50;
    const velocityThreshold = 0.3;
    
    // Check if swipe should complete based on distance OR velocity
    const shouldCompleteUp = (Math.abs(deltaY) > distanceThreshold || velocityY > velocityThreshold) && 
                            deltaY < -distanceThreshold && canProceedFromCurrentStep();
    const shouldCompleteLeft = (Math.abs(deltaX) > distanceThreshold || velocityX > velocityThreshold) && 
                              deltaX < -distanceThreshold;
    
    if (shouldCompleteUp) {
      onNextStep();
    } else if (shouldCompleteLeft) {
      onPrevStep();
    }
    
    // Reset state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    const progress = Math.min(distance / 80, 1); // Lower threshold for opacity
    return Math.max(0.2, progress * 0.8);
  };

  const getRotation = () => {
    if (!isDragging) return 0;
    // Subtle rotation based on horizontal movement
    return (dragOffset.x * 0.02);
  };

  return (
    <div 
      className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${getRotation()}deg)`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
        transformOrigin: 'center center'
      }}
    >
      {/* Swipe Action Overlays */}
      {showAction === 'up' && canProceedFromCurrentStep() && (
        <div 
          className="absolute inset-0 flex items-start justify-center pt-16 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: '#22C55E',
            opacity: getActionOpacity()
          }}
        >
          <div className="text-white font-bold text-2xl flex flex-col items-center gap-3">
            <ArrowUp size={40} />
            <span>Continue</span>
          </div>
        </div>
      )}

      {showAction === 'left' && (
        <div 
          className="absolute inset-0 flex items-center justify-start pl-12 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: '#EF4444',
            opacity: getActionOpacity()
          }}
        >
          <div className="text-white font-bold text-2xl flex items-center gap-4">
            <span className="text-3xl">←</span>
            <span>Back</span>
          </div>
        </div>
      )}

      {/* Header with X button - Fixed height */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 relative z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create Work Order</h1>
          <span className="text-xs text-gray-500">Step {currentStep} of 4</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="text-gray-600" size={20} />
        </button>
      </div>
      
      {/* Progress Bar - Fixed height */}
      <div className="flex-shrink-0 px-4 py-2 relative z-10">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content Area - Takes remaining space, no scroll */}
      <div className="flex-1 p-4 overflow-hidden relative z-10">
        {currentStep === 1 && (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="mb-4 relative">
              {isCapturing ? (
                <div className="w-48 h-32 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-20 bg-amber-100 rounded-lg border-2 border-amber-200 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-amber-200 rounded border border-amber-300 flex items-center justify-center mb-1">
                        <div className="flex flex-col space-y-1">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                          </div>
                          <div className="w-3 h-0.5 bg-gray-800 rounded"></div>
                        </div>
                      </div>
                      <div className="w-12 h-5 bg-amber-200 rounded border border-amber-300"></div>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white"></div>
                </div>
              ) : photoCaptured ? (
                <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center relative">
                  <div className="w-16 h-20 bg-amber-100 rounded-lg border-2 border-amber-200 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-amber-200 rounded border border-amber-300 flex items-center justify-center mb-1">
                      <div className="flex flex-col space-y-1">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                        </div>
                        <div className="w-3 h-0.5 bg-gray-800 rounded"></div>
                      </div>
                    </div>
                    <div className="w-12 h-5 bg-amber-200 rounded border border-amber-300"></div>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-600 rounded-full p-1">
                    <CheckCircle className="text-white" size={16} />
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                  <Camera className="text-gray-400" size={32} />
                </div>
              )}
            </div>
            
            {!isCapturing && !photoCaptured && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Take a Photo</h3>
                <p className="text-gray-600 mb-4 text-center text-sm">Capture the issue you'd like to report</p>
                <button 
                  onClick={handleCapture}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Open Camera
                </button>
              </>
            )}
            {isCapturing && (
              <p className="text-gray-600 text-sm font-medium mt-4">Capturing photo...</p>
            )}
            {photoCaptured && (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Photo Captured!</h3>
                <p className="text-gray-600 mb-3 text-sm">Swipe up anywhere to continue</p>
                <ArrowUp className="text-green-600 animate-bounce mx-auto mb-3" size={24} />
                <button
                  onClick={onNextStep}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Details</h3>
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title *</label>
                <input
                  type="text"
                  value={workOrderDetails.title}
                  onChange={(e) => setWorkOrderDetails({...workOrderDetails, title: e.target.value})}
                  placeholder="e.g., Broken outlet"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={workOrderDetails.description}
                  onChange={(e) => setWorkOrderDetails({...workOrderDetails, description: e.target.value})}
                  placeholder="Describe the issue in detail..."
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={workOrderDetails.location}
                  onChange={(e) => setWorkOrderDetails({...workOrderDetails, location: e.target.value})}
                  placeholder="e.g., Kitchen, Living room"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            
            {canProceedFromDetails() && (
              <div className="text-center mt-4">
                <p className="text-green-600 mb-2 text-sm">Ready to continue!</p>
                <ArrowUp className="text-green-600 animate-bounce mx-auto mb-2" size={24} />
                <p className="text-xs text-gray-500 mb-3">Swipe up anywhere to schedule</p>
                <button
                  onClick={onNextStep}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
            {!canProceedFromDetails() && (
              <div className="text-center mt-4">
                <p className="text-gray-500 text-sm">Please fill in required fields</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Repair</h3>
            
            <div className="flex-1 flex flex-col">
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Select Date</h4>
                <div className="bg-white rounded-lg border border-gray-200">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className={cn("p-2 pointer-events-auto")}
                    disabled={(date) => date < new Date()}
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0",
                      month: "space-y-2",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-xs font-medium",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-muted-foreground rounded-md w-7 font-normal text-[0.7rem]",
                      row: "flex w-full mt-1",
                      cell: "h-7 w-7 text-center text-xs p-0 relative",
                      day: "h-7 w-7 p-0 font-normal aria-selected:opacity-100 text-xs",
                    }}
                  />
                </div>
              </div>

              {selectedDate && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2 text-sm">Available Times</h4>
                  <div className="grid grid-cols-3 gap-1">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "p-2 border rounded-lg text-xs font-medium transition-colors",
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
              <div className="text-center">
                <p className="text-green-600 mb-2 text-sm">Schedule selected!</p>
                <ArrowUp className="text-green-600 animate-bounce mx-auto mb-2" size={24} />
                <p className="text-xs text-gray-500 mb-3">Swipe up anywhere to review</p>
                <button
                  onClick={onNextStep}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
            {!canProceedFromSchedule() && (
              <div className="text-center">
                <p className="text-gray-500 text-sm">Please select a date and time</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="h-full flex flex-col">
            <div className="text-center mb-4">
              <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Review & Submit</h3>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1 text-sm">Work Order Details</h4>
                <p className="text-xs text-gray-600 mb-1"><strong>Issue:</strong> {workOrderDetails.title}</p>
                <p className="text-xs text-gray-600 mb-1"><strong>Location:</strong> {workOrderDetails.location}</p>
                <p className="text-xs text-gray-600"><strong>Description:</strong> {workOrderDetails.description}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1 text-sm">Scheduled Time</h4>
                <p className="text-gray-600 text-xs">
                  {selectedDate?.toLocaleDateString()} at {selectedTime}
                </p>
              </div>
            </div>
              
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-green-800 font-medium text-sm">Ready to submit work order</p>
              <p className="text-green-600 text-xs mb-2">You'll receive a confirmation</p>
              <ArrowUp className="text-green-600 animate-bounce mx-auto mb-2" size={24} />
              <p className="text-xs text-green-600 mb-3">Swipe up anywhere to submit</p>
              <button
                onClick={onNextStep}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Submit Work Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkOrderFlow;
