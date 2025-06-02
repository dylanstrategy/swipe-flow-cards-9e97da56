
import React, { useState } from 'react';
import SwipeableScreen from '@/components/schedule/SwipeableScreen';
import { TextSlide, PhotoCaptureSlide, SelectionSlide, DateSlide, ReviewSlide } from '../slides';
import { Wrench, Camera, Users, Calendar } from 'lucide-react';
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
  const [resolutionType, setResolutionType] = useState<string>('');
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState('');

  const resolutionOptions = [
    { value: 'complete', label: 'Mark as Complete', description: 'Issue has been resolved' },
    { value: 'vendor', label: 'Refer to Vendor', description: 'Requires external contractor' },
    { value: 'parts', label: 'Waiting for Parts', description: 'Need to order parts first' }
  ];

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
        return resolutionType !== '';
      case 4:
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
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
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

  const handleSubmit = () => {
    console.log('Work order completed:', {
      diagnosis: diagnosisNotes,
      resolution: resolutionType,
      photo: completionPhoto,
      vendor: selectedVendor,
      cost: vendorCost
    });
    onClose();
  };

  const renderCurrentStep = () => {
    if (showReschedule) {
      return (
        <DateSlide
          title="Reschedule Work Order"
          subtitle="Select a new date and time"
          icon={<Calendar className="text-blue-600" size={28} />}
          selectedDate={rescheduleDate}
          setSelectedDate={setRescheduleDate}
          selectedTime={rescheduleTime}
          setSelectedTime={setRescheduleTime}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <ReviewSlide
            title="Work Order Details"
            subtitle="Review the work order information"
            sections={[
              {
                title: "Work Order Information",
                items: [
                  { label: "ID", value: workOrder.id || "WO-001" },
                  { label: "Issue", value: workOrder.title || "Maintenance Request" },
                  { label: "Location", value: workOrder.location || "Unit 101" },
                  { label: "Priority", value: workOrder.priority || "Medium" },
                  { label: "Requested", value: workOrder.date || "Today" }
                ]
              }
            ]}
            onSubmit={handleNextStep}
            submitButtonText="Start Diagnosis"
            showPointOfSale={false}
          />
        );
      case 2:
        return (
          <TextSlide
            title="Diagnosis"
            subtitle="Document your findings and diagnosis"
            icon={<Wrench className="text-blue-600" size={28} />}
            fields={[
              {
                label: "Diagnosis Notes",
                value: diagnosisNotes,
                onChange: setDiagnosisNotes,
                placeholder: "Describe what you found and any issues identified...",
                type: "textarea",
                required: true
              }
            ]}
            canProceed={canProceedFromCurrentStep()}
          />
        );
      case 3:
        return (
          <SelectionSlide
            title="Resolution Type"
            subtitle="How will this issue be resolved?"
            icon={<Wrench className="text-blue-600" size={28} />}
            options={resolutionOptions}
            selectedValue={resolutionType}
            setSelectedValue={setResolutionType}
          />
        );
      case 4:
        if (resolutionType === 'complete') {
          return (
            <PhotoCaptureSlide
              title="Completion Photo"
              subtitle="Take a photo of the completed work"
              capturedPhoto={completionPhoto}
              setCapturedPhoto={setCompletionPhoto}
            />
          );
        } else {
          return (
            <TextSlide
              title="Vendor Information"
              subtitle="Provide vendor details and cost estimate"
              icon={<Users className="text-blue-600" size={28} />}
              fields={[
                {
                  label: "Vendor/Contractor",
                  value: selectedVendor,
                  onChange: setSelectedVendor,
                  placeholder: "Name of vendor or contractor",
                  required: true
                },
                {
                  label: "Estimated Cost",
                  value: vendorCost,
                  onChange: setVendorCost,
                  placeholder: "$0.00",
                  required: true
                }
              ]}
              canProceed={canProceedFromCurrentStep()}
            />
          );
        }
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    if (showReschedule) return 'Reschedule Work Order';
    
    switch (currentStep) {
      case 1: return 'Work Order Details';
      case 2: return 'Diagnosis';
      case 3: return 'Resolution Type';
      case 4: return resolutionType === 'complete' ? 'Completion Photo' : 'Vendor Details';
      default: return 'Work Order';
    }
  };

  return (
    <SwipeableScreen
      title={getStepTitle()}
      currentStep={showReschedule ? 1 : currentStep}
      totalSteps={showReschedule ? 1 : 4}
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
