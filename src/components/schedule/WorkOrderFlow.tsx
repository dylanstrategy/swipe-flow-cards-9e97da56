
import React, { useState } from 'react';
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
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [workOrderDetails, setWorkOrderDetails] = useState({
    title: '',
    description: '',
    location: ''
  });

  const canProceedFromCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return true; // PhotoCaptureStep handles its own validation
      case 2:
        return workOrderDetails.title.trim() && workOrderDetails.description.trim();
      case 3:
        return selectedDate && selectedTime;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PhotoCaptureStep onNext={onNextStep} />;
      case 2:
        return <DetailsStep onNext={onNextStep} />;
      case 3:
        return <ScheduleStep onNext={onNextStep} />;
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
      onSwipeUp={canProceedFromCurrentStep() ? onNextStep : undefined}
      onSwipeLeft={onPrevStep}
      canSwipeUp={canProceedFromCurrentStep()}
    >
      {renderCurrentStep()}
    </SwipeableScreen>
  );
};

export default WorkOrderFlow;
