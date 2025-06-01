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
    
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);
    
    if (horizontalDistance > 10 || verticalDistance > 10) {
      if (verticalDistance > horizontalDistance * 0.8) {
        const dampedY = deltaY * 0.6;
        setDragOffset({ x: 0, y: Math.max(-80, Math.min(20, dampedY)) });
        if (deltaY < -25 && canProceedFromCurrentStep()) {
          setShowAction('up');
        } else {
          setShowAction(null);
        }
      } else if (horizontalDistance > verticalDistance * 0.8) {
        const dampedX = deltaX * 0.6;
        setDragOffset({ x: Math.max(-80, Math.min(80, dampedX)), y: 0 });
        if (deltaX < -40 && currentStep > 1) {
          setShowAction('left');
        } else {
          setShowAction(null);
        }
      } else {
        setDragOffset({ x: 0, y: 0 });
        setShowAction(null);
      }
    }
  };

  const handleTouchEnd = () => {
    const threshold = 30;
    const deltaTime = Date.now() - startTime.current;
    const velocityY = Math.abs(dragOffset.y) / deltaTime;
    const velocityX = Math.abs(dragOffset.x) / deltaTime;
    
    const shouldCompleteUp = (Math.abs(dragOffset.y) > threshold || velocityY > 0.2) && 
                            dragOffset.y < -threshold && canProceedFromCurrentStep();
    const shouldCompleteLeft = (Math.abs(dragOffset.x) > threshold || velocityX > 0.2) && 
                              dragOffset.x < -threshold && currentStep > 1;
    
    if (shouldCompleteUp) {
      onNextStep();
    } else if (shouldCompleteLeft) {
      onPrevStep();
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    const progress = Math.min(distance / 40, 1);
    return Math.max(0.4, progress * 0.9);
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
