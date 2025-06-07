
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
      className={`fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 shadow-2xl ${className}`}
      style={{ 
        zIndex: 999999,
        paddingBottom: 'max(20px, env(safe-area-inset-bottom, 0px))',
        transform: 'translateZ(0)',
        willChange: 'transform',
        isolation: 'isolate'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="px-6 py-5 text-center relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          style={{ zIndex: 1000000 }}
        >
          <X size={18} />
        </button>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-600 font-semibold text-base">{message}</p>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <ArrowUp className="text-green-600 animate-bounce" size={28} />
            <p className="text-sm text-gray-500 font-medium">
              Swipe up anywhere to continue{showBack ? ' • Swipe left to go back' : ''}
            </p>
          </div>
          
          <div className="flex gap-3 justify-center pt-2">
            {showBack && onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 hover:bg-gray-50"
              >
                <ArrowLeft size={18} />
                {backButtonText}
              </Button>
            )}
            <Button
              onClick={onContinue}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <ArrowUp size={18} />
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeUpPrompt;
