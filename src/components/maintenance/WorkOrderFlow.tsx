
import React, { useState } from 'react';
import SwipeableScreen from '@/components/schedule/SwipeableScreen';
import WorkOrderDetailsStep from './steps/WorkOrderDetailsStep';
import WorkOrderDiagnosisStep from './steps/WorkOrderDiagnosisStep';
import WorkOrderResolutionStep from './steps/WorkOrderResolutionStep';

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

  const canProceedFromCurrentStep = (): boolean => {
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
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Work Order Details';
      case 2: return 'Diagnosis';
      case 3: return 'Resolution';
      default: return 'Work Order';
    }
  };

  const renderCurrentStep = () => {
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
      currentStep={currentStep}
      totalSteps={3}
      onClose={onClose}
      onSwipeUp={canProceedFromCurrentStep() ? handleNextStep : undefined}
      onSwipeLeft={currentStep > 1 ? handlePrevStep : undefined}
      canSwipeUp={canProceedFromCurrentStep()}
    >
      {renderCurrentStep()}
    </SwipeableScreen>
  );
};

export default WorkOrderFlow;
