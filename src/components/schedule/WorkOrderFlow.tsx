
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
  const [showPrompt, setShowPrompt] = useState(false);
  
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

  const nextStep = () => {
    if (currentStep < 4) {
      onNextStep();
      setShowPrompt(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      onPrevStep();
      setShowPrompt(false);
    }
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
  };

  const handleClearData = () => {
    // Clear all data based on current step
    if (currentStep === 1) {
      setPhotoCaptured(false);
    } else if (currentStep === 2) {
      setWorkOrderDetails({
        title: '',
        description: '',
        location: ''
      });
    } else if (currentStep === 3) {
      setSelectedDate(undefined);
      setSelectedTime('');
    }
  };

  // Auto-show prompt when content is ready and not already showing
  useEffect(() => {
    if (currentStep < 4 && canProceedFromCurrentStep() && !showPrompt) {
      setShowPrompt(true);
    } else if (!canProceedFromCurrentStep() && showPrompt) {
      setShowPrompt(false);
    }
  }, [currentStep, photoCaptured, workOrderDetails, selectedDate, selectedTime, showPrompt]);

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
    <SwipeableScreen
      title="Create Work Order"
      currentStep={currentStep}
      totalSteps={4}
      onClose={onClose}
      onSwipeUp={currentStep < 4 && canProceedFromCurrentStep() ? nextStep : undefined}
      onSwipeLeft={currentStep > 1 ? prevStep : undefined}
      canSwipeUp={canProceedFromCurrentStep()}
      hideSwipeHandling={currentStep === 4}
    >
      <div className="h-full overflow-hidden relative">
        <div className={currentStep < 4 ? "pb-32" : ""}>
          {renderCurrentStep()}
        </div>
        
        {/* Conditional SwipeUpPrompt - Only show on steps 1-3 when ready and prompt is shown */}
        {currentStep < 4 && showPrompt && canProceedFromCurrentStep() && (
          <SwipeUpPrompt 
            onContinue={nextStep}
            onBack={currentStep > 1 ? prevStep : undefined}
            onClose={handleClosePrompt}
            onClear={handleClearData}
            message="Ready to continue!"
            buttonText="Continue"
            showBack={currentStep > 1}
          />
        )}
      </div>
    </SwipeableScreen>
  );
};

export default WorkOrderFlow;
