
import React, { useState, useRef } from 'react';
import SwipeableScreen from './SwipeableScreen';
import PhotoCaptureStep from './steps/PhotoCaptureStep';
import DetailsStep from './steps/DetailsStep';
import ScheduleStep from './steps/ScheduleStep';
import ReviewStep from './steps/ReviewStep';

interface WorkOrderFlowProps {
  selectedScheduleType: string;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onClose: () => void;
}

const WorkOrderFlow = ({ selectedScheduleType, currentStep, onNextStep, onPrevStep, onClose }: WorkOrderFlowProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<'up' | 'left' | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [workOrderDetails, setWorkOrderDetails] = useState({
    title: '',
    description: '',
    location: ''
  });

  const canProceedFromCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return true; // PhotoCaptureStep handles its own validation
      case 2:
        return workOrderDetails.title.trim() !== '' && workOrderDetails.description.trim() !== '';
      case 3:
        return selectedDate !== undefined && selectedTime !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    // Much more sensitive detection - any movement triggers evaluation
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      // Simple damping for visual feedback
      const dampedX = deltaX * 0.8;
      const dampedY = deltaY * 0.8;
      
      setDragOffset({ x: dampedX, y: dampedY });
      
      // Show action based on primary direction with very low thresholds
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical movement - check for swipe up
        if (deltaY < -15 && canProceedFromCurrentStep()) {
          setShowAction('up');
        } else {
          setShowAction(null);
        }
      } else {
        // Horizontal movement - check for swipe left
        if (deltaX < -30 && currentStep > 1) {
          setShowAction('left');
        } else {
          setShowAction(null);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    const deltaX = dragOffset.x;
    const deltaY = dragOffset.y;
    const deltaTime = Date.now() - startTime.current;
    
    // Calculate velocity for quick swipes
    const velocityY = Math.abs(deltaY) / Math.max(deltaTime, 1);
    const velocityX = Math.abs(deltaX) / Math.max(deltaTime, 1);
    
    // Very low thresholds - either distance OR velocity can trigger
    const upThreshold = 20; // Much lower threshold
    const leftThreshold = 40;
    const velocityThreshold = 0.1; // Lower velocity threshold
    
    const shouldCompleteUp = (Math.abs(deltaY) > upThreshold || velocityY > velocityThreshold) && 
                            deltaY < -10 && canProceedFromCurrentStep(); // Just needs to be moving up
    const shouldCompleteLeft = (Math.abs(deltaX) > leftThreshold || velocityX > velocityThreshold) && 
                              deltaX < -leftThreshold && currentStep > 1;
    
    if (shouldCompleteUp) {
      console.log('Swipe up detected - going to next step');
      onNextStep();
    } else if (shouldCompleteLeft) {
      console.log('Swipe left detected - going to previous step');
      onPrevStep();
    } else {
      console.log('No valid swipe detected', { deltaX, deltaY, velocityX, velocityY });
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    const progress = Math.min(distance / 30, 1); // Lower distance for full opacity
    return Math.max(0.5, progress * 0.9);
  };

  const getRotation = () => {
    if (!isDragging) return 0;
    return (dragOffset.x * 0.01);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PhotoCaptureStep onNext={onNextStep} />;
      case 2:
        return (
          <DetailsStep 
            onNext={onNextStep}
            workOrderDetails={workOrderDetails}
            setWorkOrderDetails={setWorkOrderDetails}
          />
        );
      case 3:
        return (
          <ScheduleStep 
            onNext={onNextStep}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        );
      case 4:
        return (
          <ReviewStep
            onSubmit={onNextStep}
            workOrderDetails={workOrderDetails}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        );
      default:
        return null;
    }
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
        transformOrigin: 'center center',
        touchAction: 'pan-x pan-y'
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
            <div className="text-3xl">↑</div>
            <span>Continue</span>
          </div>
        </div>
      )}

      {showAction === 'left' && currentStep > 1 && (
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

      <SwipeableScreen
        title="Create Work Order"
        currentStep={currentStep}
        totalSteps={4}
        onClose={onClose}
        onSwipeUp={canProceedFromCurrentStep() ? onNextStep : undefined}
        onSwipeLeft={currentStep > 1 ? onPrevStep : undefined}
        canSwipeUp={canProceedFromCurrentStep()}
        hideSwipeHandling={true}
      >
        {renderCurrentStep()}
      </SwipeableScreen>
    </div>
  );
};

export default WorkOrderFlow;
