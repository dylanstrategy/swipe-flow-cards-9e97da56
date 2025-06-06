
import React from 'react';
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
  const handleClose = () => {
    if (onClear) {
      onClear();
    }
    if (onClose) {
      onClose();
    }
  };

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
