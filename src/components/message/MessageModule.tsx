
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import MessageComposer from './MessageComposer';
import MessageConfirmation from './MessageConfirmation';
import SwipeableScreen from '../schedule/SwipeableScreen';
import SwipeUpPrompt from '@/components/ui/swipe-up-prompt';

interface Attachment {
  id: string;
  name: string;
  type: 'file' | 'photo';
  url: string;
  size?: number;
}

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
  const [showPrompt, setShowPrompt] = useState(false);
  const [messageData, setMessageData] = useState({
    subject: initialSubject,
    message: '',
    recipientType,
    attachments: [] as Attachment[]
  });

  useEffect(() => {
    // Prevent zoom on mount and add input focus handling
    const viewport = document.querySelector('meta[name=viewport]');
    const originalContent = viewport?.getAttribute('content');
    
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Prevent pinch zoom
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent zoom on input focus
    const preventInputZoom = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
      }
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('focusin', preventInputZoom);
    document.addEventListener('focusout', preventInputZoom);

    return () => {
      // Restore original viewport on unmount
      if (viewport && originalContent) {
        viewport.setAttribute('content', originalContent);
      }
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('focusin', preventInputZoom);
      document.removeEventListener('focusout', preventInputZoom);
    };
  }, []);

  const handleSendMessage = (subject: string, message: string, attachments: Attachment[]) => {
    setMessageData({ subject, message, recipientType, attachments });
    setCurrentStep(2);
  };

  const handleDone = () => {
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

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      setShowPrompt(false);
    } else {
      onClose();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowPrompt(false);
    }
  };

  // Updated validation - ALL required fields must be filled
  const canProceedFromCurrentStep = (): boolean => {
    if (currentStep === 1) {
      return messageData.subject.trim() !== '' && messageData.message.trim() !== '';
    }
    return false; // Step 2 (confirmation) should not be swipeable
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
    // Clear all data on current step when X is pressed
    if (currentStep === 1) {
      setMessageData({
        subject: '',
        message: '',
        recipientType,
        attachments: []
      });
    }
  };

  // Auto-show prompt when content is ready and not already showing
  useEffect(() => {
    if (currentStep < 2 && canProceedFromCurrentStep() && !showPrompt) {
      setShowPrompt(true);
    } else if (!canProceedFromCurrentStep() && showPrompt) {
      setShowPrompt(false);
    }
  }, [currentStep, messageData, showPrompt]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MessageComposer
            initialSubject={messageData.subject}
            onSend={handleSendMessage}
            recipientType={recipientType}
            messageData={messageData}
            setMessageData={setMessageData}
          />
        );
      case 2:
        return (
          <MessageConfirmation
            subject={messageData.subject}
            message={messageData.message}
            recipientType={recipientType}
            onDone={handleDone}
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
      onSwipeUp={currentStep < 2 && canProceedFromCurrentStep() ? handleNextStep : undefined}
      onSwipeLeft={currentStep > 1 ? handlePrevStep : undefined}
      canSwipeUp={canProceedFromCurrentStep()}
      hideSwipeHandling={currentStep === 2}
    >
      <div className="h-full overflow-hidden relative">
        <div className={currentStep < 2 ? "pb-32" : ""}>
          {renderCurrentStep()}
        </div>
        
        {/* Conditional SwipeUpPrompt - Only show on step 1 when ALL fields are filled and prompt is shown */}
        {currentStep < 2 && showPrompt && canProceedFromCurrentStep() && (
          <SwipeUpPrompt 
            onContinue={handleNextStep}
            onBack={currentStep > 1 ? handlePrevStep : undefined}
            onClose={handleClosePrompt}
            message="Ready to send!"
            buttonText="Send Message"
            showBack={currentStep > 1}
          />
        )}
      </div>
    </SwipeableScreen>
  );
};

export default MessageModule;
