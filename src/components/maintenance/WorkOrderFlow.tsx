
import React, { useState } from 'react';
import SwipeableScreen from '@/components/schedule/SwipeableScreen';
import WorkOrderDetailsStep from './steps/WorkOrderDetailsStep';
import WorkOrderDiagnosisStep from './steps/WorkOrderDiagnosisStep';
import WorkOrderResolutionStep from './steps/WorkOrderResolutionStep';
import WorkOrderRescheduleStep from './steps/WorkOrderRescheduleStep';
import { Button } from '@/components/ui/button';

interface WorkOrderFlowProps {
  workOrder: any;
  onClose: () => void;
}

const WorkOrderFlow = ({ workOrder, onClose }: WorkOrderFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [completionPhoto, setCompletionPhoto] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendorCost, setVendorCost] = useState('');
  const [resolutionType, setResolutionType] = useState<'complete' | 'vendor' | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState('');

  const canProceedFromCurrentStep = (): boolean => {
    if (showReschedule) {
      return rescheduleDate !== undefined && rescheduleTime !== '';
    }
    
    switch (currentStep) {
      case 1:
        return true; // Always can proceed from details view
      case 2:
        return diagnosisNotes.trim() !== '';
      case 3:
        return resolutionType === 'complete' ? completionPhoto !== '' : 
               (selectedVendor !== '' && vendorCost !== '');
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (showReschedule) {
      console.log('Work order rescheduled');
      onClose();
      return;
    }

    if (canProceedFromCurrentStep()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit work order
        console.log('Work order completed');
        onClose();
      }
    }
  };

  const handlePrevStep = () => {
    if (showReschedule) {
      setShowReschedule(false);
      return;
    }
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReschedule = () => {
    setShowReschedule(true);
  };

  const getStepTitle = () => {
    if (showReschedule) return 'Reschedule Work Order';
    
    switch (currentStep) {
      case 1: return 'Work Order Details';
      case 2: return 'Diagnosis';
      case 3: return 'Resolution';
      default: return 'Work Order';
    }
  };

  const renderCurrentStep = () => {
    if (showReschedule) {
      return (
        <WorkOrderRescheduleStep
          workOrder={workOrder}
          selectedDate={rescheduleDate}
          setSelectedDate={setRescheduleDate}
          selectedTime={rescheduleTime}
          setSelectedTime={setRescheduleTime}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return <WorkOrderDetailsStep workOrder={workOrder} />;
      case 2:
        return (
          <WorkOrderDiagnosisStep 
            diagnosisNotes={diagnosisNotes}
            setDiagnosisNotes={setDiagnosisNotes}
          />
        );
      case 3:
        return (
          <WorkOrderResolutionStep
            resolutionType={resolutionType}
            setResolutionType={setResolutionType}
            completionPhoto={completionPhoto}
            setCompletionPhoto={setCompletionPhoto}
            selectedVendor={selectedVendor}
            setSelectedVendor={setSelectedVendor}
            vendorCost={vendorCost}
            setVendorCost={setVendorCost}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SwipeableScreen
      title={getStepTitle()}
      currentStep={showReschedule ? 1 : currentStep}
      totalSteps={showReschedule ? 1 : 3}
      onClose={onClose}
      onSwipeUp={canProceedFromCurrentStep() ? handleNextStep : undefined}
      onSwipeLeft={showReschedule || currentStep > 1 ? handlePrevStep : undefined}
      canSwipeUp={canProceedFromCurrentStep()}
      rightButton={
        !showReschedule && currentStep === 1 ? (
          <Button variant="outline" size="sm" onClick={handleReschedule}>
            Reschedule
          </Button>
        ) : undefined
      }
    >
      {renderCurrentStep()}
    </SwipeableScreen>
  );
};

export default WorkOrderFlow;
