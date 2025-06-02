
import React, { useState } from 'react';
import SwipeableScreen from './SwipeableScreen';
import { TextSlide, PhotoCaptureSlide, DateSlide, ReviewSlide } from '../slides';
import { Camera, FileText, Calendar } from 'lucide-react';

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
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [workOrderTitle, setWorkOrderTitle] = useState<string>('');
  const [workOrderDescription, setWorkOrderDescription] = useState<string>('');
  const [workOrderLocation, setWorkOrderLocation] = useState<string>('');

  const canProceedFromCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return capturedPhoto !== '';
      case 2:
        return workOrderTitle.trim() !== '' && workOrderDescription.trim() !== '' && workOrderLocation.trim() !== '';
      case 3:
        return selectedDate !== undefined && selectedTime !== '';
      case 4:
        return false; // Review step should not be swipeable
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    console.log('Work order submitted:', {
      photo: capturedPhoto,
      title: workOrderTitle,
      description: workOrderDescription,
      location: workOrderLocation,
      date: selectedDate,
      time: selectedTime
    });
    onClose();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PhotoCaptureSlide
            title="Capture Issue Photo"
            subtitle="Take a photo of the maintenance issue"
            capturedPhoto={capturedPhoto}
            setCapturedPhoto={setCapturedPhoto}
          />
        );
      case 2:
        return (
          <TextSlide
            title="Work Order Details"
            subtitle="Describe the maintenance issue"
            icon={<FileText className="text-blue-600" size={28} />}
            fields={[
              {
                label: "Issue Title",
                value: workOrderTitle,
                onChange: setWorkOrderTitle,
                placeholder: "Brief description of the issue",
                required: true
              },
              {
                label: "Location",
                value: workOrderLocation,
                onChange: setWorkOrderLocation,
                placeholder: "Kitchen, bathroom, living room, etc.",
                required: true
              },
              {
                label: "Detailed Description",
                value: workOrderDescription,
                onChange: setWorkOrderDescription,
                placeholder: "Provide detailed information about the issue",
                type: "textarea",
                required: true
              }
            ]}
            canProceed={canProceedFromCurrentStep()}
          />
        );
      case 3:
        return (
          <DateSlide
            title="Schedule Service"
            subtitle="When would you like this addressed?"
            icon={<Calendar className="text-blue-600" size={28} />}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        );
      case 4:
        return (
          <ReviewSlide
            title="Review Work Order"
            subtitle="Please review your work order details"
            sections={[
              {
                title: "Issue Details",
                items: [
                  { label: "Title", value: workOrderTitle },
                  { label: "Location", value: workOrderLocation },
                  { label: "Description", value: workOrderDescription },
                  { label: "Photo", value: capturedPhoto ? "📸 Photo attached" : "No photo" }
                ]
              },
              {
                title: "Scheduled Time",
                items: [
                  { label: "Date", value: selectedDate?.toLocaleDateString() || "Not selected" },
                  { label: "Time", value: selectedTime || "Not selected" }
                ]
              }
            ]}
            onSubmit={handleSubmit}
            submitButtonText="Submit Work Order"
            pointOfSaleContext="work-order"
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
      onSwipeLeft={currentStep > 1 ? onPrevStep : undefined}
      canSwipeUp={canProceedFromCurrentStep()}
    >
      {renderCurrentStep()}
    </SwipeableScreen>
  );
};

export default WorkOrderFlow;
