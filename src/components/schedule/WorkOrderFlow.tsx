import React, { useState, useRef, useEffect } from 'react';
import SwipeableScreen from './SwipeableScreen';
import PhotoCaptureStep from './steps/PhotoCaptureStep';
import DetailsStep from './steps/DetailsStep';
import ScheduleStep from './steps/ScheduleStep';
import ReviewStep from './steps/ReviewStep';
import SwipeUpPrompt from '@/components/ui/swipe-up-prompt';

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
  const [photoCaptured, setPhotoCaptured] = useState(false);

  // Prevent viewport zooming and ensure prompt stays visible
  useEffect(() => {
    const viewport = document.querySelector('meta[name=viewport]');
    const originalContent = viewport?.getAttribute('content');
    
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }

    // Add safe area styles
    document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom, 0px)');

    return () => {
      if (viewport && originalContent) {
        viewport.setAttribute('content', originalContent);
      }
    };
  }, []);

  const canProceedFromCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return photoCaptured;
      case 2:
        return workOrderDetails.title.trim() !== '' && 
               workOrderDetails.description.trim() !== '' && 
               workOrderDetails.location.trim() !== '';
      case 3:
        return selectedDate !== undefined && selectedTime !== '';
      case 4:
        return false; // Review step should not be swipeable
      default:
        return false;
    }
  };

  const isSwipeEnabled = currentStep < 4; // Disable swipe for review step

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isSwipeEnabled) return;
    
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isSwipeEnabled) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      const dampedX = deltaX * 0.8;
      const dampedY = deltaY * 0.8;
      
      setDragOffset({ x: dampedX, y: dampedY });
      
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY < -15 && canProceedFromCurrentStep()) {
          setShowAction('up');
        } else {
          setShowAction(null);
        }
      } else {
        if (deltaX < -20 && currentStep > 1) {
          setShowAction('left');
        } else {
          setShowAction(null);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isSwipeEnabled) return;
    
    const deltaX = dragOffset.x;
    const deltaY = dragOffset.y;
    const deltaTime = Date.now() - startTime.current;
    
    const velocityY = Math.abs(deltaY) / Math.max(deltaTime, 1);
    const velocityX = Math.abs(deltaX) / Math.max(deltaTime, 1);
    
    const upThreshold = 20;
    const leftThreshold = 30;
    const velocityThreshold = 0.1;
    
    const shouldCompleteUp = (Math.abs(deltaY) > upThreshold || velocityY > velocityThreshold) && 
                            deltaY < -10 && canProceedFromCurrentStep();
    const shouldCompleteLeft = (Math.abs(deltaX) > leftThreshold || velocityX > velocityThreshold) && 
                              deltaX < -leftThreshold && currentStep > 1;
    
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
    const progress = Math.min(distance / 25, 1);
    return Math.max(0.5, progress * 0.9);
  };

  const getRotation = () => {
    if (!isDragging) return 0;
    return (dragOffset.x * 0.01);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PhotoCaptureStep onNext={onNextStep} onPhotoCaptured={setPhotoCaptured} />;
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
    <>
      <SwipeableScreen
        title="Create Work Order"
        currentStep={currentStep}
        totalSteps={4}
        onClose={onClose}
        onSwipeUp={canProceedFromCurrentStep() ? onNextStep : undefined}
        onSwipeLeft={currentStep > 1 ? onPrevStep : undefined}
        canSwipeUp={canProceedFromCurrentStep()}
        hideSwipeHandling={currentStep === 4}
      >
        <div className="relative h-full">
          <div className={currentStep < 4 ? "pb-32" : ""}>
            {renderCurrentStep()}
          </div>
        </div>
      </SwipeableScreen>

      {/* Show SwipeUpPrompt for steps 1-3 when ready - positioned absolutely above everything */}
      {currentStep < 4 && canProceedFromCurrentStep() && (
        <SwipeUpPrompt 
          onContinue={onNextStep}
          onBack={currentStep > 1 ? onPrevStep : undefined}
          onClose={onClose}
          message="Ready to continue!"
          buttonText="Continue"
          backButtonText="Back"
          showBack={currentStep > 1}
        />
      )}
    </>
  );
};

export default WorkOrderFlow;
