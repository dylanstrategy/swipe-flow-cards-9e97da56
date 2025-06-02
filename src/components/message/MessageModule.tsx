
import React, { useState } from 'react';
import { TextSlide, ReviewSlide } from '../slides';
import SwipeableScreen from '../schedule/SwipeableScreen';
import { MessageCircle } from 'lucide-react';

interface MessageModuleProps {
  onClose: () => void;
  initialSubject?: string;
  recipientType?: 'management' | 'maintenance' | 'leasing';
  mode?: 'compose' | 'reply';
}

const MessageModule = ({ 
  onClose, 
  initialSubject = '', 
  recipientType = 'management',
  mode = 'compose'
}: MessageModuleProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [subject, setSubject] = useState<string>(initialSubject);
  const [message, setMessage] = useState<string>('');

  const canProceedFromCurrentStep = (): boolean => {
    if (currentStep === 1) {
      return subject.trim() !== '' && message.trim() !== '';
    }
    return false; // Review step should not be swipeable
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Message sent:', { subject, message, recipientType });
    onClose();
  };

  const getRecipientTitle = () => {
    switch (recipientType) {
      case 'management':
        return 'Contact Management';
      case 'maintenance':
        return 'Contact Maintenance';
      case 'leasing':
        return 'Contact Leasing Office';
      default:
        return 'Send Message';
    }
  };

  const getRecipientLabel = () => {
    switch (recipientType) {
      case 'management':
        return 'Property Management';
      case 'maintenance':
        return 'Maintenance Team';
      case 'leasing':
        return 'Leasing Office';
      default:
        return 'Recipient';
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TextSlide
            title={getRecipientTitle()}
            subtitle={`Send a message to ${getRecipientLabel()}`}
            icon={<MessageCircle className="text-blue-600" size={28} />}
            fields={[
              {
                label: "Subject",
                value: subject,
                onChange: setSubject,
                placeholder: "What is this message about?",
                required: true
              },
              {
                label: "Message",
                value: message,
                onChange: setMessage,
                placeholder: "Type your message here...",
                type: "textarea",
                required: true
              }
            ]}
            canProceed={canProceedFromCurrentStep()}
          />
        );
      case 2:
        return (
          <ReviewSlide
            title="Review Message"
            subtitle="Please review your message before sending"
            sections={[
              {
                title: "Message Details",
                items: [
                  { label: "To", value: getRecipientLabel() },
                  { label: "Subject", value: subject },
                  { label: "Message", value: message }
                ]
              }
            ]}
            onSubmit={handleSubmit}
            submitButtonText="Send Message"
            showPointOfSale={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SwipeableScreen
      title={getRecipientTitle()}
      currentStep={currentStep}
      totalSteps={2}
      onClose={onClose}
      onSwipeUp={canProceedFromCurrentStep() ? handleNextStep : undefined}
      onSwipeLeft={currentStep > 1 ? handlePrevStep : undefined}
      canSwipeUp={canProceedFromCurrentStep()}
    >
      {renderCurrentStep()}
    </SwipeableScreen>
  );
};

export default MessageModule;
