import React, { useState } from 'react';
import SwipeableScreen from '@/components/schedule/SwipeableScreen';
import WorkOrderDetailsStep from './steps/WorkOrderDetailsStep';
import WorkOrderDiagnosisStep from './steps/WorkOrderDiagnosisStep';
import WorkOrderResolutionStep from './steps/WorkOrderResolutionStep';
import WorkOrderRescheduleStep from './steps/WorkOrderRescheduleStep';
import SwipeUpPrompt from '@/components/ui/swipe-up-prompt';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WorkOrderFlowProps {
  selectedScheduleType?: string;
  currentStep?: number;
  onNextStep?: () => void;
  onPrevStep?: () => void;
  onClose: () => void;
  workOrder: any;
  onWorkOrderCompleted?: (workOrderId: string) => void;
}

const WorkOrderFlow = ({ 
  selectedScheduleType, 
  currentStep: externalCurrentStep, 
  onNextStep: externalOnNextStep, 
  onPrevStep: externalOnPrevStep, 
  workOrder, 
  onClose, 
  onWorkOrderCompleted 
}: WorkOrderFlowProps) => {
  const { toast } = useToast();
  const [internalCurrentStep, setInternalCurrentStep] = useState(1);
  const [showPrompt, setShowPrompt] = useState(false);
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [completionPhoto, setCompletionPhoto] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendorCost, setVendorCost] = useState('');
  const [resolutionType, setResolutionType] = useState<'complete' | 'vendor' | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Use external step control if provided, otherwise use internal
  const currentStep = externalCurrentStep ?? internalCurrentStep;
  const onNextStep = externalOnNextStep ?? (() => setInternalCurrentStep(prev => prev + 1));
  const onPrevStep = externalOnPrevStep ?? (() => setInternalCurrentStep(prev => prev - 1));

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
      toast({
        title: "Work Order Rescheduled",
        description: "The work order has been rescheduled successfully.",
      });
      onClose();
      return;
    }

    if (canProceedFromCurrentStep()) {
      if (currentStep < 3) {
        onNextStep();
        setShowPrompt(false);
      } else {
        // Complete work order
        console.log('Work order completed:', workOrder?.id);
        
        // Notify parent that work order is completed
        if (onWorkOrderCompleted && workOrder?.id) {
          onWorkOrderCompleted(workOrder.id);
        }
        
        toast({
          title: "Work Order Completed",
          description: `Work order ${workOrder?.id || 'N/A'} has been completed successfully.`,
        });
        
        onClose();
      }
    }
  };

  const handlePrevStep = () => {
    if (showReschedule) {
      setShowReschedule(false);
      setShowPrompt(false);
      return;
    }
    
    if (currentStep > 1) {
      onPrevStep();
      setShowPrompt(false);
    }
  };

  const handleReschedule = () => {
    setShowReschedule(true);
    setShowPrompt(false);
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    // Clear all data on current step when X is pressed
    if (showReschedule) {
      setRescheduleDate(undefined);
      setRescheduleTime('');
    } else if (currentStep === 2) {
      setDiagnosisNotes('');
    } else if (currentStep === 3) {
      setResolutionType(null);
      setCompletionPhoto('');
      setSelectedVendor('');
      setVendorCost('');
    }
  };

  // Auto-show prompt when content is ready and not already showing
  React.useEffect(() => {
    if (canProceedFromCurrentStep() && !showPrompt) {
      setShowPrompt(true);
    } else if (!canProceedFromCurrentStep() && showPrompt) {
      setShowPrompt(false);
    }
  }, [currentStep, diagnosisNotes, resolutionType, completionPhoto, selectedVendor, vendorCost, showReschedule, rescheduleDate, rescheduleTime, showPrompt]);

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
      <div className="h-full overflow-hidden relative">
        <div className="pb-32">
          {renderCurrentStep()}
        </div>
        
        {/* Conditional SwipeUpPrompt - Show when ready and prompt is shown */}
        {showPrompt && canProceedFromCurrentStep() && (
          <SwipeUpPrompt 
            onContinue={handleNextStep}
            onBack={showReschedule || currentStep > 1 ? handlePrevStep : undefined}
            onClose={handleClosePrompt}
            message={showReschedule ? "Ready to reschedule!" : currentStep === 3 ? "Ready to complete!" : "Ready to continue!"}
            buttonText={showReschedule ? "Reschedule" : currentStep === 3 ? "Complete" : "Continue"}
            showBack={showReschedule || currentStep > 1}
          />
        )}
      </div>
    </SwipeableScreen>
  );
};

export default WorkOrderFlow;
