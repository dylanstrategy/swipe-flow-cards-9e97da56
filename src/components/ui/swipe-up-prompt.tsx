
import React, { useRef, useState } from 'react';
import { ArrowUp, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SwipeUpPromptProps {
  onContinue: () => void;
  onBack?: () => void;
  onClose?: () => void;
  onClear?: () => void;
  message?: string;
  buttonText?: string;
  backButtonText?: string;
  className?: string;
  showBack?: boolean;
}

const SwipeUpPrompt = ({ 
  onContinue,
  onBack,
  onClose,
  onClear,
  message = "Ready to continue!", 
  buttonText = "Continue",
  backButtonText = "Back",
  className = "",
  showBack = false
}: SwipeUpPromptProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startTime = useRef(0);

  const handleClose = () => {
    if (onClear) {
      onClear();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startY.current = touch.clientY;
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaY = startY.current - touch.clientY; // Positive when swiping up
    
    // Prevent default scrolling when swiping up significantly
    if (deltaY > 30) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.changedTouches[0];
    const deltaY = startY.current - touch.clientY; // Positive when swiping up
    const deltaTime = Date.now() - startTime.current;
    const velocity = Math.abs(deltaY) / deltaTime;
    
    // Trigger continue if swiped up significantly or with good velocity
    if ((deltaY > 50 || velocity > 0.3) && deltaY > 0) {
      onContinue();
    }
    
    setIsDragging(false);
  };

  // Add global touch event listeners for swipe detection anywhere on screen
  React.useEffect(() => {
    let startY = 0;
    let startTime = 0;
    
    const handleGlobalTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startY = touch.clientY;
      startTime = Date.now();
    };
    
    const handleGlobalTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const deltaY = startY - touch.clientY; // Positive when swiping up
      const deltaTime = Date.now() - startTime;
      const velocity = Math.abs(deltaY) / deltaTime;
      
      // Only trigger if it's a clear upward swipe
      if ((deltaY > 80 || velocity > 0.5) && deltaY > 0) {
        onContinue();
      }
    };
    
    document.addEventListener('touchstart', handleGlobalTouchStart, { passive: true });
    document.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleGlobalTouchStart);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [onContinue]);

  return (
    <div 
      className={`fixed left-0 right-0 bg-white border-t border-gray-200 shadow-lg ${className}`}
      style={{ 
        position: 'fixed',
        zIndex: 999999,
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: '120px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
        transform: 'translateZ(0)',
        willChange: 'transform',
        // Force the element to always be visible above mobile browser UI
        marginBottom: 'max(0px, calc(100vh - 100dvh))'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="p-4 text-center relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          style={{ zIndex: 1000000 }}
        >
          <X size={20} />
        </button>
        
        <p className="text-green-600 font-medium text-sm mb-2">{message}</p>
        <ArrowUp className="text-green-600 animate-bounce mx-auto mb-3" size={24} />
        <p className="text-xs text-gray-500 mb-4">Swipe up anywhere to continue{showBack ? ' • Swipe left to go back' : ''}</p>
        
        <div className="flex gap-3 justify-center">
          {showBack && onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold"
            >
              <ArrowLeft size={16} />
              {backButtonText}
            </Button>
          )}
          <Button
            onClick={onContinue}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ArrowUp size={16} />
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwipeUpPrompt;
