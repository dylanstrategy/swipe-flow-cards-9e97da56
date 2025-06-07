import React, { useState, useEffect } from 'react';
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
    const canProceed = canProceedFromCurrentStep();
    console.log('WorkOrder nextStep called:', { currentStep, canProceed, photoCaptured, workOrderDetails, selectedDate, selectedTime });
    
    if (currentStep < 4 && canProceed) {
      console.log('Proceeding to next step');
      onNextStep();
      setShowPrompt(false);
    } else {
      console.log('Cannot proceed - missing requirements');
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

  // Auto-show prompt when content is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      const canProceed = canProceedFromCurrentStep();
      console.log('Auto-show check:', { currentStep, canProceed, showPrompt, photoCaptured, workOrderDetails });
      
      if (currentStep < 4 && canProceed && !showPrompt) {
        setShowPrompt(true);
      } else if (!canProceed && showPrompt) {
        setShowPrompt(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentStep, photoCaptured, workOrderDetails, selectedDate, selectedTime, showPrompt]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PhotoCaptureStep onNext={nextStep} onPhotoCaptured={setPhotoCaptured} />;
      case 2:
        return (
          <DetailsStep 
            onNext={nextStep}
            workOrderDetails={workOrderDetails}
            setWorkOrderDetails={setWorkOrderDetails}
          />
        );
      case 3:
        return (
          <ScheduleStep 
            onNext={nextStep}
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

  const canSwipe = currentStep < 4 && canProceedFromCurrentStep();

  console.log('WorkOrderFlow render:', { currentStep, canSwipe, canProceedFromCurrentStep: canProceedFromCurrentStep() });

  return (
    <>
      <SwipeableScreen
        title="Create Work Order"
        currentStep={currentStep}
        totalSteps={4}
        onClose={onClose}
        onSwipeUp={canSwipe ? nextStep : undefined}
        onSwipeLeft={currentStep > 1 ? prevStep : undefined}
        canSwipeUp={canSwipe}
        hideSwipeHandling={currentStep === 4}
      >
        <div className="h-full overflow-hidden relative">
          <div className={currentStep < 4 ? "pb-40" : ""}>
            {renderCurrentStep()}
          </div>
        </div>
      </SwipeableScreen>
      
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
    </>
  );
};

export default WorkOrderFlow;
