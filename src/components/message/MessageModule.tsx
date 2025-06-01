
import React, { useState, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import MessageComposer from './MessageComposer';
import MessageConfirmation from './MessageConfirmation';
import SwipeableScreen from '../schedule/SwipeableScreen';

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
  const [messageData, setMessageData] = useState({
    subject: initialSubject,
    message: '',
    recipientType
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<'up' | 'left' | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);

  const handleSendMessage = (subject: string, message: string) => {
    setMessageData({ subject, message, recipientType });
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
    } else {
      onClose();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedFromCurrentStep = (): boolean => {
    if (currentStep === 1) {
      return messageData.subject.trim() !== '' && messageData.message.trim() !== '';
    }
    return true;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    // Much more sensitive detection - any movement triggers evaluation
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      // Simple damping for visual feedback
      const dampedX = deltaX * 0.8;
      const dampedY = deltaY * 0.8;
      
      setDragOffset({ x: dampedX, y: dampedY });
      
      // Show action based on primary direction with very low thresholds
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical movement - check for swipe up
        if (deltaY < -15 && canProceedFromCurrentStep()) {
          setShowAction('up');
        } else {
          setShowAction(null);
        }
      } else {
        // Horizontal movement - check for swipe left (made easier)
        if (deltaX < -20 && currentStep > 1) { // Reduced from -30 to -20
          setShowAction('left');
        } else {
          setShowAction(null);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    const deltaX = dragOffset.x;
    const deltaY = dragOffset.y;
    const deltaTime = Date.now() - startTime.current;
    
    // Calculate velocity for quick swipes
    const velocityY = Math.abs(deltaY) / Math.max(deltaTime, 1);
    const velocityX = Math.abs(deltaX) / Math.max(deltaTime, 1);
    
    // Lower thresholds for easier swiping
    const upThreshold = 20;
    const leftThreshold = 30;
    const velocityThreshold = 0.1;
    
    const shouldCompleteUp = (Math.abs(deltaY) > upThreshold || velocityY > velocityThreshold) && 
                            deltaY < -10 && canProceedFromCurrentStep();
    const shouldCompleteLeft = (Math.abs(deltaX) > leftThreshold || velocityX > velocityThreshold) && 
                              deltaX < -leftThreshold && currentStep > 1;
    
    if (shouldCompleteUp) {
      handleNextStep();
    } else if (shouldCompleteLeft) {
      handlePrevStep();
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    const progress = Math.min(distance / 25, 1);
    return Math.max(0.5, progress * 0.9);
  };

  const getRotation = () => {
    if (!isDragging) return 0;
    return (dragOffset.x * 0.01);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MessageComposer
            initialSubject={messageData.subject}
            onSend={handleSendMessage}
            recipientType={recipientType}
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
    <div
      className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${getRotation()}deg)`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
        transformOrigin: 'center center',
        touchAction: 'pan-x pan-y'
      }}
    >
      {/* Swipe Action Overlays */}
      {showAction === 'up' && canProceedFromCurrentStep() && (
        <div 
          className="absolute inset-0 flex items-start justify-center pt-16 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: '#22C55E',
            opacity: getActionOpacity()
          }}
        >
          <div className="text-white font-bold text-2xl flex flex-col items-center gap-3">
            <div className="text-3xl">↑</div>
            <span>Continue</span>
          </div>
        </div>
      )}

      {showAction === 'left' && currentStep > 1 && (
        <div 
          className="absolute inset-0 flex items-center justify-start pl-12 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: '#EF4444',
            opacity: getActionOpacity()
          }}
        >
          <div className="text-white font-bold text-2xl flex items-center gap-4">
            <span className="text-3xl">←</span>
            <span>Back</span>
          </div>
        </div>
      )}

      <SwipeableScreen
        title={getRecipientTitle()}
        currentStep={currentStep}
        totalSteps={2}
        onClose={onClose}
        onSwipeUp={canProceedFromCurrentStep() ? handleNextStep : undefined}
        onSwipeLeft={currentStep > 1 ? handlePrevStep : undefined}
        canSwipeUp={canProceedFromCurrentStep()}
        hideSwipeHandling={true}
      >
        {renderCurrentStep()}
      </SwipeableScreen>
    </div>
  );
};

export default MessageModule;
